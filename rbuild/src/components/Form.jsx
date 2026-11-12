import { useState, useEffect, useRef, useMemo } from 'react'
import Fab from '@mui/material/Fab'
import Dialog from '@mui/material/Dialog'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloseIcon from '@mui/icons-material/Close'

import { usePageTitle } from '../utils/usePageTitle'
import '../studio/builder.css'
import { isAccentHex, isTemplateId } from '../config/resumeDesign'
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
  const location = useLocation()

  const [formData, setFormData] = useState(() => {
    // A design picked on the landing page or the launchpad (router state) is applied here, draft or not.
    const requested = {
      ...(isTemplateId(location.state?.template) ? { template: location.state.template } : null),
      ...(isAccentHex(location.state?.accentColor) ? { accentColor: location.state.accentColor } : null),
    }
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
          ...requested,
        }
      }
    } catch {
      // Fallback
    }
    return { ...initialFormState, ...requested }
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
    <div className="st st-page st-builder">
      <div className="st-wrap">
        {/* HEADER & TOP BAR */}
        <header className="st-builder__head no-print">
          <div>
            <p className="lp-eyebrow">{isFinished ? 'Fresh off the press' : 'The drafting studio'}</p>
            <h1 className="lp-display st-title">
              {isFinished ? (
                <>
                  Your resume is <span className="lp-serif">ready</span>
                </>
              ) : (
                <>
                  Draft your <span className="lp-serif">resume</span>
                </>
              )}
            </h1>
          </div>

          {isFinished ? (
            <div className="st-builder__actions">
              <button type="button" className="st-btn" onClick={handleBackToEditing}>
                <EditIcon />
                Back to Editing
              </button>
              <button type="button" className="st-btn st-btn--solid" onClick={handleCreateAnother}>
                <AddIcon />
                Create Another Resume
              </button>
            </div>
          ) : (
            /* COMPLETION PROGRESS (above the form while editing) */
            <div className="st-meter">
              <div className="st-meter__row">
                <span id="st-meter-label">Profile completeness</span>
                <strong className="lp-display">{completionPercentage}%</strong>
              </div>
              <div
                className="st-meter__bar"
                role="progressbar"
                aria-labelledby="st-meter-label"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPercentage}
                data-complete={completionPercentage === 100 ? '' : undefined}
              >
                <span style={{ transform: `scaleX(${completionPercentage / 100})` }} />
              </div>
            </div>
          )}
        </header>

        {isFinished ? (
          <Preview formData={formData} resumeId={resumeId} mode="final" onUpdate={(updated) => setFormData(updated)} />
        ) : (
          /* TWO-PANE WORK AREA: the drafting desk and the easel */
          <div className="st-builder__panes">
            {/* FORM CARD (LEFT PANE) */}
            <section className="st-card st-desk" aria-label="Resume details">
              <FormSteps
                formData={formData}
                setFormData={setFormData}
                setIsFinished={handleFinished}
                setResumeId={setResumeId}
                isDraftSaved={isDraftSaved}
              />
            </section>

            {/* STICKY LIVE PREVIEW (RIGHT PANE, DESKTOP >= md) */}
            {!isMobile && (
              <aside className="st-easel" aria-label="Live resume preview">
                <Preview
                  formData={formData}
                  resumeId={resumeId}
                  mode="live"
                  draftSaved={isDraftSaved}
                  onUpdate={(updated) => setFormData(updated)}
                />
              </aside>
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
                  boxShadow: '0 8px 24px rgba(239, 74, 35, 0.4)',
                  zIndex: theme.zIndex.speedDial,
                }}
              >
                <VisibilityIcon />
              </Fab>
            )}

            {/* FULLSCREEN PREVIEW DIALOG FOR MOBILE (< md) */}
            <Dialog fullScreen open={isMobile && mobilePreviewOpen} onClose={() => setMobilePreviewOpen(false)}>
              <div className="st st-sheetdialog">
                <div className="st-sheetdialog__bar">
                  <h2 className="lp-display">
                    On the <span className="lp-serif">easel</span>
                  </h2>
                  <button
                    type="button"
                    className="st-iconbtn"
                    onClick={() => setMobilePreviewOpen(false)}
                    aria-label="Close preview"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="st-easel st-easel--dialog">
                  <Preview
                    formData={formData}
                    resumeId={resumeId}
                    mode="live"
                    draftSaved={isDraftSaved}
                    onUpdate={(updated) => setFormData(updated)}
                  />
                </div>
              </div>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )
}

export default Form
