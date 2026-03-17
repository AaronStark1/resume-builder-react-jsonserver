import React, { useState } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { addResumeAPI } from '../services/allAPIs'
import Swal from 'sweetalert2'

const steps = [
  'Basic Information',
  'Contact Details',
  'Education Details',
  'Work Experience',
  'Skills and Certifications',
  'Review and Submit'
]

const FormSteps = ({ formData, setFormData, isFinished, setIsFinished,setResumeId }) => {

  const { personalDetails, contactDetails, education, professionalDetails, skills, summary } = formData

  const [inputSkill, setInputSkill] = useState('')
  const suggestions = ['React', 'Angular', 'NodeJS', 'Express', 'MongoDB']

  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())

  const isStepOptional = (step) => step === 1
  const isStepSkipped = (step) => skipped.has(step)

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }
    setActiveStep(prev => prev + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => setActiveStep(prev => prev - 1)

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) throw new Error("Can't skip non optional step")

    setActiveStep(prev => prev + 1)
    setSkipped(prev => new Set(prev).add(activeStep))
  }

  const handleReset = () => setActiveStep(0)

  const addSkill = (skill) => {
    if (!skill) return
    if (skills.includes(skill)) {
      alert("Skill already exists")
    } else {
      setFormData(data => ({ ...data, skills: [...data.skills, skill] }))
      setInputSkill('')
    }
  }

  const removeSkill = (skill) => {
    setFormData(data => ({
      ...data,
      skills: data.skills.filter(item => item !== skill)
    }))
  }

  const handleAddResume = async () => {
    try {
      const response = await addResumeAPI(formData)
      if (response.status === 201) {
        setResumeId(response.data.id)
        Swal.fire("Success", "Resume submitted", "success")
        setIsFinished(true)
      } else {
        Swal.fire("Error", "Submission failed", "error")
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error")
    }
  }

  const renderStepContent = (step) => {
    switch (step) {

      case 0:
        return (
          <Stack spacing={2}>
            <TextField
              value={personalDetails.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalDetails: { ...personalDetails, name: e.target.value }
                })}
              label="Full Name"
              variant="standard"
              fullWidth
            />

            <TextField
              value={personalDetails.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalDetails: { ...personalDetails, title: e.target.value }
                })}
              label="Job Title"
              variant="standard"
              fullWidth
            />

            <TextField
              value={personalDetails.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalDetails: { ...personalDetails, location: e.target.value }
                })}
              label="Location"
              variant="standard"
              fullWidth
            />
          </Stack>
        )

      case 1:
        return (
          <Stack spacing={2}>
            <TextField
              value={contactDetails.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactDetails: { ...contactDetails, email: e.target.value }
                })}
              label="Email"
              variant="standard"
              fullWidth
            />

            <TextField
              value={contactDetails.phoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactDetails: { ...contactDetails, phoneNumber: e.target.value }
                })}
              label="Phone Number"
              variant="standard"
              fullWidth
            />

            <TextField
              value={contactDetails.github}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactDetails: { ...contactDetails, github: e.target.value }
                })}
              label="Github Profile"
              variant="standard"
              fullWidth
            />

            <TextField
              value={contactDetails.linkedIn}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactDetails: { ...contactDetails, linkedIn: e.target.value }
                })}
              label="LinkedIn Profile"
              variant="standard"
              fullWidth
            />

            <TextField
              value={contactDetails.portfolio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactDetails: { ...contactDetails, portfolio: e.target.value }
                })}
              label="Portfolio"
              variant="standard"
              fullWidth
            />
          </Stack>
        )

      case 2:
        return (
          <Stack spacing={2}>
            <TextField
              value={education.course}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: { ...education, course: e.target.value }
                })}
              label="Course"
              variant="standard"
              fullWidth
            />

            <TextField
              value={education.college}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: { ...education, college: e.target.value }
                })}
              label="College"
              variant="standard"
              fullWidth
            />

            <TextField
              value={education.university}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: { ...education, university: e.target.value }
                })}
              label="University"
              variant="standard"
              fullWidth
            />

            <TextField
              value={education.year}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: { ...education, year: e.target.value }
                })}
              label="Year"
              variant="standard"
              fullWidth
            />
          </Stack>
        )

      case 3:
        return (
          <Stack spacing={2}>
            <TextField
              value={professionalDetails.jobTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  professionalDetails: { ...professionalDetails, jobTitle: e.target.value }
                })}
              label="Job Title"
              variant="standard"
              fullWidth
            />

            <TextField
              value={professionalDetails.company}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  professionalDetails: { ...professionalDetails, company: e.target.value }
                })}
              label="Company"
              variant="standard"
              fullWidth
            />

            <TextField
              value={professionalDetails.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  professionalDetails: { ...professionalDetails, location: e.target.value }
                })}
              label="Location"
              variant="standard"
              fullWidth
            />

            <TextField
              value={professionalDetails.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  professionalDetails: { ...professionalDetails, duration: e.target.value }
                })}
              label="Duration"
              variant="standard"
              fullWidth
            />
          </Stack>
        )

      case 4:
        return (
          <Box>
            <Stack direction="row" spacing={1}>
              <TextField
                value={inputSkill}
                onChange={(e) => setInputSkill(e.target.value)}
                label="Add Skill"
                variant="standard"
                fullWidth
              />
              <Button onClick={() => addSkill(inputSkill)}>Add</Button>
            </Stack>

            <Typography mt={3}>Suggestions</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
              {suggestions.map(item => (
                <Button key={item} variant="outlined" onClick={() => addSkill(item)}>
                  {item}
                </Button>
              ))}
            </Stack>

            <Typography mt={3}>Added Skills</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
              {skills.map(item => (
                <Button key={item} variant="contained" onClick={() => removeSkill(item)}>
                  {item} ✕
                </Button>
              ))}
            </Stack>
          </Box>
        )

      case 5:
        return (
          <TextField
            value={summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
            multiline
            rows={4}
            label="Professional Summary"
            variant="standard"
            fullWidth
          />
        )

      default:
        return null
    }
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

      <Box sx={{ mt: 3 }}>{renderStepContent(activeStep)}</Box>

      <Box sx={{ display: 'flex', pt: 3 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
        <Box sx={{ flex: 1 }} />
        {isStepOptional(activeStep) && (
          <Button onClick={handleSkip}>Skip</Button>
        )}
        {activeStep === steps.length - 1
          ? <Button onClick={handleAddResume}>Finish</Button>
          : <Button onClick={handleNext}>Next</Button>}
      </Box>
    </Box>
  )
}

export default FormSteps