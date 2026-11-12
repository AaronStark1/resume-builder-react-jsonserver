import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import CheckIcon from '@mui/icons-material/Check'

import { ease } from '../../motion/variants'
import { blockStagger, chipPop, drawLine, drawRing, rise, slideIn, stamp } from './blockMotion'
import { useTypewriter } from './hooks'
import { initialsOf, sampleResume, skillGroups } from './sampleData'

/**
 * The building blocks of a resume, drawn as small pieces of rBuild UI. They are illustrative
 * (sample data, hidden from assistive technology by their parents) and sized in `em`, so the same
 * block works as a cursor-card face and as a large journey card. Each block only declares
 * variants; the parent decides whether it reveals on scroll or is shown in its final state.
 */

const { personalDetails, contactDetails, experienceList, educationList, certifications, summary } = sampleResume

/** Counts up to `value` once visible. The real value is always in the markup as a fallback. */
export const AnimatedNumber = ({ value, play = true, delay = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || !play || !inView || reduceMotion) return undefined
    node.textContent = '0'
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease,
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest))
      },
    })
    return () => {
      controls.stop()
      node.textContent = String(value)
    }
  }, [value, play, delay, inView, reduceMotion])

  return <span ref={ref}>{value}</span>
}

export const IdentityBlock = ({ typeTitle = false, detailed = false, ...motionProps }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const { typed, typing } = useTypewriter(personalDetails.title, inView, { instant: !typeTitle || reduceMotion })

  return (
    <motion.div ref={ref} className="lpb lpb-id" variants={blockStagger()} {...motionProps}>
      <motion.div className="lpb-id__top" variants={rise}>
        <span className="lpb-avatar">{initialsOf(personalDetails.name)}</span>
        <div>
          <div className="lpb-name">{personalDetails.name}</div>
          <div className="lpb-role">
            <span className="lpb-role__ghost">{personalDetails.title}</span>
            <span className="lpb-role__typed">
              {typed}
              {typing ? <span className="lpb-caret" /> : null}
            </span>
          </div>
        </div>
      </motion.div>
      <ul className="lpb-contact">
        <motion.li variants={rise}>
          <MailOutlineIcon />
          {contactDetails.email}
        </motion.li>
        <motion.li variants={rise}>
          <PhoneOutlinedIcon />
          {contactDetails.phoneNumber}
        </motion.li>
        <motion.li variants={rise}>
          <PlaceOutlinedIcon />
          {personalDetails.location}
        </motion.li>
      </ul>
      {detailed ? (
        <motion.p className="lpb-summary" variants={rise}>
          {summary}
        </motion.p>
      ) : null}
    </motion.div>
  )
}

export const TimelineBlock = ({ detailed = false, ...motionProps }) => (
  <motion.div className="lpb lpb-tl" variants={blockStagger(0.16)} {...motionProps}>
    <motion.span className="lpb-tl__line" variants={drawLine} />
    {experienceList.map((role) => (
      <motion.div className="lpb-tl__row" key={role.company} variants={slideIn}>
        <span className="lpb-tl__dot" />
        <div className="lpb-tl__role">{role.jobTitle}</div>
        <div className="lpb-tl__meta">
          {role.company}
          <span>{role.duration}</span>
        </div>
        {detailed ? <div className="lpb-tl__note">{role.bullets[0]}</div> : null}
      </motion.div>
    ))}
  </motion.div>
)

export const SkillsBlock = ({ ...motionProps }) => (
  <motion.div className="lpb lpb-skills" variants={blockStagger(0.05)} {...motionProps}>
    {skillGroups.map((group) => (
      <div className="lpb-skills__group" key={group.label}>
        <motion.div className="lpb-label" variants={rise}>
          {group.label}
        </motion.div>
        <div className="lpb-chips">
          {group.skills.map((skill) => (
            <motion.span
              key={skill}
              className={group.highlight.includes(skill) ? 'lpb-chip lpb-chip--hot' : 'lpb-chip'}
              variants={chipPop}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    ))}
  </motion.div>
)

const Seal = () => (
  <svg viewBox="0 0 100 118" focusable="false">
    <path className="lpb-seal__tail" d="M32 74 22 114l17-9 9 13 6-40zM68 74l10 40-17-9-9 13-6-40z" />
    <circle className="lpb-seal__disc" cx="50" cy="48" r="44" />
    <circle className="lpb-seal__ring" cx="50" cy="48" r="35" />
    <polygon
      className="lpb-seal__star"
      points="50,26 55.6,40.3 70.9,41.2 59,50.9 62.9,65.8 50,57.5 37.1,65.8 41,50.9 29.1,41.2 44.4,40.3"
    />
  </svg>
)

export const AchievementBlock = ({ detailed = false, ...motionProps }) => {
  const certificate = certifications[0]
  const degree = educationList[0]

  return (
    <motion.div className="lpb lpb-ach" variants={blockStagger(0.14)} {...motionProps}>
      <div className="lpb-ach__cert">
        <motion.span className="lpb-seal" variants={stamp}>
          <Seal />
        </motion.span>
        <motion.div variants={rise}>
          <div className="lpb-label">Certification</div>
          <div className="lpb-ach__title">{certificate.name}</div>
          <div className="lpb-ach__meta">
            {certificate.issuer} · {certificate.year}
          </div>
        </motion.div>
      </div>
      {detailed ? (
        <motion.div className="lpb-ach__row" variants={rise}>
          <div className="lpb-label">Education</div>
          <div className="lpb-ach__title">{degree.course}</div>
          <div className="lpb-ach__meta">
            {degree.college} · {degree.year}
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  )
}

const SCORE_CHECKS = ['Identity', 'Experience', 'Skills', 'Summary']

/** The sample resume scores 100 on rBuild's own completeness rubric (see ResumeScore). */
export const ScoreBlock = ({ count = true, delay = 0, ...motionProps }) => (
  <motion.div className="lpb lpb-score" variants={blockStagger(0.1)} {...motionProps}>
    <div className="lpb-score__ring">
      <svg viewBox="0 0 100 100" focusable="false">
        <circle className="lpb-score__track" cx="50" cy="50" r="42" />
        <motion.circle className="lpb-score__value" cx="50" cy="50" r="42" variants={drawRing} />
      </svg>
      <span className="lpb-score__number">
        <AnimatedNumber value={100} play={count} delay={delay} />
      </span>
    </div>
    <div>
      <motion.div className="lpb-label" variants={rise}>
        Sample score
      </motion.div>
      <ul className="lpb-score__list">
        {SCORE_CHECKS.map((item) => (
          <motion.li key={item} variants={rise}>
            <CheckIcon />
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.div>
)
