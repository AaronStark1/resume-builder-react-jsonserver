import { ease } from '../../motion/variants'

/** Variants shared by the resume "building blocks" (identity, timeline, skills, achievements, score). */
export const blockStagger = (step = 0.09, delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
})

export const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
}

export const slideIn = {
  hidden: { opacity: 0, x: 22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}

export const drawLine = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 1.1, ease } },
}

export const chipPop = {
  hidden: { opacity: 0, scale: 0.82, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease } },
}

/** A rubber stamp: lands oversized and rotated, then settles with a little bounce. */
export const stamp = {
  hidden: { opacity: 0, scale: 1.9, rotate: -24 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: -9,
    transition: { type: 'spring', stiffness: 420, damping: 17, mass: 0.9, opacity: { duration: 0.12 } },
  },
}

export const drawRing = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 1.6, ease } },
}

/** Block is already in its final state (cursor card faces). */
export const STATIC_BLOCK = { initial: false, animate: 'show' }

/** Block plays its entrance once, when it scrolls into view. */
export const REVEAL_BLOCK = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.35 } }
