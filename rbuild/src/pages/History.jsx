import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SearchIcon from '@mui/icons-material/Search'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import Swal from 'sweetalert2'

import { deleteHistoryAPI, getHistoryAPI, getResumesAPI } from '../services/allAPIs'
import { normalizeResume } from '../utils/normalizeResume'
import ScaledPage from '../components/resume/ScaledPage'
import ResumeTemplate from '../components/resume/ResumeTemplate'
import { CtaLink } from '../components/studio/Bits'
import { ease } from '../motion/variants'
import { usePageTitle } from '../utils/usePageTitle'
import '../studio/vault.css'

const formatDate = (item) => {
  if (item.createdAt) {
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(item.createdAt))
    } catch {
      // Fallback
    }
  }
  return item.formattedDate || 'Recently'
}

const RELATIVE_UNITS = [
  ['year', 31536000000],
  ['month', 2592000000],
  ['week', 604800000],
  ['day', 86400000],
  ['hour', 3600000],
  ['minute', 60000],
]

/** "2 hours ago" for records that carry a timestamp; older records fall back to their saved label. */
const relativeTime = (item) => {
  const then = item.createdAt ? new Date(item.createdAt).getTime() : NaN
  if (Number.isNaN(then)) return null
  const diff = then - Date.now()
  try {
    const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
    for (const [unit, ms] of RELATIVE_UNITS) {
      if (Math.abs(diff) >= ms) return formatter.format(Math.round(diff / ms), unit)
    }
    return 'just now'
  } catch {
    return null
  }
}

const cardMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease },
}

/** Blank sheet on an easel, for the empty archive. */
const EmptyEasel = () => (
  <svg className="st-vault__easel" viewBox="0 0 220 240" aria-hidden="true" focusable="false">
    <path className="st-vault__easel-legs" d="M110 18v206M62 228 96 60M158 228 124 60M52 178h116" />
    <rect className="st-vault__easel-sheet" x="58" y="34" width="104" height="138" rx="3" />
    <path className="st-vault__easel-marks" d="M72 58h44M72 74h76M72 86h76M72 98h52" />
    <circle className="st-vault__easel-dot" cx="148" cy="58" r="5" />
  </svg>
)

const History = () => {
  usePageTitle('Archive')
  const navigate = useNavigate()
  const [historyItems, setHistoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [slowServerNotice, setSlowServerNotice] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const slowTimerRef = useRef(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    setSlowServerNotice(false)

    // Alert user if request takes more than 3 seconds (Render free tier cold start)
    slowTimerRef.current = setTimeout(() => {
      setSlowServerNotice(true)
    }, 3000)

    try {
      const historyRes = await getHistoryAPI()
      let rawHistory = Array.isArray(historyRes?.data) ? historyRes.data : []

      // In case json-server relations don't expand resume, fetch resumes map as fallback
      const hasMissingResumes = rawHistory.some((item) => !item.resume && item.resumeId)
      let fallbackMap = {}

      if (hasMissingResumes) {
        try {
          const resumesRes = await getResumesAPI()
          if (Array.isArray(resumesRes?.data)) {
            resumesRes.data.forEach((r) => {
              fallbackMap[r.id] = r
            })
          }
        } catch {
          // ignore fallback fail
        }
      }

      const normalized = rawHistory.map((item) => {
        const rawResume = item.resume || fallbackMap[item.resumeId] || null
        return {
          ...item,
          resume: rawResume ? normalizeResume(rawResume) : null
        }
      })

      setHistoryItems(normalized)
    } catch {
      setError('Could not connect to the server. Please verify the backend is running.')
    } finally {
      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current)
      }
      setLoading(false)
      setSlowServerNotice(false)
    }
  }

  useEffect(() => {
    loadData()
    return () => {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
    }
  }, [])

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete from history?',
      text: 'This will remove the snapshot record from your history.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c5361a',
      cancelButtonColor: '#3d0066',
      confirmButtonText: 'Yes, delete it'
    })

    if (!result.isConfirmed) return

    // Optimistic delete
    const previous = [...historyItems]
    setHistoryItems((prev) => prev.filter((item) => item.id !== id))

    try {
      await deleteHistoryAPI(id)
      Swal.fire('Deleted!', 'Record removed from history.', 'success')
    } catch {
      // Revert on failure
      setHistoryItems(previous)
      Swal.fire('Error', 'Failed to delete record from server.', 'error')
    }
  }

  // Filter items by search query (name or title)
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return historyItems
    const q = searchTerm.toLowerCase().trim()
    return historyItems.filter((item) => {
      const name = item.resume?.personalDetails?.name?.toLowerCase() || ''
      const title = item.resume?.personalDetails?.title?.toLowerCase() || ''
      return name.includes(q) || title.includes(q)
    })
  }, [historyItems, searchTerm])

  const total = historyItems.length
  const ready = !loading && !error

  return (
    <div className="st st-page st-vault">
      <div className="st-wrap">
        {/* HEADER & SEARCH */}
        <header className="st-vault__head">
          <div>
            <p className="lp-eyebrow">The career vault</p>
            <h1 className="lp-display st-title">Your archive</h1>
            <p className="st-sub">Every chapter, preserved.</p>
          </div>

          <div className="st-vault__tools">
            <TextField
              size="small"
              placeholder="Search by name or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                htmlInput: { 'aria-label': 'Search the archive by name or title' },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              className="st-vault__search"
            />
            <CtaLink to="/form" size="sm">
              New Resume
            </CtaLink>
            {ready && total > 0 && (
              <span className="st-pill st-vault__count" role="status">
                Showing {filteredItems.length} of {total} {total === 1 ? 'document' : 'documents'}
              </span>
            )}
          </div>
        </header>

        {slowServerNotice && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Waking up the server… Free hosting cold starts can take up to a minute on initial load.
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={loadData}>
                Retry
              </Button>
            }
            sx={{ mb: 4 }}
          >
            {error}
          </Alert>
        )}

        {/* LOADING STATE WITH A4 SKELETON FOLIOS */}
        {loading && (
          <ul className="st-vault__grid" aria-label="Loading archive">
            {[1, 2, 3].map((i) => (
              <li key={i} className="st-card st-folio">
                <Skeleton variant="text" width="62%" height={34} />
                <Skeleton variant="text" width="40%" sx={{ mb: 1.5 }} />
                <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '794 / 880', borderRadius: 2 }} />
                <Skeleton variant="rounded" width="55%" height={36} sx={{ mt: 2, ml: 'auto', borderRadius: 999 }} />
              </li>
            ))}
          </ul>
        )}

        {/* EMPTY VAULT */}
        {ready && total === 0 && (
          <div className="st-state st-vault__empty">
            <EmptyEasel />
            <h2 className="lp-display">The archive is empty</h2>
            <p className="st-sub">Your next career milestone starts with a single sheet.</p>
            <CtaLink to="/form">Draft Your First Resume</CtaLink>
          </div>
        )}

        {/* NO SEARCH RESULTS */}
        {ready && total > 0 && filteredItems.length === 0 && (
          <div className="st-state">
            <p className="st-sub">No resumes matching &ldquo;{searchTerm}&rdquo;</p>
            <button type="button" className="st-btn" onClick={() => setSearchTerm('')}>
              Clear Search
            </button>
          </div>
        )}

        {/* RESPONSIVE GRID OF FOLIOS WITH LIVE A4 THUMBNAILS */}
        {ready && filteredItems.length > 0 && (
          <ul className="st-vault__grid">
            {filteredItems.map((item) => {
              const resume = item.resume
              const when = relativeTime(item)

              return (
                <motion.li key={item.id} className="st-card st-folio" {...cardMotion}>
                  {/* FOLIO HEADER */}
                  <header className="st-folio__head">
                    <div className="st-folio__id">
                      <h2 className="lp-display st-folio__name">
                        {resume?.personalDetails?.name || 'Untitled Resume'}
                      </h2>
                      <p className="lp-serif st-folio__role">
                        {resume?.personalDetails?.title || (resume ? 'No title yet' : 'Record without a resume')}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="st-iconbtn st-iconbtn--danger"
                      aria-label="Delete history entry"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </header>

                  {/* MINI A4 PREVIEW */}
                  <div className="st-folio__window">
                    {resume ? (
                      <div
                        className="lp-paper st-folio__paper"
                        role="img"
                        aria-label={`Preview of ${resume.personalDetails?.name || 'this'} resume`}
                      >
                        <div inert>
                          <ScaledPage>
                            <ResumeTemplate data={resume} />
                          </ScaledPage>
                        </div>
                      </div>
                    ) : (
                      <div className="st-folio__missing">
                        <p className="st-note">Resume details no longer available</p>
                        <button type="button" className="st-btn st-btn--sm" onClick={() => handleDelete(item.id)}>
                          Remove Record
                        </button>
                      </div>
                    )}
                  </div>

                  {/* FOLIO ACTIONS */}
                  <footer className="st-folio__foot">
                    <span className="st-note" title={formatDate(item)}>
                      {when ? `Exported ${when}` : formatDate(item)}
                    </span>
                    {resume && (
                      <div className="st-folio__actions">
                        <button
                          type="button"
                          className="st-btn st-btn--sm"
                          title="Opens the resume with its print and PDF export actions"
                          onClick={() => navigate(`/resume/${item.resumeId}`)}
                        >
                          <FileDownloadOutlinedIcon />
                          View PDF
                        </button>
                        <CtaLink to={`/resume/${item.resumeId}`} size="sm">
                          Open Studio
                        </CtaLink>
                      </div>
                    )}
                  </footer>
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default History
