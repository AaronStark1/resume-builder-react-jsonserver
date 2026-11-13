import { CaptureError, captureViewport, layoutKey, renderScale } from './capture'
import { inkParams } from './params'
import { InkRenderer } from './renderer'
import { crossFadeTheme } from './themeFade'

/**
 * Spread shape over time (reference values). `growth`: base radius at progress 1 relative to
 * the farthest corner. `cleanupFrom`: fraction of the (linear) duration after which a uniform
 * extra reach slowly eats whatever the noise left behind, so the viewport is fully covered
 * exactly at the end. `cleanupReach`: that extra reach at t = 1, relative to the farthest corner.
 */
export const SPREAD = { growth: 0.7, cleanupFrom: 0.45, cleanupReach: 0.4, cleanupPow: 2 }

const FADE_OUT_MS = 150 // final fade of the overlay onto the (already flipped) live page
const QUICK_FADE_MS = 120 // used when the user scrolls/resizes mid-spread
const PREPARED_TTL_MS = 1500 // a capture taken on pointer-down/hover stays usable this long
const WARMUP_DELAY_MS = 2000
const HOLE_PAD_PX = 4 // keeps the toggle's focus ring (2px offset + 2px outline) live too

const easeOutCubic = (t) => 1 - (1 - t) ** 3 // GSAP's power3.out, as in the reference
const otherTheme = (theme) => (theme === 'dark' ? 'light' : 'dark')
/** Snapshots can't work in this browser: SVG snapshot unsupported, or WebGL refused a tainted upload. */
const isUnsupported = (err) => err instanceof CaptureError || err?.name === 'SecurityError'

/**
 * Orchestrates rBuild's ink-bleed theme transition (port of the reference InkTransition):
 *  1. captures the viewport in the current theme (ideally already on pointer-down),
 *  2. covers the page with that snapshot, flips the React theme underneath in the same task,
 *     captures the new theme and spreads the ink between the two snapshots,
 *  3. fades the overlay away onto the already-flipped live page,
 *  4. if toggled mid-spread, freezes the frame on screen and spreads the next ink over it,
 *  5. falls back to a CSS colour cross-fade without WebGL2, with reduced motion, or if a
 *     snapshot can't be taken.
 *
 * Theme state stays in ColorModeProvider: `getTheme` reads the applied theme and `applyTheme`
 * commits a new one synchronously. `target` is the theme the user last asked for.
 */
export class InkTransition {
  constructor({ getTheme, applyTheme }) {
    this.getTheme = getTheme
    this.commitTheme = applyTheme
    this.target = getTheme()
    this.phase = 'idle' // 'idle' | 'preparing' | 'animating'
    this.session = 0
    this.frame = null
    this.state = { progress: 0, time: 0 }
    this.raf = 0
    this.fadeTimer = 0
    this.prepared = null
    this.renderer = undefined // undefined: not created yet, null: unavailable
    this.canvas = null
    this.captureSupported = true
    this.warmUpJob = null
    this.idleId = 0
    this.destroyed = false
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    this.onViewportChange = this.onViewportChange.bind(this)
    window.addEventListener('resize', this.onViewportChange)
    window.addEventListener('scroll', this.onViewportChange, { passive: true })
    this.warmTimer = window.setTimeout(() => this.scheduleWarmUp(), WARMUP_DELAY_MS)
  }

  /**
   * Toggle the theme, spreading from `point` (viewport CSS px) or from `element`'s centre.
   * `element` (the toggle) stays live: above the overlay if its chrome is `data-ink-ignore`,
   * otherwise through a hole in it. Returns the new target theme.
   */
  toggle({ point, element } = {}) {
    if (this.destroyed) return this.target
    this.target = otherTheme(this.target)
    const to = this.target
    if (this.phase === 'preparing') return to // the pending start() re-reads `target`
    if (this.phase === 'animating') {
      this.interrupt(to, point, element)
      return to
    }
    if (!this.canAnimate()) {
      this.crossFade(to)
      return to
    }
    void this.start(to, point, element)
    return to
  }

  /** Programmatic change (e.g. the OS colour scheme changed): no ink, just the cross-fade. */
  set(theme) {
    if (this.destroyed || theme === this.target) return
    this.target = theme
    this.prepared = null
    if (this.phase !== 'idle') this.hide()
    if (this.getTheme() !== theme) this.crossFade(theme)
  }

  /**
   * Intent to toggle (hover, focus, pointer-down): create the WebGL context and capture the
   * current theme now, so the click can start the ink without waiting.
   */
  prepare() {
    if (this.destroyed || this.phase !== 'idle' || !this.canAnimate()) return
    const theme = this.getTheme()
    const key = layoutKey(renderScale())
    const now = performance.now()
    const p = this.prepared
    if (p && p.theme === theme && p.key === key && now - p.time < 200) return // pointerenter+down on touch
    const job = this.capture()
    job.catch(() => {})
    this.prepared = { theme, key, time: now, job }
  }

  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    this.session++
    window.clearTimeout(this.warmTimer)
    if (this.idleId && window.cancelIdleCallback) window.cancelIdleCallback(this.idleId)
    else if (this.idleId) window.clearTimeout(this.idleId)
    window.removeEventListener('resize', this.onViewportChange)
    window.removeEventListener('scroll', this.onViewportChange)
    this.hide()
    this.renderer?.destroy()
    this.canvas?.remove()
    this.renderer = null
    this.canvas = null
  }

  // ---------- transition ----------

  canAnimate() {
    if (this.reducedMotion.matches || !this.captureSupported) return false
    const renderer = this.ensureRenderer()
    return renderer !== null && !renderer.isLost
  }

  async start(to, point, element) {
    const session = ++this.session
    const from = otherTheme(to)
    const renderer = this.renderer
    this.phase = 'preparing'
    try {
      const fromSnap = await this.snapshot(from)
      if (session !== this.session) return
      if (this.target === from) {
        // Toggled back before anything was shown: nothing to do.
        this.phase = 'idle'
        return
      }
      if (fromSnap.key !== layoutKey(renderScale())) throw new Error('viewport changed during capture')
      renderer.upload(from, fromSnap)

      const center = point ?? centerOf(element) ?? viewportCenter()
      this.frame = { from, to, center, maxDist: farthestCorner(center), seed: randomSeed(), hole: holeOf(element) }
      this.state.progress = 0
      this.state.time = 0
      renderer.resize(renderScale())
      this.draw()
      // Same task: the overlay (showing `from`) and the flipped DOM hit the screen together.
      this.show()
      this.commitTheme(to)

      const toSnap = await this.capture()
      if (session !== this.session) return
      if (toSnap.key !== layoutKey(renderScale())) throw new Error('viewport changed during capture')
      renderer.upload(to, toSnap)

      if (this.target === from) {
        // Toggled back while the new theme was being captured. The overlay still shows
        // `from`, so flipping back underneath it is invisible.
        this.commitTheme(from)
        this.hide()
        return
      }
      this.phase = 'animating'
      this.run()
    } catch (err) {
      if (session !== this.session) return
      if (isUnsupported(err)) this.captureSupported = false
      if (import.meta.env.DEV) console.warn('[ink] falling back to a cross-fade:', err)
      this.recover()
    }
  }

  /** Something failed mid-start: end on the requested theme without a visual jump. */
  recover() {
    const applied = this.getTheme()
    if (applied === this.target) {
      if (this.frame) this.fadeOut(FADE_OUT_MS)
      else this.hide()
      return
    }
    if (this.frame?.from === this.target) {
      this.commitTheme(this.target) // the overlay shows the target already
      this.hide()
      return
    }
    this.hide()
    this.crossFade(this.target)
  }

  /** Toggled mid-spread: freeze exactly what is on screen and spread the new ink over it. */
  interrupt(to, point, element) {
    const renderer = this.renderer
    const key = layoutKey(renderScale())
    if (!renderer || renderer.isLost || this.reducedMotion.matches || !renderer.hasValid(to, key)) {
      this.hide()
      this.crossFade(to)
      return
    }
    window.cancelAnimationFrame(this.raf)
    window.clearTimeout(this.fadeTimer)
    this.raf = 0
    this.fadeTimer = 0
    this.session++

    renderer.resize(renderScale())
    const frozen = this.currentFrame()
    const from = frozen && renderer.freeze(frozen) ? 'composite' : this.getTheme()
    const center = point ?? centerOf(element) ?? this.frame.center
    this.frame = {
      from,
      to,
      center,
      maxDist: farthestCorner(center),
      seed: randomSeed(),
      hole: holeOf(element) ?? this.frame.hole,
    }
    this.state.progress = 0
    this.state.time = 0
    this.draw()
    this.show()
    this.commitTheme(to)
    this.phase = 'animating'
    this.run()
  }

  run() {
    window.cancelAnimationFrame(this.raf)
    const started = performance.now()
    const tick = (now) => {
      if (!this.frame) return
      const elapsed = Math.max(0, ((now - started) / 1000) * inkParams.timeScale)
      const linear = Math.min(1, elapsed / inkParams.duration)
      this.state.time = linear * inkParams.duration
      this.state.progress = easeOutCubic(linear)
      this.draw()
      if (linear < 1) this.raf = window.requestAnimationFrame(tick)
      else {
        this.raf = 0
        this.fadeOut(FADE_OUT_MS)
      }
    }
    this.raf = window.requestAnimationFrame(tick)
  }

  currentFrame() {
    if (!this.frame) return null
    const { progress, time } = this.state
    const { maxDist } = this.frame
    const linear = Math.min(1, time / inkParams.duration)
    const ramp = Math.max(0, (linear - SPREAD.cleanupFrom) / (1 - SPREAD.cleanupFrom))
    // Second term only acts in the last ~3% (≈40ms): a guarantee for unlucky seeds so the
    // final frame is exactly the "to" snapshot before the fade.
    const cleanup =
      ramp ** SPREAD.cleanupPow * maxDist * SPREAD.cleanupReach + Math.max(0, (linear - 0.97) / 0.03) * maxDist
    return { ...this.frame, progress, time, radius: progress * maxDist * SPREAD.growth, cleanup }
  }

  draw() {
    const frame = this.currentFrame()
    if (this.renderer && frame) this.renderer.draw(frame)
  }

  show() {
    const canvas = this.canvas
    if (!canvas) return
    canvas.style.transition = 'none'
    canvas.style.opacity = '1'
    canvas.classList.add('is-active')
    // Lifts the chrome that is left out of the snapshots above the canvas (see studio.css).
    document.documentElement.setAttribute('data-ink', 'active')
  }

  fadeOut(ms) {
    window.cancelAnimationFrame(this.raf)
    this.raf = 0
    const canvas = this.canvas
    if (!canvas) {
      this.hide()
      return
    }
    canvas.style.transition = `opacity ${ms}ms linear`
    canvas.style.opacity = '0'
    window.clearTimeout(this.fadeTimer)
    this.fadeTimer = window.setTimeout(() => this.hide(), ms)
  }

  /** Ends the transition: overlay hidden, no input blocked, GPU memory released. */
  hide() {
    window.cancelAnimationFrame(this.raf)
    window.clearTimeout(this.fadeTimer)
    this.raf = 0
    this.fadeTimer = 0
    this.session++
    this.frame = null
    this.phase = 'idle'
    if (this.canvas) {
      this.canvas.classList.remove('is-active')
      this.canvas.style.transition = ''
      this.canvas.style.opacity = ''
    }
    document.documentElement.removeAttribute('data-ink')
    this.renderer?.release()
  }

  crossFade(to) {
    crossFadeTheme(() => this.commitTheme(to))
  }

  /** Viewport snapshots go stale when the page scrolls or resizes: finish quickly instead. */
  onViewportChange() {
    if (this.phase === 'animating' && this.frame && !this.fadeTimer) this.fadeOut(QUICK_FADE_MS)
  }

  // ---------- snapshots ----------

  async snapshot(theme) {
    const p = this.prepared
    this.prepared = null
    const key = layoutKey(renderScale())
    if (p && p.theme === theme && p.key === key && performance.now() - p.time < PREPARED_TTL_MS) {
      try {
        const snap = await p.job
        if (snap.key === layoutKey(renderScale())) return snap
      } catch {
        // Take a fresh one below.
      }
    }
    return this.capture()
  }

  async capture() {
    // WebKit only applies embedded fonts after an SVG image using them has been decoded once.
    await this.warmUp()
    try {
      return await captureViewport({ scale: renderScale(), maxTextureSize: this.renderer?.maxTextureSize })
    } catch (err) {
      if (isUnsupported(err)) this.captureSupported = false
      throw err
    }
  }

  warmUp() {
    if (!this.warmUpJob) {
      this.warmUpJob = captureViewport({ scale: 0.25 })
        .then(() => new Promise((resolve) => window.setTimeout(resolve, 60)))
        .catch((err) => {
          if (isUnsupported(err)) this.captureSupported = false
        })
    }
    return this.warmUpJob
  }

  /** One low-resolution capture in idle time after load, so the first toggle is accurate and quick. */
  scheduleWarmUp() {
    if (this.destroyed || this.reducedMotion.matches || typeof WebGL2RenderingContext === 'undefined') return
    const run = () => {
      this.idleId = 0
      void this.warmUp()
    }
    this.idleId = window.requestIdleCallback
      ? window.requestIdleCallback(run, { timeout: 4000 })
      : window.setTimeout(run, 0)
  }

  ensureRenderer() {
    if (this.renderer !== undefined) return this.renderer
    if (typeof WebGL2RenderingContext === 'undefined') {
      this.renderer = null
      return null
    }
    const canvas = document.createElement('canvas')
    canvas.className = 'ink-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    canvas.setAttribute('data-ink-ignore', '')
    canvas.setAttribute('data-html2canvas-ignore', '') // keeps PDF export captures untouched
    document.body.append(canvas)
    const renderer = InkRenderer.create(canvas)
    if (!renderer) {
      canvas.remove()
      this.renderer = null
      return null
    }
    renderer.watchContext(
      () => this.hide(),
      () => {},
    )
    this.canvas = canvas
    this.renderer = renderer
    return renderer
  }
}

// ---------- geometry ----------

function centerOf(element) {
  const r = element?.getBoundingClientRect?.()
  if (!r || (!r.width && !r.height)) return null
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

function viewportCenter() {
  const el = document.documentElement
  return { x: el.clientWidth / 2, y: el.clientHeight / 2 }
}

/**
 * The toggle's box (CSS px, viewport-relative), kept transparent so it stays live. A toggle inside
 * chrome that is left out of the snapshots (`data-ink-ignore`, i.e. the header) needs no hole: it
 * is not in the texture and it sits above the canvas, so cutting one would only expose a second,
 * slightly offset copy of whatever is behind it.
 */
function holeOf(element) {
  if (element?.closest?.('[data-ink-ignore]')) return null
  const r = element?.getBoundingClientRect?.()
  if (!r || !r.width || !r.height) return null
  const raw = getComputedStyle(element).borderTopLeftRadius || '0'
  const min = Math.min(r.width, r.height)
  const radius = Math.min(raw.endsWith('%') ? (parseFloat(raw) / 100) * min : parseFloat(raw) || 0, min / 2)
  return {
    x: r.left - HOLE_PAD_PX,
    y: r.top - HOLE_PAD_PX,
    w: r.width + HOLE_PAD_PX * 2,
    h: r.height + HOLE_PAD_PX * 2,
    r: radius + HOLE_PAD_PX,
  }
}

function farthestCorner(p) {
  const w = document.documentElement.clientWidth
  const h = document.documentElement.clientHeight
  return (
    Math.max(Math.hypot(p.x, p.y), Math.hypot(w - p.x, p.y), Math.hypot(p.x, h - p.y), Math.hypot(w - p.x, h - p.y)) + 4
  )
}

function randomSeed() {
  return { x: Math.random() * 64 - 32, y: Math.random() * 64 - 32, angle: Math.random() * Math.PI * 2 }
}
