import { useId } from 'react'
import { motion } from 'motion/react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import '../../studio/controls.css'

const calculateResumeScore = (resume = {}) => {
  let score = 0
  const tips = []

  // 1. Personal Details (20 pts)
  if (resume.personalDetails?.name?.trim()) {
    score += 10
  } else {
    tips.push('Add your full name')
  }

  if (resume.personalDetails?.title?.trim()) {
    score += 10
  } else {
    tips.push('Add your professional job title or target role')
  }

  // 2. Contact Details (15 pts)
  if (resume.contactDetails?.email?.trim()) {
    score += 10
  } else {
    tips.push('Add an email address')
  }

  if (resume.contactDetails?.phoneNumber?.trim()) {
    score += 5
  } else {
    tips.push('Include a contact phone number')
  }

  // 3. Education (15 pts)
  const hasEd =
    Boolean(resume.education?.course?.trim()) ||
    (Array.isArray(resume.educationList) &&
      resume.educationList.some((e) => e.course?.trim()))

  if (hasEd) {
    score += 15
  } else {
    tips.push('Add your degree or education credentials')
  }

  // 4. Experience & Bullets (20 pts)
  const experiences = Array.isArray(resume.experienceList) && resume.experienceList.length > 0
    ? resume.experienceList
    : (resume.professionalDetails?.jobTitle ? [resume.professionalDetails] : [])

  if (experiences.length > 0) {
    score += 10
    const hasBullets = experiences.some(
      (exp) => Array.isArray(exp.bullets) && exp.bullets.length > 0
    )
    if (hasBullets) {
      score += 10
    } else {
      tips.push('Add bullet points highlighting specific achievements in your experience')
    }
  } else {
    tips.push('Add your work experience or internship details')
  }

  // 5. Skills (15 pts)
  const skillsCount = Array.isArray(resume.skills) ? resume.skills.length : 0
  if (skillsCount >= 5) {
    score += 15
  } else if (skillsCount >= 1) {
    score += 8
    tips.push(`Add ${5 - skillsCount} more skills to reach the recommended 5+ skills`)
  } else {
    tips.push('Add at least 5 core technical or soft skills')
  }

  // 6. Professional Summary (15 pts)
  const summaryLength = (resume.summary || '').trim().length
  if (summaryLength >= 150) {
    score += 15
  } else if (summaryLength > 0) {
    score += 7
    tips.push('Expand your summary to at least 150 characters for better impact')
  } else {
    tips.push('Write a professional summary outlining your background and goals')
  }

  return {
    score: Math.min(score, 100),
    tips: tips.slice(0, 3), // Show top 3 actionable tips
  }
}

const SEAL_TEXT = 'Completeness seal · ATS-friendly structure · '

// Milestones: the seal straightens up as the resume fills in, and catches the light at 100.
const tierOf = (score) => (score === 100 ? 'complete' : score >= 80 ? 'strong' : score >= 50 ? 'steady' : 'early')
const TILT = { early: -16, steady: -10, strong: -4, complete: 0 }

/**
 * Completeness score as an embossed stamp. The score and tips come from `calculateResumeScore`
 * (unchanged); `compact` is the tighter layout used in the builder's live pane.
 */
const ResumeScore = ({ data, compact = false }) => {
  const { score, tips } = calculateResumeScore(data)
  const tier = tierOf(score)
  const ringId = `st-seal-ring-${useId().replace(/[^\w-]/g, '')}`

  return (
    <section className="st-card st-score no-print" data-tier={tier} data-compact={compact ? '' : undefined}>
      <motion.div
        className="st-seal"
        role="img"
        aria-label={`Resume completeness score: ${score} percent`}
        initial={false}
        animate={{ rotate: TILT[tier] }}
        transition={{ type: 'spring', stiffness: 160, damping: 14 }}
      >
        <svg viewBox="0 0 120 120" focusable="false" aria-hidden="true">
          <defs>
            <path id={ringId} d="M60 60m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0" />
          </defs>
          <circle className="st-seal__edge" cx="60" cy="60" r="57" />
          <text className="st-seal__text">
            <textPath href={`#${ringId}`} textLength="288" lengthAdjust="spacing">
              {SEAL_TEXT}
            </textPath>
          </text>
          <circle className="st-seal__track" cx="60" cy="60" r="35" />
          <circle
            className="st-seal__value"
            cx="60"
            cy="60"
            r="35"
            pathLength="100"
            strokeDasharray={`${score} 100`}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <span className="st-seal__score lp-display" aria-hidden="true">
          {score}
          <small>%</small>
        </span>
        {tier === 'complete' ? (
          <span className="st-seal__sheen" aria-hidden="true">
            <motion.span
              initial={{ x: '-140%' }}
              animate={{ x: '140%' }}
              transition={{ duration: 1.3, ease: 'easeInOut', delay: 0.25 }}
            />
          </span>
        ) : null}
      </motion.div>

      <div className="st-score__copy">
        {/* SCORE LABEL */}
        <h3 className="st-score__title">Resume Completeness Score</h3>
        <p className="st-note">
          {score >= 80
            ? 'Great job! Your resume covers all core sections.'
            : score >= 50
            ? 'Good progress. Follow the tips below to strengthen it.'
            : 'Add more details to increase recruiter interest.'}
        </p>

        {/* ACTIONABLE TIPS */}
        {tips.length > 0 && (
          <ul className="st-score__tips" aria-label="Actionable tips">
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        )}

        {score === 100 && (
          <p className="st-score__done">
            <CheckCircleIcon />
            All recommended resume sections are complete!
          </p>
        )}
      </div>
    </section>
  )
}

export default ResumeScore
