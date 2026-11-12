import { useEffect, useState, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  IconButton,
  Button,
  TextField,
  Skeleton,
  Alert,
  InputAdornment
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff'
import Swal from 'sweetalert2'

import { deleteHistoryAPI, getHistoryAPI, getResumesAPI } from '../services/allAPIs'
import { normalizeResume } from '../utils/normalizeResume'
import ScaledPage from '../components/resume/ScaledPage'
import ResumeTemplate from '../components/resume/ResumeTemplate'

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

const History = () => {
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
      confirmButtonColor: '#d33',
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 4, md: 6 }
      }}
    >
      <Container maxWidth="lg">
        {/* HEADER & SEARCH */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              Resume History
            </Typography>
            <Typography color="text.secondary">
              Review and manage your previously generated resumes
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <TextField
              size="small"
              placeholder="Search by name or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: { sm: 260 } }}
            />
            <Button
              component={Link}
              to="/form"
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              New Resume
            </Button>
          </Stack>
        </Box>

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

        {/* LOADING STATE WITH A4 SKELETON CARDS */}
        {loading && (
          <Grid container spacing={4}>
            {[1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Paper sx={{ p: 2, borderRadius: 3 }}>
                  <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: '100%', height: 420, borderRadius: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Skeleton variant="rectangular" width={70} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={70} height={32} sx={{ borderRadius: 1 }} />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && historyItems.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 10,
              px: 3,
              borderRadius: 4,
              border: '2px dashed rgba(20,0,43,0.12)',
              bgcolor: 'transparent'
            }}
          >
            <HistoryToggleOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" color="primary.main" mb={1}>
              No resumes yet
            </Typography>
            <Typography color="text.secondary" maxWidth={450} mx="auto" mb={3}>
              You haven&apos;t downloaded or created any resumes yet. Start building your first professional resume in minutes!
            </Typography>
            <Button
              component={Link}
              to="/form"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<AddIcon />}
              sx={{ px: 4, fontWeight: 'bold' }}
            >
              Build Your First Resume
            </Button>
          </Paper>
        )}

        {/* NO SEARCH RESULTS */}
        {!loading && !error && historyItems.length > 0 && filteredItems.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No resumes matching &ldquo;{searchTerm}&rdquo;
            </Typography>
            <Button variant="outlined" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </Box>
        )}

        {/* MASONRY / RESPONSIVE GRID OF A4 THUMBNAILS */}
        {!loading && !error && filteredItems.length > 0 && (
          <Grid container spacing={4}>
            {filteredItems.map((item) => {
              const resume = item.resume

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <Paper
                    sx={{
                      borderRadius: 3,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 12px 24px rgba(20,0,43,0.1)'
                      }
                    }}
                  >
                    {/* CARD HEADER */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5
                      }}
                    >
                      <Box sx={{ overflow: 'hidden', pr: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap color="primary.main">
                          {resume?.personalDetails?.name || 'Untitled Resume'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(item)}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Delete history entry"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* MINI A4 PREVIEW THUMBNAIL */}
                    <Box
                      sx={{
                        width: '100%',
                        height: 380,
                        overflow: 'hidden',
                        borderRadius: 2,
                        bgcolor: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.06)',
                        position: 'relative'
                      }}
                    >
                      {resume ? (
                        <ScaledPage targetWidth={270}>
                          <ResumeTemplate data={resume} />
                        </ScaledPage>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            p: 3,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            Resume details no longer available
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => handleDelete(item.id)}
                          >
                            Remove Record
                          </Button>
                        </Box>
                      )}
                    </Box>

                    {/* CARD ACTIONS */}
                    {resume && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          fullWidth
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/resume/${item.resumeId}`)}
                        >
                          Open
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          fullWidth
                          startIcon={<DownloadIcon />}
                          onClick={() => navigate(`/resume/${item.resumeId}`)}
                        >
                          Download
                        </Button>
                      </Stack>
                    )}
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default History
