import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import CheckIcon from '@mui/icons-material/Check'

/**
 * The builder's progression ribbon: seven numbered stages, styled after print registration marks.
 * A stage is reachable once it has been visited (`furthest`), so earlier stages — and any stage the
 * user has already been to — are one click away; the parent decides whether a jump is allowed.
 */
const StudioStepper = ({ steps, active, furthest, skipped, onSelect }) => {
  const listRef = useRef(null)

  // On narrow screens the ribbon scrolls sideways; keep the active stage centred.
  useEffect(() => {
    const list = listRef.current
    const item = list?.children[active]
    if (!list || !item || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' })
  }, [active])

  return (
    <ol className="st-steps" ref={listRef} aria-label="Resume stages">
      {steps.map((step, index) => {
        const isActive = index === active
        const reachable = index <= furthest
        const state = isActive ? 'active' : index < furthest ? (skipped.has(index) ? 'skipped' : 'done') : 'todo'
        return (
          <li key={step.label} className="st-steps__item" data-state={state}>
            <button
              type="button"
              className="st-step"
              disabled={!reachable}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Stage ${index + 1}: ${step.label}${state === 'done' ? ' (completed)' : ''}${
                state === 'skipped' ? ' (skipped)' : ''
              }`}
              onClick={() => onSelect(index)}
            >
              <span className="st-step__num lp-display">
                {String(index + 1).padStart(2, '0')}
                {state === 'done' ? (
                  <span className="st-step__badge">
                    <CheckIcon />
                  </span>
                ) : null}
              </span>
              <span className="st-step__label">{step.label}</span>
              {isActive ? (
                <motion.span
                  className="st-step__mark"
                  layoutId="st-step-mark"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              ) : null}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export default StudioStepper
