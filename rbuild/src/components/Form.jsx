import { useState, useEffect, useRef, useMemo } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import LinearProgress from '@mui/material/LinearProgress'
import Fab from '@mui/material/Fab'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloseIcon from '@mui/icons-material/Close'

import { usePageTitle } from '../utils/usePageTitle'
import Preview from './Preview'
import FormSteps from './FormSteps'

const STORAGE_KEY = 'rbuild_draft_resume_v1'

const initialFormState = {
  template: 'classic',
  accentColor: '#3d0066',
  personalDetails: { name: '', title: '', location: '' },
  contactDetails: {
    email: '',
    phoneNumber: '',
    github: '',
    linkedIn: '',
    portfolio: '',
  },
  education: { course: '', college: '', university: '', year: '' },
  educationList: [],
  professionalDetails: {
    jobTitle: '',
    company: '',
    location: '',
    duration: '',
  },
  experienceList: [],
  skills: [],
  summary: '',
}

const Form = () => {
  usePageTitle('Resume Builder')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)

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
      // Fallback
    }
    return initialFormState
  })

  const [resumeId, setResumeId] = useState(null)
  const [isFinished, setIsFinished] = useState(false)
  const [isDraftSaved, setIsDraftSaved] = useState(false)
  const saveTimerRef = useRef(null)

  // Calculate completion percentage for the slim progress bar
  const completionPercentage = useMemo(() => {
    let score = 0
    if (formData.personalDetails?.name?.trim()) score += 15
    if (formData.personalDetails?.title?.trim()) score += 10
    if (formData.contactDetails?.email?.trim()) score += 15
    if (formData.education?.course?.trim()) score += 15
    if (formData.professionalDetails?.jobTitle?.trim()) score += 15
    if (formData.skills?.length >= 3) score += 15
    if (formData.summary?.trim()?.length > 50) score += 15
    return Math.min(score, 100)
  }, [formData])

  // Debounced autosave
  useEffect(() => {
    if (isFinished) return

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
        setIsDraftSaved(true)
      } catch {
        // Ignore
      }
    }, 400)

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [formData, isFinished])

  // Launch confetti on finish
  const handleFinished = async (val) => {
    setIsFinished(val)
    if (val) {
      try {
        localStorage.removeItem(STORAGE_KEY)
        setIsDraftSaved(false)
        const confetti = (await import('canvas-confetti')).default
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch {
        // Non-blocking confetti failure
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
      {/* HEADER & TOP BAR */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
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

      {/* COMPLETION PROGRESS BAR (Above form when editing) */}
      {!isFinished && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Profile Completeness
            </Typography>
            <Typography variant="caption" color="primary.main" fontWeight={700}>
              {completionPercentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(61, 0, 102, 0.08)',
              '& .MuiLinearProgress-bar': {
                bgcolor: completionPercentage === 100 ? 'success.main' : 'secondary.main',
                borderRadius: 3,
              },
            }}
          />
        </Box>
      )}

      {/* TWO-PANE WORK AREA */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        sx={{ alignItems: 'flex-start' }}
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
            {/* FORM CARD (LEFT PANE) */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <Paper
                elevation={0}
                sx={(theme) => ({
                  p: { xs: 2.5, sm: 4 },
                  borderRadius: 3,
                  border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(20,0,43,0.08)',
                  bgcolor: 'background.paper',
                })}
              >
                <FormSteps
                  formData={formData}
                  setFormData={setFormData}
                  setIsFinished={handleFinished}
                  setResumeId={setResumeId}
                  isDraftSaved={isDraftSaved}
                />
              </Paper>
            </Box>

            {/* STICKY LIVE PREVIEW (RIGHT PANE, DESKTOP >= md) */}
            {!isMobile && (
              <Box
                sx={(theme) => ({
                  flex: 1.2,
                  width: '100%',
                  position: 'sticky',
                  top: 88,
                  maxHeight: 'calc(100vh - 104px)',
                  overflowY: 'auto',
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fafafa',
                  border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(20,0,43,0.08)',
                })}
              >
                <Preview
                  formData={formData}
                  resumeId={resumeId}
                  mode="live"
                  onUpdate={(updated) => setFormData(updated)}
                />
              </Box>
            )}

            {/* FLOATING FAB FOR MOBILE (< md) */}
            {isMobile && (
              <Fab
                color="secondary"
                aria-label="Preview resume"
                onClick={() => setMobilePreviewOpen(true)}
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  boxShadow: '0 8px 24px rgba(255,123,0,0.4)',
                  zIndex: theme.zIndex.speedDial,
                }}
              >
                <VisibilityIcon />
              </Fab>
            )}

            {/* FULLSCREEN PREVIEW DIALOG FOR MOBILE (< md) */}
            <Dialog
              fullScreen
              open={isMobile && mobilePreviewOpen}
              onClose={() => setMobilePreviewOpen(false)}
            >
              <DialogTitle
                sx={{
                  bgcolor: 'primary.dark',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Resume Preview
                </Typography>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={() => setMobilePreviewOpen(false)}
                  aria-label="Close preview"
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 2, bgcolor: 'background.default' }}>
                <Preview
                  formData={formData}
                  resumeId={resumeId}
                  mode="live"
                  onUpdate={(updated) => setFormData(updated)}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </Stack>
    </Box>
  )
}

export default Form
