import { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  TextField,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material'
import { getAResumeAPI, updateAResumeAPI } from '../services/allAPIs'
import Swal from 'sweetalert2'
import { sections } from '../config/resumeFields'
import SectionFields from './SectionFields'
import TemplatePicker from './resume/TemplatePicker'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 600, md: 800 },
  maxHeight: '90vh',
  overflow: 'hidden',
  bgcolor: 'background.paper',
  color: 'text.primary',
  borderRadius: 4,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column'
}

// Module-level Section wrapper to avoid React remount / focus loss
const Section = ({ title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
      {title}
    </Typography>
    {children}
  </Box>
)

const initialResumeState = {
  template: 'classic',
  accentColor: '#3d0066',
  personalDetails: { name: '', title: '', location: '' },
  contactDetails: { email: '', phoneNumber: '', github: '', linkedIn: '', portfolio: '' },
  education: { course: '', college: '', university: '', year: '' },
  educationList: [],
  professionalDetails: { jobTitle: '', company: '', location: '', duration: '' },
  experienceList: [],
  skills: [],
  summary: ''
}

const Edit = ({ resumeId, onUpdate }) => {
  const [open, setOpen] = useState(false)
  const [resumeData, setResumeData] = useState(initialResumeState)
  const [inputSkill, setInputSkill] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadResume = useCallback(async () => {
    if (!resumeId) return
    try {
      const response = await getAResumeAPI(resumeId)
      if (response?.data) {
        setResumeData({
          template: response.data.template || 'classic',
          accentColor: response.data.accentColor || '#3d0066',
          personalDetails: { ...initialResumeState.personalDetails, ...response.data.personalDetails },
          contactDetails: { ...initialResumeState.contactDetails, ...response.data.contactDetails },
          education: { ...initialResumeState.education, ...response.data.education },
          educationList: Array.isArray(response.data.educationList) ? response.data.educationList : [],
          professionalDetails: { ...initialResumeState.professionalDetails, ...response.data.professionalDetails },
          experienceList: Array.isArray(response.data.experienceList) ? response.data.experienceList : [],
          skills: Array.isArray(response.data.skills) ? [...response.data.skills] : [],
          summary: response.data.summary ?? ''
        })
      }
    } catch {
      Swal.fire('Error', 'Failed to fetch resume details', 'error')
    }
  }, [resumeId])

  // Re-fetch / reset fresh data whenever the modal opens
  useEffect(() => {
    if (open && resumeId) {
      loadResume()
    }
  }, [open, resumeId, loadResume])

  const updateField = (sectionKey, fieldName, value) => {
    setResumeData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldName]: value
      }
    }))
  }

  const addSkill = () => {
    const trimmed = inputSkill.trim()
    if (!trimmed) return
    if (resumeData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      Swal.fire('Notice', 'Skill already added', 'info')
      return
    }
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed]
    }))
    setInputSkill('')
  }

  const removeSkill = (skillToRemove) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }))
  }

  const handleUpdate = async () => {
    setSubmitting(true)
    try {
      const response = await updateAResumeAPI(resumeId, resumeData)
      if (response?.data) {
        onUpdate(response.data)
        setOpen(false)
        Swal.fire({
          title: 'Updated',
          text: 'Resume updated successfully',
          icon: 'success'
        })
      }
    } catch {
      Swal.fire('Error', 'Failed to update resume. Please check your connection.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        disabled={!resumeId}
      >
        Edit
      </Button>

      <Modal open={open} onClose={() => !submitting && setOpen(false)}>
        <Box sx={modalStyle}>

          {/* HEADER */}
          <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
            <Typography variant="h6" fontWeight="bold">
              Edit Resume
            </Typography>
          </Box>

          {/* SCROLL BODY */}
          <Box sx={{ p: 3, overflowY: 'auto' }}>
            {/* TEMPLATE & ACCENT PICKER */}
            <Section title="Design &amp; Layout">
              <TemplatePicker
                currentTemplate={resumeData.template || 'classic'}
                currentAccent={resumeData.accentColor || '#3d0066'}
                onTemplateChange={(tpl) => setResumeData((prev) => ({ ...prev, template: tpl }))}
                onAccentChange={(hex) => setResumeData((prev) => ({ ...prev, accentColor: hex }))}
              />
            </Section>

            <Divider sx={{ my: 3 }} />

            {sections.map((section) => (
              <Box key={section.key}>
                <Section title={section.title}>
                  <SectionFields
                    section={section}
                    value={resumeData[section.key]}
                    onChange={(field, val) => updateField(section.key, field, val)}
                  />
                </Section>
                <Divider sx={{ my: 3 }} />
              </Box>
            ))}

            {/* SKILLS */}
            <Section title="Skills">
              <Stack direction="row" spacing={1} mb={2}>
                <TextField
                  label="Add Skill"
                  value={inputSkill}
                  onChange={(e) => setInputSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                  fullWidth
                />
                <Button variant="outlined" onClick={addSkill}>Add</Button>
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={1}>
                {resumeData.skills.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    onDelete={() => removeSkill(s)}
                    color="primary"
                  />
                ))}
                {resumeData.skills.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No skills added yet.
                  </Typography>
                )}
              </Stack>
            </Section>

            <Divider sx={{ my: 3 }} />

            {/* SUMMARY */}
            <Section title="Professional Summary">
              <TextField
                multiline
                rows={4}
                value={resumeData.summary}
                onChange={(e) =>
                  setResumeData((prev) => ({ ...prev, summary: e.target.value }))
                }
                fullWidth
              />
            </Section>
          </Box>

          {/* FOOTER */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}
          >
            <Button disabled={submitting} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>

        </Box>
      </Modal>
    </>
  )
}

export default Edit
