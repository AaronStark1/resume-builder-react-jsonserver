import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { usePageTitle } from '../utils/usePageTitle'
import { ease } from '../motion/variants'
import ScaledPage from '../components/resume/ScaledPage'
import ResumeTemplate from '../components/resume/ResumeTemplate'
import TemplatePicker from '../components/resume/TemplatePicker'
import SplitHeading from '../components/landing/SplitHeading'
import { sampleResume } from '../components/landing/sampleData'
import { CtaLink } from '../components/studio/Bits'
import { accentName, templateName, DEFAULT_ACCENT, DEFAULT_TEMPLATE } from '../config/resumeDesign'
import '../studio/launchpad.css'

const HEADLINE = [[{ text: 'The drafting' }], [{ text: 'studio' }]]

const points = [
  'Structured 7-step guided input form',
  'Real-time live A4 resume preview',
  'Multiple professional templates & accent colors',
  'Instant high-resolution PDF download',
  'Autosaved draft history in browser',
  'Edit anytime with direct sync',
]

const FRAMES = { classic: 'var(--lp-lavender)', modern: 'var(--lp-peach-soft)', minimal: 'var(--lp-sage)' }

const rise = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

/**
 * Studio launchpad: pick a template and an accent on a live sample page, then carry that design
 * into the builder (router state; Form applies it on top of any saved draft).
 */
const ResumeGeneratorPage = () => {
  usePageTitle('Create Resume')
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE)
  const [accent, setAccent] = useState(DEFAULT_ACCENT)
  const preview = useMemo(() => ({ ...sampleResume, template, accentColor: accent }), [template, accent])

  return (
    <div className="st st-launch">
      <div className="st-wrap st-launch__inner">
        {/* LEFT: COPY & DESIGN CONTROLS */}
        <div className="st-launch__copy">
          <motion.p className="lp-eyebrow" {...rise(0.05)}>
            Studio launchpad
          </motion.p>
          <SplitHeading as="h1" className="lp-display st-launch__title" lines={HEADLINE} mode="mount" delay={0.15} />
          <motion.p className="st-sub" {...rise(0.75)}>
            Engineered for recruiters. Tailored for you.
          </motion.p>

          <motion.div className="st-launch__panel" {...rise(0.9)}>
            <TemplatePicker
              currentTemplate={template}
              currentAccent={accent}
              onTemplateChange={setTemplate}
              onAccentChange={setAccent}
            />
          </motion.div>

          <motion.div className="st-launch__cta" {...rise(1.05)}>
            <CtaLink to="/form" state={{ template, accentColor: accent }}>
              Enter Studio &amp; Start Drafting
            </CtaLink>
            <p className="st-note">
              Starting with {templateName(template)} in {accentName(accent)} — you can change both at any time.
            </p>
          </motion.div>

          <motion.ul className="st-launch__points" {...rise(1.2)}>
            {points.map((pt, index) => (
              <li key={pt}>
                <span className="lp-display" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {pt}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* RIGHT: LIVE TEMPLATE PREVIEW */}
        <motion.div
          className="st-launch__stage"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.4 }}
        >
          <div className="st-launch__frame" style={{ '--frame': FRAMES[template] }}>
            <div className="st-launch__frame-head">
              <span>{templateName(template)}</span>
              {accentName(accent)}
              <span className="st-launch__sample">A4 · Sample content</span>
            </div>
            <div className="lp-paper" role="img" aria-label={`Sample resume in the ${templateName(template)} template`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={template}
                  inert
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <ScaledPage>
                    <ResumeTemplate data={preview} />
                  </ScaledPage>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResumeGeneratorPage
