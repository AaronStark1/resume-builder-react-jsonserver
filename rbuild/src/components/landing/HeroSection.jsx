import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { ease } from '../../motion/variants'
// Photo: fountain pen on paper — Unsplash (free licence), resized and recompressed for the hero.
import heroPhoto from '../../assets/landing/hero-writing.jpg'
import { CtaLink, EditorialLink } from '../studio/Bits'
import MiniResume from './MiniResume'
import ResumeCursorCard from './ResumeCursorCard'
import { ScoreBlock } from './ResumeBlocks'
import SplitHeading from './SplitHeading'
import { scrollToSection, useFinePointer, useIsDesktop, useProximityWeight } from './hooks'

const HEADLINE = [
  [{ text: 'Your story.' }],
  [{ text: 'Your' }, { text: 'next move.', serif: true, accent: true, underline: true }],
]

// Entrance choreography (~2.3s): navigation → headline → copy → actions → resume details.
const rise = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
})

const stage = {
  hidden: {},
  show: { transition: { delayChildren: 1, staggerChildren: 0.2 } },
}
const backSheet = {
  hidden: { opacity: 0, y: 50, rotate: 0 },
  show: { opacity: 1, y: 0, rotate: -7, transition: { duration: 1, ease } },
}
const frontSheet = {
  hidden: { opacity: 0, y: 70, rotate: 12 },
  show: { opacity: 1, y: 0, rotate: 4, transition: { duration: 1.1, ease } },
}
const pop = {
  hidden: { opacity: 0, scale: 0.8, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease } },
}

const CURSOR_CARD_DELAY_MS = 1900

const HeroSection = () => {
  const heroRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const isDesktop = useIsDesktop()
  const finePointer = useFinePointer()
  // Cursor-driven effects are a desktop, fine-pointer, full-motion enhancement only.
  const interactive = isDesktop && finePointer && !reduceMotion
  const [cursorReady, setCursorReady] = useState(false)
  const [photoFailed, setPhotoFailed] = useState(false)

  useProximityWeight(heroRef, interactive)

  // The cursor card joins once the entrance has played, so it never competes with the headline.
  useEffect(() => {
    if (!interactive) return undefined
    const timer = window.setTimeout(() => setCursorReady(true), CURSOR_CARD_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [interactive])

  return (
    <section id="story" className="lph" ref={heroRef}>
      <div className="lph__media" aria-hidden="true">
        {photoFailed ? null : (
          <img
            src={heroPhoto}
            alt=""
            width="1400"
            height="1051"
            decoding="async"
            fetchPriority="high"
            onError={() => setPhotoFailed(true)}
          />
        )}
      </div>

      <div className="lph__inner">
        <div className="lph__copy" data-cursor-hide>
          <motion.p className="lp-eyebrow" {...rise(0.15)}>
            Free &amp; open-source resume builder
          </motion.p>

          <SplitHeading as="h1" className="lp-display lph__title" lines={HEADLINE} mode="mount" delay={0.3} />

          <div className="lph__row">
            <motion.p className="lph__lede" {...rise(1.15)}>
              Everything you’ve done. Everything you’re capable of. Bring your professional story together.
            </motion.p>
            <motion.div className="lph__actions" {...rise(1.35)}>
              <CtaLink to="/form">Build your resume</CtaLink>
              <EditorialLink
                href="#templates"
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection('templates')
                }}
              >
                Explore templates
              </EditorialLink>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="lph__stage"
          role="img"
          aria-label="A sample resume built with rBuild, with a sample resume score of 100"
          variants={stage}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="lph__float"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div className="lph__sheet lph__sheet--back" variants={backSheet} />
            <motion.div className="lph__sheet lph__sheet--front" variants={frontSheet}>
              <MiniResume template="classic" />
            </motion.div>
            <motion.div className="lph__score" data-tone="cream" variants={pop}>
              <ScoreBlock delay={1.7} />
            </motion.div>
            <motion.div className="lph__tag" variants={pop}>
              <span>Sample</span>A4 · PDF
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {interactive && cursorReady ? <ResumeCursorCard heroRef={heroRef} /> : null}
    </section>
  )
}

export default HeroSection
