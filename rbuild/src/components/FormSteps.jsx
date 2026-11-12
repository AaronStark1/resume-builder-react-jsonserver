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
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AddIcon from '@mui/icons-material/Add'
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

  const {
    personalDetails,
    contactDetails,
    educationList = [],
    experienceList = [],
    skills = [],
    summary = ''
  } = formData

  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [inputSkill, setInputSkill] = useState('')
  const [bulletInputs, setBulletInputs] = useState({})
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const isStepOptional = (step) => step === 3 // Experience can be skipped for freshers
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
        <Box>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Add degrees, certifications, or educational programs in reverse chronological order.
          </Typography>

          <Stack spacing={3}>
            {currentList.map((ed, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                    Education #{idx + 1}
                  </Typography>
                  {currentList.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeEducationItem(idx)}
                      aria-label="Remove education entry"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Stack spacing={2}>
                  <TextField
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
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Box mt={2.5}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addEducationItem}
              size="small"
            >
              Add Another Degree
            </Button>
          </Box>
        </Box>
      )
    }

    if (step === 3) {
      // Multiple Experience entries with bullets
      const currentList = experienceList.length > 0 ? experienceList : [formData.professionalDetails]

      return (
        <Box>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Add your professional roles, internships, or relevant work experience. Freshers may skip this step.
          </Typography>

          <Stack spacing={3}>
            {currentList.map((exp, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                    Role #{idx + 1}
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    {idx > 0 && (
                      <IconButton size="small" onClick={() => moveExperience(idx, -1)} aria-label="Move up">
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                    )}
                    {idx < currentList.length - 1 && (
                      <IconButton size="small" onClick={() => moveExperience(idx, 1)} aria-label="Move down">
                        <ArrowDownwardIcon fontSize="small" />
                      </IconButton>
                    )}
                    {currentList.length > 1 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeExperienceItem(idx)}
                        aria-label="Remove role"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </Box>

                <Stack spacing={2}>
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

                  {/* BULLET POINTS / ACHIEVEMENTS */}
                  <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #e0e0e0' }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" mb={1} display="block">
                      Key Responsibilities &amp; Achievements (Bullets)
                    </Typography>

                    <Stack spacing={1} mb={1.5}>
                      {(exp.bullets || []).map((b, bIdx) => (
                        <Box
                          key={bIdx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            bgcolor: 'action.hover',
                            px: 1.5,
                            py: 0.8,
                            borderRadius: 1.5,
                          }}
                        >
                          <Typography variant="body2" sx={{ pr: 1 }}>
                            • {b}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => removeBulletPoint(idx, bIdx)}
                            aria-label="Remove bullet point"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>

                    <Stack direction="row" spacing={1}>
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
                        fullWidth
                      />
                      <Button size="small" variant="outlined" onClick={() => addBulletPoint(idx)}>
                        Add
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Box mt={2.5}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addExperienceItem}
              size="small"
            >
              Add Another Role
            </Button>
          </Box>
        </Box>
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
      const currentEdList = educationList.length > 0 ? educationList : [formData.education]
      const currentExpList = experienceList.length > 0 ? experienceList : [formData.professionalDetails]

      return (
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={1} color="primary.main">
            Review Your Resume Details
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Review your information below before generating your final resume.
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
                    Education ({currentEdList.length})
                  </Typography>
                  {currentEdList.map((ed, idx) => (
                    <Box key={idx} sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {ed.course || 'Degree not specified'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {[ed.college, ed.university, ed.year].filter(Boolean).join(' • ')}
                      </Typography>
                    </Box>
                  ))}
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
                    Work Experience ({currentExpList.length})
                  </Typography>
                  {currentExpList.map((exp, idx) => (
                    <Box key={idx} sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {exp.jobTitle || 'Role not specified'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {[exp.company, exp.location, exp.duration].filter(Boolean).join(' • ')}
                      </Typography>
                    </Box>
                  ))}
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
