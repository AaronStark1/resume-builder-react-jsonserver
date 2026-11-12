import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'

// Same duration and curve as the ink spread (power3.out), so the icon morphs in lock-step.
const MORPH = { duration: 1.4, ease: [0.215, 0.61, 0.355, 1] }
const RAY_STAGGER_S = MORPH.duration * 0.035
const CENTER = 12

// Sun rays (reference markup). In the moon pose they shrink towards the centre and swing -60°.
const RAYS = [
  [12, 1.5, 12, 3.5],
  [12, 20.5, 12, 22.5],
  [1.5, 12, 3.5, 12],
  [20.5, 12, 22.5, 12],
  [4.58, 4.58, 6, 6],
  [18, 18, 19.42, 19.42],
  [4.58, 19.42, 6, 18],
  [18, 6, 19.42, 4.58],
]

const retract = (x, y) => {
  const a = (-60 * Math.PI) / 180
  const dx = (x - CENTER) * 0.2
  const dy = (y - CENTER) * 0.2
  return [CENTER + dx * Math.cos(a) - dy * Math.sin(a), CENTER + dx * Math.sin(a) + dy * Math.cos(a)]
}

const RAY_POSES = RAYS.map(([x1, y1, x2, y2]) => {
  const [mx1, my1] = retract(x1, y1)
  const [mx2, my2] = retract(x2, y2)
  return {
    sun: { x1, y1, x2, y2, opacity: 1 },
    moon: { x1: mx1, y1: my1, x2: mx2, y2: my2, opacity: 0 },
  }
})

/**
 * Sun ⇄ moon icon for the theme toggle, after the reference's morphing icon: the body grows into
 * a crescent as a mask disc slides over it, the rays retract one after another and the icon tilts.
 * rBuild's toggle shows the action, so light mode shows the moon ("switch to dark").
 */
const ThemeToggleIcon = ({ mode, size = 20 }) => {
  const moon = mode !== 'dark'
  const reduceMotion = useReducedMotion()
  const maskId = `theme-icon-mask-${useId().replace(/[^\w-]/g, '')}`
  const transition = reduceMotion ? { duration: 0 } : MORPH
  const pose = moon ? 'moon' : 'sun'

  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      initial={false}
      animate={{ rotate: moon ? -25 : 0 }}
      transition={transition}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <mask id={maskId}>
          <rect x="-6" y="-6" width="36" height="36" fill="#fff" />
          <motion.circle
            r="7.2"
            fill="#000"
            initial={false}
            animate={moon ? { cx: 17.2, cy: 6.8 } : { cx: 30, cy: -6 }}
            transition={transition}
          />
        </mask>
      </defs>
      <motion.circle
        cx="12"
        cy="12"
        fill="currentColor"
        mask={`url(#${maskId})`}
        initial={false}
        animate={{ r: moon ? 8.5 : 5 }}
        transition={transition}
      />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        {RAY_POSES.map((ray, i) => (
          <motion.line
            key={i}
            initial={false}
            animate={ray[pose]}
            transition={reduceMotion ? transition : { ...MORPH, delay: i * RAY_STAGGER_S }}
          />
        ))}
      </g>
    </motion.svg>
  )
}

export default ThemeToggleIcon
