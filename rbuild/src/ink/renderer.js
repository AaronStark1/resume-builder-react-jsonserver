import { createProgram } from './program'
import { createNoiseTexture } from './noiseTexture'
import { inkParams, RIM_COLOR } from './params'
import { FULLSCREEN_VERT, INK_FRAG } from './shaders'

/**
 * Owns the overlay canvas' WebGL2 context, the two theme snapshots and the ping-pong
 * "composite" textures used when a transition is interrupted.
 *
 * Ported from the reference InkRenderer. Differences for rBuild:
 *  - snapshots are viewport-sized, so they need no scroll offsets;
 *  - the canvas has an alpha channel so the shader can leave a hole for the live toggle;
 *  - GPU memory is released between transitions (`release`).
 *
 * A frame is `{ from, to, center, radius, cleanup, maxDist, time, progress, seed, hole }`, where
 * `from` / `to` are 'light' | 'dark' and `from` may also be 'composite' (the frozen frame).
 */
export class InkRenderer {
  /** Returns null when WebGL2 is unavailable. */
  static create(canvas) {
    let gl = null
    try {
      gl = canvas.getContext('webgl2', {
        alpha: true, // transparent hole over the live toggle
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'default', // avoid a discrete-GPU switch (and its hitch) for a 1.4s effect
      })
    } catch {
      gl = null
    }
    if (!gl) return null
    try {
      return new InkRenderer(canvas, gl)
    } catch (err) {
      console.error('[ink]', err)
      return null
    }
  }

  constructor(canvas, gl) {
    this.canvas = canvas
    this.gl = gl
    this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
    this.textures = new Map()
    this.composites = []
    this.activeComposite = -1
    this.canvasScale = 1
    this.lost = false
    this.listeners = []
    this.init()
  }

  init() {
    const gl = this.gl
    this.program = createProgram(gl, FULLSCREEN_VERT, INK_FRAG)
    const vao = gl.createVertexArray()
    if (!vao) throw new Error('createVertexArray failed')
    this.vao = vao
    this.noise = createNoiseTexture(gl)
    this.textures.clear()
    this.composites = []
    this.activeComposite = -1
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
  }

  /** Context loss/restore hooks. */
  watchContext(onLost, onRestored) {
    const lost = (e) => {
      e.preventDefault()
      this.lost = true
      this.textures.clear()
      this.composites = []
      this.activeComposite = -1
      onLost()
    }
    const restored = () => {
      this.lost = false
      try {
        this.init()
        onRestored()
      } catch (err) {
        console.error('[ink]', err)
        this.lost = true
      }
    }
    this.canvas.addEventListener('webglcontextlost', lost)
    this.canvas.addEventListener('webglcontextrestored', restored)
    this.listeners.push(['webglcontextlost', lost], ['webglcontextrestored', restored])
  }

  get isLost() {
    return this.lost
  }

  /** Sizes the backing store to the overlay's CSS box at the given DPR. */
  resize(scale) {
    const rect = this.canvas.getBoundingClientRect()
    const w = Math.max(1, Math.round(rect.width * scale))
    const h = Math.max(1, Math.round(rect.height * scale))
    if (this.canvas.width !== w) this.canvas.width = w
    if (this.canvas.height !== h) this.canvas.height = h
    this.canvasScale = rect.width > 0 ? w / rect.width : scale
  }

  /**
   * Uploads a snapshot (`{ canvas, scale, key }`) as the texture for `theme`.
   * Throws a SecurityError if the snapshot canvas is tainted (WebGL only accepts origin-clean sources).
   */
  upload(theme, snapshot) {
    if (this.lost) return
    const gl = this.gl
    let entry = this.textures.get(theme)
    if (!entry) {
      entry = { texture: this.createTexture(), width: 0, height: 0, scale: 0, key: '' }
      this.textures.set(theme, entry)
    }
    entry.key = ''
    gl.bindTexture(gl.TEXTURE_2D, entry.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, snapshot.canvas)
    entry.width = snapshot.canvas.width
    entry.height = snapshot.canvas.height
    entry.scale = snapshot.scale
    entry.key = snapshot.key
  }

  /** True when a snapshot for `theme` exists and matches the current layout. */
  hasValid(theme, key) {
    return !this.lost && this.textures.get(theme)?.key === key
  }

  /**
   * Renders `frame` (normally: exactly what is on screen, minus the toggle hole) into an
   * offscreen texture that later frames can use as `from: 'composite'`. Two textures
   * ping-pong, so a frame that itself reads the composite can be frozen again.
   */
  freeze(frame) {
    if (this.lost) return false
    const gl = this.gl
    const index = this.activeComposite === 0 ? 1 : 0
    const target = this.ensureComposite(index)
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer)
    const ok = this.render(frame, false)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    if (!ok) return false
    this.activeComposite = index
    return true
  }

  draw(frame) {
    if (this.lost) return
    this.render(frame, true)
  }

  /** Frees the snapshot/composite memory between transitions (objects are kept for reuse). */
  release() {
    if (this.lost) return
    const gl = this.gl
    const shrink = (entry) => {
      gl.bindTexture(gl.TEXTURE_2D, entry.texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      entry.width = 1
      entry.height = 1
    }
    for (const entry of this.textures.values()) {
      shrink(entry)
      entry.key = ''
    }
    for (const c of this.composites) if (c) shrink(c)
    this.activeComposite = -1
    this.canvas.width = 1
    this.canvas.height = 1
  }

  /** Drops the context entirely (component unmount). */
  destroy() {
    for (const [type, fn] of this.listeners) this.canvas.removeEventListener(type, fn)
    this.listeners = []
    this.textures.clear()
    this.composites = []
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
    this.lost = true
  }

  // ---------- internals ----------

  createTexture() {
    const gl = this.gl
    const texture = gl.createTexture()
    if (!texture) throw new Error('createTexture failed')
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return texture
  }

  ensureComposite(index) {
    const gl = this.gl
    const { width, height } = this.canvas
    let c = this.composites[index]
    if (!c) {
      const framebuffer = gl.createFramebuffer()
      if (!framebuffer) throw new Error('createFramebuffer failed')
      c = { texture: this.createTexture(), framebuffer, width: 0, height: 0 }
      this.composites[index] = c
    }
    if (c.width !== width || c.height !== height) {
      gl.bindTexture(gl.TEXTURE_2D, c.texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.bindFramebuffer(gl.FRAMEBUFFER, c.framebuffer)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, c.texture, 0)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      c.width = width
      c.height = height
    }
    return c
  }

  sampler(source) {
    if (source === 'composite') {
      const c = this.composites[this.activeComposite]
      if (!c) return null
      return { texture: c.texture, width: c.width, height: c.height, ratio: 1, flipY: true }
    }
    const t = this.textures.get(source)
    if (!t || !t.key) return null
    return { texture: t.texture, width: t.width, height: t.height, ratio: t.scale / this.canvasScale, flipY: false }
  }

  render(frame, withHole) {
    const from = this.sampler(frame.from)
    if (!from) return false
    // Before the target theme has been captured (first frame), show `from` everywhere.
    const to = this.sampler(frame.to) ?? from

    const gl = this.gl
    const { program, uniform } = this.program
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.useProgram(program)
    gl.bindVertexArray(this.vao)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, from.texture)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, to.texture)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, this.noise)

    gl.uniform1i(uniform('uFrom'), 0)
    gl.uniform1i(uniform('uTo'), 1)
    gl.uniform1i(uniform('uNoise'), 2)
    gl.uniform2f(uniform('uFromSize'), from.width, from.height)
    gl.uniform2f(uniform('uToSize'), to.width, to.height)
    gl.uniform4f(uniform('uFromMap'), from.ratio, 0, 0, from.flipY ? 1 : 0)
    gl.uniform4f(uniform('uToMap'), to.ratio, 0, 0, to.flipY ? 1 : 0)
    gl.uniform1f(uniform('uCanvasScale'), this.canvasScale)
    gl.uniform2f(uniform('uRes'), this.canvas.width, this.canvas.height)
    gl.uniform2f(uniform('uCenter'), frame.center.x, frame.center.y)
    gl.uniform1f(uniform('uRadius'), frame.radius)
    gl.uniform1f(uniform('uCleanup'), frame.cleanup)
    gl.uniform1f(uniform('uTime'), frame.time)
    gl.uniform1f(uniform('uRef'), Math.max(this.canvas.width, this.canvas.height) / this.canvasScale)
    gl.uniform2f(uniform('uSeed'), frame.seed.x, frame.seed.y)
    const cos = Math.cos(frame.seed.angle)
    const sin = Math.sin(frame.seed.angle)
    gl.uniformMatrix2fv(uniform('uSeedRot'), false, [cos, sin, -sin, cos])

    gl.uniform1f(uniform('uTendril'), inkParams.tendril)
    gl.uniform1f(uniform('uNoiseScale'), inkParams.noiseScale)
    gl.uniform1f(uniform('uSoftness'), inkParams.softness)
    gl.uniform1f(uniform('uDrift'), inkParams.drift)
    gl.uniform3fv(uniform('uRimColor'), RIM_COLOR[frame.to])

    const hole = withHole ? frame.hole : null
    gl.uniform4f(uniform('uHole'), hole?.x ?? 0, hole?.y ?? 0, hole?.w ?? 0, hole?.h ?? 0)
    gl.uniform1f(uniform('uHoleRadius'), hole?.r ?? 0)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
    return true
  }
}
