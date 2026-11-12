import { useState, useEffect, useRef } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import Preview from './Preview'
import FormSteps from './FormSteps'

const STORAGE_KEY = 'rbuild_draft_resume_v1'

const initialFormState = {
  personalDetails: { name: '', title: '', location: '' },
  contactDetails: {
    email: '',
    phoneNumber: '',
    github: '',
    linkedIn: '',
    portfolio: '',
  },
  education: { course: '', college: '', university: '', year: '' },
  professionalDetails: {
    jobTitle: '',
    company: '',
    location: '',
    duration: '',
  },
  skills: [],
  summary: '',
}

const Form = () => {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...initialFormState,
          ...parsed,
          personalDetails: { ...initialFormState.personalDetails, ...parsed.personalDetails },
          contactDetails: { ...initialFormState.contactDetails, ...parsed.contactDetails },
          education: { ...initialFormState.education, ...parsed.education },
          professionalDetails: { ...initialFormState.professionalDetails, ...parsed.professionalDetails },
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          summary: parsed.summary ?? '',
        }
      }
    } catch {
      // LocalStorage access fail fallback
    }
    return initialFormState
  })

  const [resumeId, setResumeId] = useState(null)
  const [isFinished, setIsFinished] = useState(false)
  const [isDraftSaved, setIsDraftSaved] = useState(false)
  const saveTimerRef = useRef(null)

  // Debounced autosave to localStorage (~400ms)
  useEffect(() => {
    if (isFinished) return // Don't autosave when final screen reached

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
        setIsDraftSaved(true)
      } catch {
        // LocalStorage quota or disabled
      }
    }, 400)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [formData, isFinished])

  // When resume successfully created, clear the saved draft
  const handleFinished = (val) => {
    setIsFinished(val)
    if (val) {
      try {
        localStorage.removeItem(STORAGE_KEY)
        setIsDraftSaved(false)
      } catch {
        // Ignore
      }
    }
  }

  const handleCreateAnother = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore
    }
    setFormData(initialFormState)
    setResumeId(null)
    setIsFinished(false)
    setIsDraftSaved(false)
  }

  const handleBackToEditing = () => {
    setIsFinished(false)
  }

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 4, maxWidth: 1400, mx: 'auto' }}>
      {/* PAGE TITLE & TOP ACTIONS */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          {isFinished ? 'Your Resume is Ready! 🎉' : 'Smart Resume Builder'}
        </Typography>

        {isFinished && (
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleBackToEditing}
            >
              Back to Editing
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleCreateAnother}
            >
              Create Another Resume
            </Button>
          </Stack>
        )}
      </Box>

      {/* WORK AREA */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        sx={{
          alignItems: 'flex-start',
        }}
      >
        {isFinished ? (
          <Box sx={{ width: '100%' }}>
            <Preview
              formData={formData}
              resumeId={resumeId}
              mode="final"
              onUpdate={(updated) => setFormData(updated)}
            />
          </Box>
        ) : (
          <>
            {/* FORM SIDE */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <FormSteps
                formData={formData}
                setFormData={setFormData}
                setIsFinished={handleFinished}
                setResumeId={setResumeId}
                isDraftSaved={isDraftSaved}
              />
            </Box>

            {/* PREVIEW SIDE */}
            <Box
              sx={{
                flex: 1.2,
                width: '100%',
                p: 2,
                borderRadius: 2,
                backgroundColor: '#fafafa',
                border: '1px solid #e0e0e0',
                minHeight: 500,
              }}
            >
              <Preview
                formData={formData}
                resumeId={resumeId}
                mode="live"
                onUpdate={(updated) => setFormData(updated)}
              />
            </Box>
          </>
        )}
      </Stack>
    </Box>
  )
}

export default Form
