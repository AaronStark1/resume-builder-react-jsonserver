import { useState, useMemo } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

import { addResumeAPI } from '../services/allAPIs'
import Swal from 'sweetalert2'
import { sections } from '../config/resumeFields'
import SectionFields from './SectionFields'
import { validateStep, normalizeUrl } from '../utils/validation'
import { getSkillSuggestions } from '../utils/skillSuggestions'

const stepLabels = [
  'Basics',
  'Contact',
  'Education',
  'Experience',
  'Skills',
  'Summary',
  'Review'
]

const FormSteps = ({
  formData,
  setFormData,
  setIsFinished,
  setResumeId,
  isDraftSaved = false
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { personalDetails, contactDetails, education, professionalDetails, skills = [], summary = '' } = formData

  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [inputSkill, setInputSkill] = useState('')
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const isStepOptional = (step) => step === 3 // Experience can be skipped for freshers
  const isStepSkipped = (step) => skipped.has(step)

  const suggestions = useMemo(() => {
    return getSkillSuggestions(personalDetails?.title || '')
  }, [personalDetails?.title])

  const updateSectionField = (sectionKey, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldName]: value
      }
    }))
    // Clear field-specific error as user types
    if (errors[fieldName]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[fieldName]
        return copy
      })
    }
  }

  const handleNext = () => {
    // Validate current step
    const { isValid, errors: stepErrors } = validateStep(activeStep, formData)
    if (!isValid) {
      setErrors(stepErrors)
      return
    }

    // Auto-normalize URLs on leaving contact step
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
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setErrors({})
    setActiveStep((prev) => prev - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) return
    setErrors({})
    setActiveStep((prev) => prev + 1)
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
      message: 'Template applied! You can edit the text to customize it.',
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

  // Starter summary templates based on entered data
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
    if (step >= 0 && step <= 3) {
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

    if (step === 4) {
      // Skills
      return (
        <Box>
          <Stack direction="row" spacing={1} mb={2}>
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
            <Button
              variant="contained"
              onClick={() => addSkill(inputSkill)}
              sx={{ px: 3 }}
            >
              Add
            </Button>
          </Stack>

          <Typography variant="subtitle2" mt={3} mb={1} color="text.secondary" fontWeight={600}>
            Suggested for {personalDetails.title || 'your profile'}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {suggestions
              .filter((item) => !skills.some((s) => s.toLowerCase() === item.toLowerCase()))
              .map((item) => (
                <Chip
                  key={item}
                  label={`+ ${item}`}
                  clickable
                  variant="outlined"
                  onClick={() => addSkill(item)}
                />
              ))}
          </Stack>

          <Typography variant="subtitle2" mt={4} mb={1} color="text.secondary" fontWeight={600}>
            Added Skills ({skills.length})
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {skills.map((item) => (
              <Chip
                key={item}
                label={item}
                color="primary"
                onDelete={() => removeSkill(item)}
              />
            ))}
            {skills.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No skills added yet. Add at least 3-5 key skills.
              </Typography>
            )}
          </Stack>
        </Box>
      )
    }

    if (step === 5) {
      // Summary
      const charCount = summary.length
      const isOptimal = charCount >= 300 && charCount <= 600

      return (
        <Box>
          <TextField
            value={summary}
            onChange={(e) => updateSectionField('summary', null, e.target.value)}
            multiline
            rows={5}
            label="Professional Summary"
            placeholder="Write a concise overview of your background, core strengths, and what you bring to the table..."
            fullWidth
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant="caption" color={isOptimal ? 'success.main' : 'text.secondary'}>
              Recommended: 300–600 characters
            </Typography>
            <Typography variant="caption" color={isOptimal ? 'success.main' : 'text.secondary'} fontWeight={600}>
              {charCount} characters
            </Typography>
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle2" color="primary.main" fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AutoAwesomeIcon fontSize="small" color="secondary" /> Starter Templates (Click to insert)
            </Typography>
            <Stack spacing={1.5}>
              {summaryTemplates.map((tpl, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    transition: '0.2s',
                    ':hover': {
                      borderColor: 'secondary.main',
                      bgcolor: 'rgba(255, 123, 0, 0.04)'
                    }
                  }}
                  onClick={() => applySummaryTemplate(tpl.text)}
                >
                  <Typography variant="caption" fontWeight="bold" color="secondary.main">
                    {tpl.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {tpl.text}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Box>
      )
    }

    if (step === 6) {
      // Review step
      return (
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
            Review Your Information
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Check your details before generating the final resume. You can edit any section below.
          </Typography>

          <Stack spacing={2.5}>
            {/* Basics Review */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Basic Information
                  </Typography>
                  <Typography variant="body1" fontWeight={600} mt={0.5}>
                    {personalDetails.name || 'Not provided'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {personalDetails.title || 'No designation'} • {personalDetails.location || 'No location'}
                  </Typography>
                </Box>
                <Button size="small" startIcon={<EditIcon />} onClick={() => setActiveStep(0)}>
                  Edit
                </Button>
              </Box>
            </Paper>

            {/* Contact Review */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Contact Details
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    Email: <strong>{contactDetails.email || 'None'}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {contactDetails.phoneNumber || 'None'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {[contactDetails.github, contactDetails.linkedIn, contactDetails.portfolio]
                      .filter(Boolean)
                      .join(' | ') || 'No profile links added'}
                  </Typography>
                </Box>
                <Button size="small" startIcon={<EditIcon />} onClick={() => setActiveStep(1)}>
                  Edit
                </Button>
              </Box>
            </Paper>

            {/* Education Review */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Education
                  </Typography>
                  <Typography variant="body1" fontWeight={600} mt={0.5}>
                    {education.course || 'None'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[education.college, education.university, education.year].filter(Boolean).join(' • ') ||
                      'No institution details'}
                  </Typography>
                </Box>
                <Button size="small" startIcon={<EditIcon />} onClick={() => setActiveStep(2)}>
                  Edit
                </Button>
              </Box>
            </Paper>

            {/* Experience Review */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Work Experience
                  </Typography>
                  <Typography variant="body1" fontWeight={600} mt={0.5}>
                    {professionalDetails.jobTitle || 'None listed (Fresher)'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[
                      professionalDetails.company,
                      professionalDetails.location,
                      professionalDetails.duration
                    ].filter(Boolean).join(' • ')}
                  </Typography>
                </Box>
                <Button size="small" startIcon={<EditIcon />} onClick={() => setActiveStep(3)}>
                  Edit
                </Button>
              </Box>
            </Paper>

            {/* Skills Review */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main" mb={1}>
                    Skills ({skills.length})
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {skills.map((s) => (
                      <Chip key={s} label={s} size="small" />
                    ))}
                    {skills.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No skills listed
                      </Typography>
                    )}
                  </Stack>
                </Box>
                <Button size="small" startIcon={<EditIcon />} onClick={() => setActiveStep(4)}>
                  Edit
                </Button>
              </Box>
            </Paper>

            {/* Summary Review */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, pr: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Professional Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5} sx={{ whiteSpace: 'pre-wrap' }}>
                    {summary || 'No summary provided.'}
                  </Typography>
                </Box>
                <Button size="small" startIcon={<EditIcon />} onClick={() => setActiveStep(5)}>
                  Edit
                </Button>
              </Box>
            </Paper>
          </Stack>
        </Box>
      )
    }

    return null
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* HEADER WITH DRAFT INDICATOR */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Step {activeStep + 1} of {stepLabels.length}: <strong>{stepLabels[activeStep]}</strong>
        </Typography>
        {isDraftSaved && (
          <Chip
            icon={<CheckCircleOutlineIcon fontSize="small" />}
            label="Draft saved"
            size="small"
            color="success"
            variant="outlined"
          />
        )}
      </Box>

      {/* STEPPER */}
      <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
        {stepLabels.map((label, index) => (
          <Step key={label}>
            <StepLabel optional={isStepOptional(index) && <Typography variant="caption">Optional</Typography>}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 4 }}>{renderStepContent(activeStep)}</Box>

      <Divider sx={{ mb: 3 }} />

      {/* NAVIGATION BUTTONS */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button disabled={activeStep === 0 || submitting} onClick={handleBack}>
          Back
        </Button>
        <Box sx={{ flex: 1 }} />
        {isStepOptional(activeStep) && (
          <Button disabled={submitting} onClick={handleSkip} sx={{ mr: 1.5 }}>
            Skip
          </Button>
        )}
        {activeStep === stepLabels.length - 1 ? (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleAddResume}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ px: 4, fontWeight: 'bold' }}
          >
            {submitting ? 'Creating Resume...' : 'Submit & Finish'}
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext} sx={{ px: 3 }}>
            Next
          </Button>
        )}
      </Box>

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
    </Box>
  )
}

export default FormSteps
