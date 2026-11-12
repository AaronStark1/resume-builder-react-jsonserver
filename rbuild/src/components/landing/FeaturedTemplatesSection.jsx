import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'

import { ease, fadeUp } from '../../motion/variants'
import { ArrowBead, EditorialLink } from '../studio/Bits'
import MiniResume from './MiniResume'
import SplitHeading from './SplitHeading'
import { useFinePointer, useIsDesktop } from './hooks'
import { showcaseTemplates } from './sampleData'

const HEADLINE = [[{ text: 'Built for' }], [{ text: 'your next chapter', serif: true, accent: true }]]
const LAST = showcaseTemplates.length - 1

/**
 * A framed, real template preview. The resume itself contains links, so the card is not an anchor:
 * a single stretched link covers it and starts the builder with that template selected.
 */
const TemplateCard = ({ template }) => (
  <div className="lpt-card" style={{ '--frame': template.frame }}>
    <span className="lpt-card__head">
      <span>{template.index}</span>
      {template.descriptor}
      <span className="lpt-card__tag">A4 · Sample</span>
    </span>
    <MiniResume template={template.id} />
    <span className="lpt-card__foot" aria-hidden="true">
      <span className="lp-display lpt-card__name">{template.name}</span>
      <ArrowBead />
    </span>
    <Link
      to="/form"
      state={{ template: template.id }}
      className="lpt-card__link"
      aria-label={`Start a resume with the ${template.name} template`}
    />
  </div>
)

const Intro = () => (
  <>
    <motion.p
      className="lp-eyebrow"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      Find your format
    </motion.p>
    <SplitHeading id="lpt-heading" className="lp-display lpt__title" lines={HEADLINE} delay={0.1} />
    <motion.p
      className="lpt__lede"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      Every career has its own shape. Choose a design that brings your experience, strengths and ambitions together.
    </motion.p>
  </>
)

// Depth `d` of a card: 0 is the focused card, positive values wait behind it, negative ones have
// peeled away. Both halves are linear, so each property is a single interpolation.
const DEPTH = [-1, 0, LAST]

const StackCard = ({ template, index, focus }) => {
  const depth = useTransform(focus, (value) => index - value)
  const x = useTransform(depth, DEPTH, ['-58%', '0%', '25%'])
  const y = useTransform(depth, DEPTH, ['9%', '0%', '-11%'])
  const z = useTransform(depth, DEPTH, [150, 0, -230])
  const rotate = useTransform(depth, DEPTH, [-15, 0, 9])
  const opacity = useTransform(depth, [-0.72, -0.2, 0], [0, 1, 1])
  const pointerEvents = useTransform(depth, (value) => (value < -0.35 ? 'none' : 'auto'))

  return (
    <motion.div className="lpt__slot" style={{ x, y, z, rotate, opacity, pointerEvents, zIndex: LAST - index + 1 }}>
      <TemplateCard template={template} />
    </motion.div>
  )
}

const BADGE_TEXT = 'Real templates · Live A4 preview · '

const RotatingBadge = ({ rotate }) => (
  <div className="lpt__badge" aria-hidden="true">
    <motion.svg viewBox="0 0 120 120" style={{ rotate }} focusable="false">
      <defs>
        <path id="lpt-badge-ring" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
      </defs>
      <text>
        <textPath href="#lpt-badge-ring" textLength="270" lengthAdjust="spacing">
          {BADGE_TEXT}
        </textPath>
      </text>
    </motion.svg>
    <svg className="lpt__badge-mark" viewBox="0 0 24 24" focusable="false">
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    </svg>
  </div>
)

/**
 * Desktop: a 100vh viewport pinned with `position: sticky` inside a tall section. Scroll progress
 * drives one "focus" value (with a hold on every template so each gets its moment); the three
 * cards, the copy and the badge all derive from it. No scroll-jacking — the page scrolls natively.
 */
const PinnedShowcase = () => {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const finePointer = useFinePointer()
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const steps = useTransform(scrollYProgress, [0, 0.14, 0.42, 0.58, 0.86, 1], [0, 0, 1, 1, 2, 2])
  const focus = useSpring(steps, { stiffness: 140, damping: 26, mass: 0.5 })
  const badgeRotate = useTransform(scrollYProgress, [0, 1], [0, 320])

  useMotionValueEvent(focus, 'change', (value) => {
    const next = Math.max(0, Math.min(LAST, Math.round(value)))
    setActive((current) => (current === next ? current : next))
  })

  // Subtle pointer-led tilt of the whole stack.
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 90, damping: 18 })
  const rotateY = useSpring(tiltY, { stiffness: 90, damping: 18 })

  useEffect(() => {
    const stage = stageRef.current
    if (!finePointer || !stage) return undefined
    let rect = null
    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      if (!rect) rect = stage.getBoundingClientRect()
      tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 11)
      tiltX.set(((event.clientY - rect.top) / rect.height - 0.5) * -8)
    }
    const reset = () => {
      rect = null
      tiltX.set(0)
      tiltY.set(0)
    }
    stage.addEventListener('pointermove', onMove, { passive: true })
    stage.addEventListener('pointerleave', reset, { passive: true })
    window.addEventListener('resize', reset, { passive: true })
    return () => {
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', reset)
      window.removeEventListener('resize', reset)
    }
  }, [finePointer, tiltX, tiltY])

  const current = showcaseTemplates[active]

  return (
    <section id="templates" className="lpt lpt--pinned" ref={sectionRef} aria-labelledby="lpt-heading">
      <div className="lpt__sticky">
        <div className="lpt__copy">
          <Intro />

          <div className="lpt__active">
            <div className="lpt__ticks" aria-hidden="true">
              {showcaseTemplates.map((template, index) => (
                <span key={template.id} data-active={index === active ? '' : undefined} />
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                className="lpt__detail"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease }}
              >
                <span className="lp-display lpt__index" aria-hidden="true">
                  {current.index}
                </span>
                <div>
                  <h3 className="lpt__name">
                    {current.name} <span className="lp-serif">— {current.descriptor.toLowerCase()}</span>
                  </h3>
                  <p className="lpt__blurb">{current.blurb}</p>
                  <EditorialLink to="/form" state={{ template: current.id }} arrow>
                    Start with {current.name}
                  </EditorialLink>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="lpt__stage" ref={stageRef}>
          <motion.div className="lpt__stack" style={{ rotateX, rotateY }}>
            {showcaseTemplates.map((template, index) => (
              <StackCard key={template.id} template={template} index={index} focus={focus} />
            ))}
          </motion.div>
          <RotatingBadge rotate={badgeRotate} />
        </div>
      </div>
    </section>
  )
}

/** Tablet, mobile and reduced motion: the same three cards as a layered vertical showcase. */
const FlowShowcase = () => (
  <section id="templates" className="lpt lpt--flow" aria-labelledby="lpt-heading">
    <div className="lpt__copy">
      <Intro />
    </div>

    <ol className="lpt__list">
      {showcaseTemplates.map((template) => (
        <motion.li
          key={template.id}
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
        >
          <TemplateCard template={template} />
          <p className="lpt__caption">{template.blurb}</p>
        </motion.li>
      ))}
    </ol>
  </section>
)

const FeaturedTemplatesSection = () => {
  const isDesktop = useIsDesktop()
  const reduceMotion = useReducedMotion()
  return isDesktop && !reduceMotion ? <PinnedShowcase /> : <FlowShowcase />
}

export default FeaturedTemplatesSection
