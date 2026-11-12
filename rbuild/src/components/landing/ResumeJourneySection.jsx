import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import CheckIcon from '@mui/icons-material/Check'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'

import { ease, fadeUp } from '../../motion/variants'
import { CtaLink, EditorialLink } from '../studio/Bits'
import MiniResume from './MiniResume'
import { AchievementBlock, IdentityBlock, SkillsBlock, TimelineBlock } from './ResumeBlocks'
import SplitHeading from './SplitHeading'
import { REVEAL_BLOCK, stamp } from './blockMotion'
import { useIsDesktop } from './hooks'

const HEADLINE = [[{ text: 'From blank' }], [{ text: 'to brilliant', serif: true, accent: true }]]
const FINAL_HEADLINE = [[{ text: 'One page.' }, { text: 'All of you.', serif: true, accent: true }]]

/**
 * Stages 01–04. `layer` puts a card in front of or behind the pinned headline; cards that pass
 * behind it use the dark "night" tone so the headline stays legible. `speed` is the parallax rate.
 */
const STAGES = [
  {
    id: 'identity',
    index: '01',
    title: 'Your identity',
    caption: 'Name, title and contact details — the first thing anyone reads.',
    tone: 'lavender',
    layer: 'front',
    speed: 0.9,
    Block: IdentityBlock,
    blockProps: { typeTitle: true, detailed: true },
  },
  {
    id: 'experience',
    index: '02',
    title: 'Your experience',
    caption: 'Roles, dates and the achievements behind them, in order.',
    tone: 'night',
    layer: 'back',
    speed: -0.55,
    Block: TimelineBlock,
    blockProps: { detailed: true },
  },
  {
    id: 'skills',
    index: '03',
    title: 'Your skills',
    caption: 'What you work with and how you work, grouped and easy to scan.',
    tone: 'sage',
    layer: 'front',
    speed: 0.6,
    Block: SkillsBlock,
    blockProps: {},
  },
  {
    id: 'achievements',
    index: '04',
    title: 'Your achievements',
    caption: 'Certifications, education and the milestones worth a stamp.',
    tone: 'butter',
    layer: 'front',
    speed: -0.85,
    Block: AchievementBlock,
    blockProps: { detailed: true },
  },
]

const PARALLAX_PX = 110

/** Scroll-linked vertical drift. `speed` 0 leaves the element in the document flow untouched. */
const Parallax = ({ as = 'div', speed, className, children, ...rest }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed * PARALLAX_PX, speed * -PARALLAX_PX])
  const Tag = as
  return (
    <Tag ref={ref} className={className} {...rest}>
      <motion.div className="lpj__drift" style={speed ? { y } : undefined}>
        {children}
      </motion.div>
    </Tag>
  )
}

const JourneyCard = ({ stage, parallax }) => {
  const { Block } = stage
  return (
    <Parallax
      as="li"
      speed={parallax ? stage.speed : 0}
      className="lpj-card"
      data-stage={stage.id}
      data-tone={stage.tone}
      data-layer={stage.layer}
    >
      <motion.article
        className="lpj-card__body"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease }}
      >
        <header className="lpj-card__head">
          <span className="lp-display">{stage.index}</span>
          <h3>{stage.title}</h3>
        </header>
        <div aria-hidden="true">
          <Block {...REVEAL_BLOCK} {...stage.blockProps} />
        </div>
        <p className="lpj-card__caption">{stage.caption}</p>
      </motion.article>
    </Parallax>
  )
}

// Stage 05: the four parts, as blocks sized to the regions they occupy on the finished page.
const PIECES = [
  { id: 'identity', index: '01', label: 'Identity', tone: 'lavender', top: 3, height: 15, from: { x: -80, y: -46, rotate: -14 } },
  { id: 'experience', index: '02', label: 'Experience', tone: 'night', top: 20, height: 37, from: { x: 88, y: -12, rotate: 10 } },
  { id: 'skills', index: '03', label: 'Skills', tone: 'sage', top: 59, height: 15, from: { x: -94, y: 30, rotate: 8 } },
  { id: 'achievements', index: '04', label: 'Achievements', tone: 'butter', top: 76, height: 21, from: { x: 76, y: 60, rotate: -11 } },
]

const DOCK = [0, 0.62] // pieces travel and align
const DISSOLVE = [0.64, 0.9] // pieces dissolve into the typeset page

const Piece = ({ piece, progress, spread }) => {
  const x = useTransform(progress, DOCK, [`${piece.from.x * spread}%`, '0%'])
  const y = useTransform(progress, DOCK, [piece.from.y, 0])
  const rotate = useTransform(progress, DOCK, [piece.from.rotate, 0])
  const opacity = useTransform(progress, DISSOLVE, [1, 0])
  return (
    <motion.div
      className="lpj-doc__piece"
      data-tone={piece.tone}
      style={{ top: `${piece.top}%`, height: `${piece.height}%`, x, y, rotate, opacity }}
    >
      <span>{piece.index}</span>
      {piece.label}
    </motion.div>
  )
}

const chipIn = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } },
}

/**
 * The culmination: scattered parts align on a blank A4 page, then resolve into the real, typeset
 * resume. Driven by scroll (spring-smoothed); with reduced motion it simply shows the result.
 */
const FinishedResume = ({ spread }) => {
  const docRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [complete, setComplete] = useState(false)

  const { scrollYProgress } = useScroll({ target: docRef, offset: ['start 0.92', 'center 0.52'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.6 })
  const settled = useMotionValue(1)
  const progress = reduceMotion ? settled : smooth

  const pageOpacity = useTransform(progress, [0.58, 0.88], [0, 1])
  const scale = useTransform(progress, [0, 1], [0.9, 1])

  useMotionValueEvent(smooth, 'change', (value) => {
    const next = value > 0.9
    setComplete((current) => (current === next ? current : next))
  })

  const finished = reduceMotion || complete

  return (
    <div className="lpj-doc" ref={docRef}>
      <motion.div className="lpj-doc__sheet" style={{ scale }}>
        <div className="lpj-doc__blank" aria-hidden="true" />
        <motion.div className="lpj-doc__page" style={{ opacity: pageOpacity }}>
          <MiniResume template="classic" label="The finished sample resume: one A4 page in the Classic template" />
        </motion.div>
        <div className="lpj-doc__pieces" aria-hidden="true">
          {PIECES.map((piece) => (
            <Piece key={piece.id} piece={piece} progress={progress} spread={spread} />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="lpj-doc__marks"
        aria-hidden="true"
        initial={false}
        animate={finished ? 'show' : 'hidden'}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
      >
        <motion.span className="lpj-doc__chip lpj-doc__chip--ats" variants={chipIn}>
          <CheckIcon />
          ATS-friendly structure
        </motion.span>
        <motion.span className="lpj-doc__chip lpj-doc__chip--pdf" variants={chipIn}>
          <FileDownloadOutlinedIcon />
          PDF · A4
        </motion.span>
        <motion.span className="lpj-doc__stamp" variants={stamp}>
          <span>Ready</span>
          to send
        </motion.span>
      </motion.div>
    </div>
  )
}

const ResumeJourneySection = () => {
  const isDesktop = useIsDesktop()
  const reduceMotion = useReducedMotion()
  // Desktop with full motion: pinned headline, staggered cards, parallax. Otherwise: natural flow.
  const scene = isDesktop && !reduceMotion

  return (
    <section id="journey" className={scene ? 'lpj lpj--scene' : 'lpj lpj--flow'} aria-labelledby="lpj-heading">
      <div className="lpj__scene">
        <div className="lpj__pin">
          <div className="lpj__head">
            <motion.p
              className="lp-eyebrow"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
            >
              The resume journey
            </motion.p>
            <SplitHeading id="lpj-heading" className="lp-display lpj__title" lines={HEADLINE} delay={0.1} />
            <motion.p
              className="lpj__lede"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
            >
              Your experience. Your skills. Your achievements. Every part of your journey deserves to be presented with
              clarity and confidence.
            </motion.p>
          </div>
        </div>

        <ol className="lpj__cards">
          {STAGES.map((stage) => (
            <JourneyCard key={`${stage.id}-${scene}`} stage={stage} parallax={scene} />
          ))}
        </ol>

        {scene ? (
          <div className="lpj__extras" aria-hidden="true">
            <Parallax speed={1.5} className="lpj-extra lpj-extra--page">
              <MiniResume template="minimal" />
            </Parallax>
            <Parallax speed={-1.2} className="lpj-extra lpj-extra--pill">
              <span>
                <CheckIcon />
                Summary
              </span>
            </Parallax>
            <Parallax speed={0.8} className="lpj-extra lpj-extra--mark">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17" />
              </svg>
            </Parallax>
          </div>
        ) : null}
      </div>

      <div className="lpj__final">
        <motion.p
          className="lp-eyebrow"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          05 — Your finished resume
        </motion.p>
        <SplitHeading as="h3" className="lp-display lpj__final-title" lines={FINAL_HEADLINE} delay={0.1} />

        <FinishedResume spread={isDesktop ? 1 : 0.38} />

        <motion.div
          className="lpj__actions"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          <CtaLink to="/form">Build your resume</CtaLink>
          <EditorialLink to="/history" arrow>
            See saved resumes
          </EditorialLink>
        </motion.div>
        <p className="lpj__note">The resume, score and details shown on this page are sample content.</p>
      </div>
    </section>
  )
}

export default ResumeJourneySection
