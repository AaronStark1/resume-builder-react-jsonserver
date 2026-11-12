import { useState } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import { addResumeAPI } from '../services/allAPIs'
import Swal from 'sweetalert2'
import { sections } from '../config/resumeFields'
import SectionFields from './SectionFields'

const steps = [
  'Basic Information',
  'Contact Details',
  'Education Details',
  'Work Experience',
  'Skills and Certifications',
  'Review and Submit'
]

const FormSteps = ({ formData, setFormData, setIsFinished, setResumeId }) => {
  const { skills, summary } = formData

  const [inputSkill, setInputSkill] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const suggestions = ['React', 'TypeScript', 'NodeJS', 'Express', 'MongoDB', 'Python', 'SQL', 'Git']

  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())

  const isStepOptional = (step) => step === 3 // Experience can be optional for freshers
  const isStepSkipped = (step) => skipped.has(step)

  const updateSectionField = (sectionKey, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldName]: value
      }
    }))
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }
    setActiveStep((prev) => prev + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => setActiveStep((prev) => prev - 1)

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) return
    setActiveStep((prev) => prev + 1)
    setSkipped((prev) => new Set(prev).add(activeStep))
  }

  const addSkill = (skill) => {
    const trimmed = (skill || '').trim()
    if (!trimmed) return
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      Swal.fire('Notice', 'Skill already added', 'info')
    } else {
      setFormData((data) => ({ ...data, skills: [...data.skills, trimmed] }))
      setInputSkill('')
    }
  }

  const removeSkill = (skill) => {
    setFormData((data) => ({
      ...data,
      skills: data.skills.filter((item) => item !== skill)
    }))
  }

  const handleAddResume = async () => {
    setSubmitting(true)
    try {
      const response = await addResumeAPI(formData)
      if (response?.status === 201 || response?.status === 200) {
        setResumeId(response.data.id)
        Swal.fire('Success', 'Resume submitted successfully!', 'success')
        setIsFinished(true)
      } else {
        Swal.fire('Error', 'Submission failed. Please try again.', 'error')
      }
    } catch {
      Swal.fire('Error', 'Something went wrong connecting to the server.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStepContent = (step) => {
    if (step >= 0 && step <= 3) {
      const currentSection = sections[step]
      return (
        <SectionFields
          section={currentSection}
          value={formData[currentSection.key]}
          onChange={(field, val) => updateSectionField(currentSection.key, field, val)}
        />
      )
    }

    if (step === 4) {
      return (
        <Box>
          <Stack direction="row" spacing={1}>
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
              fullWidth
            />
            <Button variant="contained" onClick={() => addSkill(inputSkill)}>
              Add
            </Button>
          </Stack>

          <Typography variant="subtitle2" mt={3} mb={1} color="text.secondary">
            Suggested Skills
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {suggestions
              .filter((item) => !skills.some((s) => s.toLowerCase() === item.toLowerCase()))
              .map((item) => (
                <Button key={item} size="small" variant="outlined" onClick={() => addSkill(item)}>
                  + {item}
                </Button>
              ))}
          </Stack>

          <Typography variant="subtitle2" mt={3} mb={1} color="text.secondary">
            Added Skills
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {skills.map((item) => (
              <Button
                key={item}
                size="small"
                variant="contained"
                onClick={() => removeSkill(item)}
                sx={{ borderRadius: 4 }}
              >
                {item} ✕
              </Button>
            ))}
            {skills.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No skills added yet. Click suggestions or type above.
              </Typography>
            )}
          </Stack>
        </Box>
      )
    }

    if (step === 5) {
      return (
        <TextField
          value={summary}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
          multiline
          rows={5}
          label="Professional Summary"
          placeholder="Briefly describe your career goals, key achievements, and core strengths..."
          fullWidth
        />
      )
    }

    return null
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel optional={isStepOptional(index) && <Typography variant="caption">Optional</Typography>}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 3 }}>{renderStepContent(activeStep)}</Box>

      <Box sx={{ display: 'flex', pt: 2, borderTop: '1px solid #f0f0f0' }}>
        <Button disabled={activeStep === 0 || submitting} onClick={handleBack}>
          Back
        </Button>
        <Box sx={{ flex: 1 }} />
        {isStepOptional(activeStep) && (
          <Button disabled={submitting} onClick={handleSkip} sx={{ mr: 1 }}>
            Skip
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddResume}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {submitting ? 'Submitting...' : 'Finish'}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default FormSteps
