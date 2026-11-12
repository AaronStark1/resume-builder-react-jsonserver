import { useEffect, useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'

/** Desktop art direction (pinning, parallax, cursor effects) starts here; below it the page flows. */
export const DESKTOP_QUERY = '(min-width: 992px)'
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY, { noSsr: true })
export const useFinePointer = () => useMediaQuery(FINE_POINTER_QUERY, { noSsr: true })

const SANS = { rest: 800, near: 280 }
const SERIF = { rest: 400, near: 820 }
const RADIUS = 250
const EASE = 0.16

/**
 * Cursor-responsive variable-font weight: heavy sans characters thin out near the pointer while
 * the light serif characters gain weight. Character centres are cached and only re-measured after
 * a resize, a scroll or the pointer re-entering; weights ease towards their target inside a single
 * rAF loop that stops as soon as everything has settled.
 */
export function useProximityWeight(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) return undefined

    const items = Array.from(root.querySelectorAll('.lp-ch')).map((el) => {
      const axis = el.closest('.lp-serif') ? SERIF : SANS
      return { el, axis, x: 0, y: 0, weight: axis.rest, applied: axis.rest }
    })
    if (!items.length) return undefined

    let frame = 0
    let stale = true
    let active = false
    let px = 0
    let py = 0

    const measure = () => {
      for (const item of items) {
        const rect = item.el.getBoundingClientRect()
        item.x = rect.left + rect.width / 2
        item.y = rect.top + rect.height / 2
      }
      stale = false
    }

    const tick = () => {
      frame = 0
      if (stale) measure() // all reads happen before any write
      let settling = false
      for (const item of items) {
        const { rest, near } = item.axis
        let influence = 0
        if (active) {
          const k = Math.max(0, 1 - Math.hypot(px - item.x, py - item.y) / RADIUS)
          influence = k * k * (3 - 2 * k)
        }
        const target = rest + (near - rest) * influence
        item.weight += (target - item.weight) * EASE
        if (Math.abs(target - item.weight) < 1) item.weight = target
        else settling = true
        const next = Math.round(item.weight)
        if (next !== item.applied) {
          item.applied = next
          item.el.style.fontWeight = next === rest ? '' : String(next)
        }
      }
      if (settling) frame = requestAnimationFrame(tick)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      px = event.clientX
      py = event.clientY
      active = true
      schedule()
    }
    const onEnter = () => {
      stale = true
    }
    const onLeave = () => {
      active = false
      schedule()
    }
    const invalidate = () => {
      stale = true
      if (active) schedule()
    }

    root.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerenter', onEnter, { passive: true })
    root.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('resize', invalidate, { passive: true })
    window.addEventListener('scroll', invalidate, { passive: true })

    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerenter', onEnter)
      root.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', invalidate)
      window.removeEventListener('scroll', invalidate)
      if (frame) cancelAnimationFrame(frame)
      for (const item of items) item.el.style.fontWeight = ''
    }
  }, [rootRef, enabled])
}

/** Types `text` out once `start` turns true. Returns the visible part and whether it is still typing. */
export function useTypewriter(text, start, { instant = false, speed = 46, delay = 350 } = {}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start || instant) return undefined
    let interval = 0
    let typed = 0
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        typed += 1
        setCount(typed)
        if (typed >= text.length) window.clearInterval(interval)
      }, speed)
    }, delay)
    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [text, start, instant, speed, delay])

  if (instant) return { typed: text, typing: false }
  return { typed: text.slice(0, count), typing: start && count < text.length }
}

/** Smoothly scrolls to an in-page section, honouring reduced motion. */
export function scrollToSection(id) {
  const target = document.getElementById(id)
  if (!target) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
