import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

import { addResumeAPI } from '../services/allAPIs'
import Swal from 'sweetalert2'
import { sections } from '../config/resumeFields'
import SectionFields from './SectionFields'
import { validateStep, normalizeUrl } from '../utils/validation'
import { getSkillSuggestions } from '../utils/skillSuggestions'
import { ease } from '../motion/variants'
import { CtaButton } from './studio/Bits'
import DossierCard from './studio/DossierCard'
import StudioStepper from './studio/StudioStepper'

const steps = [
  { label: 'Identity', line: 'who you are, in a line' },
  { label: 'Contact', line: 'how they reach you' },
  { label: 'Education', line: 'where you learned your craft' },
  { label: 'Experience', line: 'the work behind the title', optional: true },
  { label: 'Skills', line: 'what you bring to the table' },
  { label: 'Summary', line: 'your story, distilled' },
  { label: 'Review', line: 'one last read-through' },
]
const LAST_STEP = steps.length - 1

const chipMotion = {
  layout: true,
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.6 },
  transition: { type: 'spring', stiffness: 520, damping: 22 },
}

/** A read-only block on the review stage, with a jump back to its stage. */
const ReviewBlock = ({ label, onEdit, children }) => (
  <section className="st-review">
    <div className="st-review__main">
      <h3 className="st-review__label">{label}</h3>
      {children}
    </div>
    <button type="button" className="st-btn st-btn--quiet st-btn--sm" onClick={onEdit}>
      <EditIcon />
      Edit
    </button>
  </section>
)

const FormSteps = ({
  formData,
  setFormData,
  setIsFinished,
  setResumeId,
  isDraftSaved = false
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {
    personalDetails,
    contactDetails,
    educationList = [],
    experienceList = [],
    skills = [],
    summary = ''
  } = formData

  const [activeStep, setActiveStep] = useState(0)
  const [furthestStep, setFurthestStep] = useState(0) // the latest stage visited so far
  const [openEducation, setOpenEducation] = useState(0)
  const [openExperience, setOpenExperience] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [inputSkill, setInputSkill] = useState('')
  const [bulletInputs, setBulletInputs] = useState({})
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const isStepOptional = (step) => Boolean(steps[step]?.optional) // Experience can be skipped for freshers
  const isStepSkipped = (step) => skipped.has(step)

  const suggestions = useMemo(() => {
    return getSkillSuggestions(personalDetails?.title || '')
  }, [personalDetails?.title])

  // Sync educationList with primary education object for backward compatibility
  const updateEducationItem = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.educationList || [])]
      list[index] = { ...list[index], [field]: value }
      return {
        ...prev,
        educationList: list,
        education: list[0] || { course: '', college: '', university: '', year: '' }
      }
    })
  }

  const addEducationItem = () => {
    setFormData((prev) => {
      const list = [...(prev.educationList || [])]
      list.push({ course: '', college: '', university: '', year: '' })
      return { ...prev, educationList: list }
    })
    setOpenEducation(educationList.length) // open the new entry
  }

  const removeEducationItem = (index) => {
    setFormData((prev) => {
      const list = prev.educationList.filter((_, i) => i !== index)
      return {
        ...prev,
        educationList: list,
        education: list[0] || { course: '', college: '', university: '', year: '' }
      }
    })
  }

  // Sync experienceList with primary professionalDetails for backward compatibility
  const updateExperienceItem = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.experienceList || [])]
      list[index] = { ...list[index], [field]: value }
      return {
        ...prev,
        experienceList: list,
        professionalDetails: list[0] || { jobTitle: '', company: '', location: '', duration: '' }
      }
    })
  }

  const addExperienceItem = () => {
    setFormData((prev) => {
      const list = [...(prev.experienceList || [])]
      list.push({ jobTitle: '', company: '', location: '', duration: '', bullets: [] })
      return { ...prev, experienceList: list }
    })
    setOpenExperience(experienceList.length) // open the new entry
  }

  const removeExperienceItem = (index) => {
    setFormData((prev) => {
      const list = prev.experienceList.filter((_, i) => i !== index)
      return {
        ...prev,
        experienceList: list,
        professionalDetails: list[0] || { jobTitle: '', company: '', location: '', duration: '' }
      }
    })
  }

  const moveExperience = (index, direction) => {
    setFormData((prev) => {
      const list = [...prev.experienceList]
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= list.length) return prev
      const [item] = list.splice(index, 1)
      list.splice(targetIndex, 0, item)
      return {
        ...prev,
        experienceList: list,
        professionalDetails: list[0] || { jobTitle: '', company: '', location: '', duration: '' }
      }
    })
  }

  const addBulletPoint = (expIndex) => {
    const text = (bulletInputs[expIndex] || '').trim()
    if (!text) return
    setFormData((prev) => {
      const list = [...prev.experienceList]
      const exp = list[expIndex] || {}
      const bullets = Array.isArray(exp.bullets) ? [...exp.bullets, text] : [text]
      list[expIndex] = { ...exp, bullets }
      return { ...prev, experienceList: list }
    })
    setBulletInputs((prev) => ({ ...prev, [expIndex]: '' }))
  }

  const removeBulletPoint = (expIndex, bulletIndex) => {
    setFormData((prev) => {
      const list = [...prev.experienceList]
      const exp = list[expIndex] || {}
      const bullets = (exp.bullets || []).filter((_, i) => i !== bulletIndex)
      list[expIndex] = { ...exp, bullets }
      return { ...prev, experienceList: list }
    })
  }

  const updateSectionField = (sectionKey, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldName]: value
      }
    }))
    if (errors[fieldName]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[fieldName]
        return copy
      })
    }
  }

  const handleNext = () => {
    const { isValid, errors: stepErrors } = validateStep(activeStep, formData)
    if (!isValid) {
      setErrors(stepErrors)
      if (activeStep === 2) setOpenEducation(0) // the validated fields live in the first entry
      return
    }

    if (activeStep === 1) {
      setFormData((prev) => ({
        ...prev,
        contactDetails: {
          ...prev.contactDetails,
          github: normalizeUrl(prev.contactDetails.github),
          linkedIn: normalizeUrl(prev.contactDetails.linkedIn),
          portfolio: normalizeUrl(prev.contactDetails.portfolio),
        }
      }))
    }

    setErrors({})
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }
    setActiveStep((prev) => prev + 1)
    setFurthestStep((prev) => Math.max(prev, activeStep + 1))
    setSkipped(newSkipped)
  }

  /** Stepper / review jumps. Going back is free; going forward re-validates the current stage. */
  const goToStep = (target) => {
    if (target === activeStep || target > furthestStep) return
    if (target > activeStep) {
      const { isValid, errors: stepErrors } = validateStep(activeStep, formData)
      if (!isValid) {
        setErrors(stepErrors)
        if (activeStep === 2) setOpenEducation(0)
        return
      }
    }
    setErrors({})
    setActiveStep(target)
  }

  const handleBack = () => {
    setErrors({})
    setActiveStep((prev) => prev - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) return
    setErrors({})
    setActiveStep((prev) => prev + 1)
    setFurthestStep((prev) => Math.max(prev, activeStep + 1))
    setSkipped((prev) => new Set(prev).add(activeStep))
  }

  const addSkill = (skill) => {
    const trimmed = (skill || '').trim()
    if (!trimmed) return
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSnackbar({
        open: true,
        message: `"${trimmed}" is already added`,
        severity: 'info'
      })
      return
    }
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }))
    setInputSkill('')
  }

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item !== skillToRemove)
    }))
  }

  const applySummaryTemplate = (templateText) => {
    setFormData((prev) => ({ ...prev, summary: templateText }))
    setSnackbar({
      open: true,
      message: 'Template applied! You can customize it as desired.',
      severity: 'success'
    })
  }

  const handleAddResume = async () => {
    setSubmitting(true)
    try {
      const response = await addResumeAPI(formData)
      if (response?.status === 201 || response?.status === 200) {
        setResumeId(response.data.id)
        setIsFinished(true)
        Swal.fire({
          title: 'Success!',
          text: 'Resume created successfully. You can now download or edit it.',
          icon: 'success'
        })
      } else {
        Swal.fire('Error', 'Submission failed. Please try again.', 'error')
      }
    } catch {
      Swal.fire('Error', 'Could not connect to the server. Please check that the server is running.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Summary templates
  const summaryTemplates = useMemo(() => {
    const jobTitle = personalDetails.title || 'Professional'
    const topSkills = skills.slice(0, 3).join(', ') || 'modern industry standards'

    return [
      {
        title: 'Achievement Oriented',
        text: `Dedicated ${jobTitle} with a strong foundation in ${topSkills}. Proven track record of delivering high-quality solutions, optimizing workflows, and collaborating effectively in cross-functional teams to drive organizational success.`
      },
      {
        title: 'Results Driven & Innovative',
        text: `Results-oriented ${jobTitle} skilled in ${topSkills}. Passionate about building robust, scalable solutions and solving complex engineering challenges with clean, maintainable architecture.`
      },
      {
        title: 'Aspiring / Growth Focused',
        text: `Enthusiastic and detail-driven ${jobTitle} eager to apply knowledge of ${topSkills} in a fast-paced environment. Quick learner committed to continuous professional growth and adding immediate value.`
      }
    ]
  }, [personalDetails.title, skills])

  const renderStepContent = (step) => {
    if (step === 0 || step === 1) {
      const currentSection = sections[step]
      return (
        <SectionFields
          section={currentSection}
          value={formData[currentSection.key]}
          onChange={(field, val) => updateSectionField(currentSection.key, field, val)}
          errors={errors}
        />
      )
    }

    if (step === 2) {
      // Multiple Education entries
      const currentList = educationList.length > 0 ? educationList : [formData.education]

      return (
        <div>
          <p className="st-note st-step-note">
            Add degrees, certifications, or educational programs in reverse chronological order.
          </p>

          <div className="st-dossiers">
            {currentList.map((ed, idx) => (
              <DossierCard
                key={idx}
                index={idx}
                title={ed.course}
                organisation={ed.college || ed.university}
                placeholder="Untitled degree"
                open={openEducation === idx}
                onToggle={() => setOpenEducation(openEducation === idx ? -1 : idx)}
                actions={
                  currentList.length > 1 ? (
                    <button
                      type="button"
                      className="st-iconbtn st-iconbtn--danger"
                      onClick={() => removeEducationItem(idx)}
                      aria-label="Remove education entry"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  ) : null
                }
              >
                <div className="st-fields">
                  <TextField
                    className="st-fields__wide"
                    label="Course / Degree"
                    value={ed.course || ''}
                    onChange={(e) => updateEducationItem(idx, 'course', e.target.value)}
                    required
                    error={idx === 0 && Boolean(errors.course)}
                    helperText={idx === 0 ? errors.course : ''}
                    fullWidth
                  />
                  <TextField
                    label="College / School"
                    value={ed.college || ''}
                    onChange={(e) => updateEducationItem(idx, 'college', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="University / Board"
                    value={ed.university || ''}
                    onChange={(e) => updateEducationItem(idx, 'university', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Year of Graduation"
                    value={ed.year || ''}
                    onChange={(e) => updateEducationItem(idx, 'year', e.target.value)}
                    error={idx === 0 && Boolean(errors.year)}
                    helperText={idx === 0 ? errors.year : ''}
                    fullWidth
                  />
                </div>
              </DossierCard>
            ))}
          </div>

          <button type="button" className="st-add" onClick={addEducationItem}>
            <AddIcon />
            Add another degree
          </button>
        </div>
      )
    }

    if (step === 3) {
      // Multiple Experience entries with bullets
      const currentList = experienceList.length > 0 ? experienceList : [formData.professionalDetails]

      return (
        <div>
          <p className="st-note st-step-note">
            Add your professional roles, internships, or relevant work experience. Freshers may skip this step.
          </p>

          <div className="st-dossiers">
            {currentList.map((exp, idx) => (
              <DossierCard
                key={idx}
                index={idx}
                title={exp.jobTitle}
                organisation={exp.company}
                placeholder="Untitled role"
                open={openExperience === idx}
                onToggle={() => setOpenExperience(openExperience === idx ? -1 : idx)}
                actions={
                  <>
                    {idx > 0 && (
                      <button
                        type="button"
                        className="st-iconbtn"
                        onClick={() => {
                          moveExperience(idx, -1)
                          setOpenExperience(idx - 1)
                        }}
                        aria-label="Move up"
                      >
                        <ArrowUpwardIcon />
                      </button>
                    )}
                    {idx < currentList.length - 1 && (
                      <button
                        type="button"
                        className="st-iconbtn"
                        onClick={() => {
                          moveExperience(idx, 1)
                          setOpenExperience(idx + 1)
                        }}
                        aria-label="Move down"
                      >
                        <ArrowDownwardIcon />
                      </button>
                    )}
                    {currentList.length > 1 && (
                      <button
                        type="button"
                        className="st-iconbtn st-iconbtn--danger"
                        onClick={() => removeExperienceItem(idx)}
                        aria-label="Remove role"
                      >
                        <DeleteOutlineIcon />
                      </button>
                    )}
                  </>
                }
              >
                <div className="st-fields">
                  <TextField
                    label="Job Title"
                    value={exp.jobTitle || ''}
                    onChange={(e) => updateExperienceItem(idx, 'jobTitle', e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    fullWidth
                  />
                  <TextField
                    label="Company Name"
                    value={exp.company || ''}
                    onChange={(e) => updateExperienceItem(idx, 'company', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    fullWidth
                  />
                  <TextField
                    label="Location"
                    value={exp.location || ''}
                    onChange={(e) => updateExperienceItem(idx, 'location', e.target.value)}
                    placeholder="e.g. New York, NY (or Remote)"
                    fullWidth
                  />
                  <TextField
                    label="Duration"
                    value={exp.duration || ''}
                    onChange={(e) => updateExperienceItem(idx, 'duration', e.target.value)}
                    placeholder="e.g. Jan 2023 - Present"
                    fullWidth
                  />
                </div>

                {/* BULLET POINTS / ACHIEVEMENTS */}
                <div className="st-bullets">
                  <p className="st-bullets__label">Key responsibilities &amp; achievements</p>

                  {(exp.bullets || []).length > 0 && (
                    <ul className="st-bullets__list">
                      {(exp.bullets || []).map((b, bIdx) => (
                        <li key={bIdx}>
                          <span>{b}</span>
                          <button
                            type="button"
                            className="st-iconbtn st-iconbtn--danger"
                            onClick={() => removeBulletPoint(idx, bIdx)}
                            aria-label="Remove bullet point"
                          >
                            <CloseIcon />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="st-inline">
                    <TextField
                      size="small"
                      placeholder="Add an achievement bullet point..."
                      value={bulletInputs[idx] || ''}
                      onChange={(e) => setBulletInputs({ ...bulletInputs, [idx]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addBulletPoint(idx)
                        }
                      }}
                      slotProps={{ htmlInput: { 'aria-label': 'Achievement bullet point' } }}
                      fullWidth
                    />
                    <button type="button" className="st-btn" onClick={() => addBulletPoint(idx)}>
                      Add
                    </button>
                  </div>
                </div>
              </DossierCard>
            ))}
          </div>

          <button type="button" className="st-add" onClick={addExperienceItem}>
            <AddIcon />
            Add another position
          </button>
        </div>
      )
    }

    if (step === 4) {
      // Skills
      const openSuggestions = suggestions.filter(
        (item) => !skills.some((s) => s.toLowerCase() === item.toLowerCase()),
      )

      return (
        <div>
          <div className="st-inline">
            <TextField
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill(inputSkill)
                }
              }}
              label="Add Skill"
              placeholder="e.g. React, TypeScript, Docker"
              fullWidth
            />
            <button type="button" className="st-btn st-btn--solid" onClick={() => addSkill(inputSkill)}>
              Add
            </button>
          </div>

          <h3 className="st-tray__label">
            On your resume <span>{skills.length}</span>
          </h3>
          <div className="st-tray" data-empty={skills.length === 0 ? '' : undefined}>
            <AnimatePresence mode="popLayout" initial={false}>
              {skills.map((item) => (
                <motion.span key={item} className="st-chip" {...chipMotion}>
                  {item}
                  <button type="button" onClick={() => removeSkill(item)} aria-label={`Remove ${item}`}>
                    <CloseIcon />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            {skills.length === 0 && <p className="st-note">No skills added yet. Add at least 3-5 key skills.</p>}
          </div>

          {openSuggestions.length > 0 && (
            <>
              <h3 className="st-tray__label">Suggested for {personalDetails.title || 'your profile'}</h3>
              <div className="st-tray st-tray--open">
                <AnimatePresence mode="popLayout" initial={false}>
                  {openSuggestions.map((item) => (
                    <motion.button
                      key={item}
                      type="button"
                      className="st-chip st-chip--ghost"
                      onClick={() => addSkill(item)}
                      {...chipMotion}
                    >
                      <AddIcon />
                      {item}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      )
    }

    if (step === 5) {
      // Summary
      const charCount = summary.length
      const isOptimal = charCount >= 300 && charCount <= 600

      return (
        <div>
          <TextField
            value={summary}
            onChange={(e) => updateSectionField('summary', null, e.target.value)}
            multiline
            rows={6}
            label="Professional Summary"
            placeholder="Write a concise overview of your background, core strengths, and what you bring to the table..."
            fullWidth
          />

          <div className="st-count" data-optimal={isOptimal ? '' : undefined}>
            <span>Recommended: 300–600 characters</span>
            <strong>{charCount} characters</strong>
          </div>

          <h3 className="st-tray__label">Starter drafts — click to insert</h3>
          <div className="st-starters">
            {summaryTemplates.map((tpl, idx) => (
              <button key={idx} type="button" className="st-starter" onClick={() => applySummaryTemplate(tpl.text)}>
                <span className="lp-serif st-starter__title">{tpl.title}</span>
                <span className="st-starter__text">{tpl.text}</span>
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (step === 6) {
      // Review step
      const currentEdList = educationList.length > 0 ? educationList : [formData.education]
      const currentExpList = experienceList.length > 0 ? experienceList : [formData.professionalDetails]

      return (
        <div>
          <p className="st-note st-step-note">Review your information below before generating your final resume.</p>

          <div className="st-reviews">
            <ReviewBlock label="Basic Information" onEdit={() => setActiveStep(0)}>
              <p className="st-review__lead">{personalDetails.name || 'Not provided'}</p>
              <p className="st-review__meta">
                {personalDetails.title || 'No designation'} • {personalDetails.location || 'No location'}
              </p>
            </ReviewBlock>

            <ReviewBlock label="Contact Details" onEdit={() => setActiveStep(1)}>
              <p className="st-review__lead">Email: {contactDetails.email || 'None'}</p>
              <p className="st-review__meta">Phone: {contactDetails.phoneNumber || 'None'}</p>
              <p className="st-review__meta">
                {[contactDetails.github, contactDetails.linkedIn, contactDetails.portfolio]
                  .filter(Boolean)
                  .join(' | ') || 'No profile links added'}
              </p>
            </ReviewBlock>

            <ReviewBlock label={`Education (${currentEdList.length})`} onEdit={() => setActiveStep(2)}>
              {currentEdList.map((ed, idx) => (
                <div key={idx} className="st-review__entry">
                  <p className="st-review__lead">{ed.course || 'Degree not specified'}</p>
                  <p className="st-review__meta">{[ed.college, ed.university, ed.year].filter(Boolean).join(' • ')}</p>
                </div>
              ))}
            </ReviewBlock>

            <ReviewBlock label={`Work Experience (${currentExpList.length})`} onEdit={() => setActiveStep(3)}>
              {currentExpList.map((exp, idx) => (
                <div key={idx} className="st-review__entry">
                  <p className="st-review__lead">{exp.jobTitle || 'Role not specified'}</p>
                  <p className="st-review__meta">
                    {[exp.company, exp.location, exp.duration].filter(Boolean).join(' • ')}
                  </p>
                </div>
              ))}
            </ReviewBlock>

            <ReviewBlock label={`Skills (${skills.length})`} onEdit={() => setActiveStep(4)}>
              {skills.length > 0 ? (
                <div className="st-tray st-tray--flat">
                  {skills.map((s) => (
                    <span key={s} className="st-chip st-chip--sm">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="st-review__meta">No skills listed</p>
              )}
            </ReviewBlock>

            <ReviewBlock label="Professional Summary" onEdit={() => setActiveStep(5)}>
              <p className="st-review__meta st-review__meta--pre">{summary || 'No summary provided.'}</p>
            </ReviewBlock>
          </div>
        </div>
      )
    }

    return null
  }

  const current = steps[activeStep]

  return (
    <div className="st-form">
      {/* STUDIO STEPPER */}
      <StudioStepper
        steps={steps}
        active={activeStep}
        furthest={furthestStep}
        skipped={skipped}
        onSelect={goToStep}
      />

      {/* STAGE HEADER WITH DRAFT INDICATOR */}
      <div className="st-stage">
        <div>
          <p className="lp-eyebrow">
            Stage {String(activeStep + 1).padStart(2, '0')} of {String(steps.length).padStart(2, '0')}
            {isStepOptional(activeStep) ? ' · Optional' : ''}
          </p>
          <h2 className="lp-display st-stage__title">
            {current.label} <span className="lp-serif">{current.line}</span>
          </h2>
        </div>
        {isMobile && isDraftSaved && (
          <span className="st-pill">
            <span className="st-pill__dot" data-state="saved" />
            Draft saved
          </span>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeStep}
          className="st-stage__body"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease }}
        >
          {renderStepContent(activeStep)}
        </motion.div>
      </AnimatePresence>

      {/* NAVIGATION BUTTONS */}
      <div className="st-formnav">
        <button
          type="button"
          className="st-btn st-btn--quiet"
          disabled={activeStep === 0 || submitting}
          onClick={handleBack}
        >
          <ArrowBackIcon />
          Back
        </button>
        <span className="st-formnav__space" />
        {isStepOptional(activeStep) && (
          <button type="button" className="st-btn" disabled={submitting} onClick={handleSkip}>
            Skip
          </button>
        )}
        {activeStep === LAST_STEP ? (
          <CtaButton onClick={handleAddResume} busy={submitting}>
            {submitting ? 'Creating Resume...' : 'Submit & Finish'}
          </CtaButton>
        ) : (
          <CtaButton onClick={handleNext}>Next</CtaButton>
        )}
      </div>

      {/* SNACKBAR FEEDBACK */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default FormSteps
