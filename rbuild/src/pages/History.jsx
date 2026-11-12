import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  IconButton,
  Chip,
  Alert
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteHistoryAPI, getHistoryAPI, getResumesAPI } from '../services/allAPIs'
import Swal from 'sweetalert2'

const History = () => {
  const [historyData, setHistoryData] = useState([])
  const [resumeMap, setResumeMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const historyRes = await getHistoryAPI()
      const resumesRes = await getResumesAPI()

      const map = {}
      if (Array.isArray(resumesRes?.data)) {
        resumesRes.data.forEach((r) => {
          map[r.id] = r
        })
      }

      setResumeMap(map)
      setHistoryData(Array.isArray(historyRes?.data) ? historyRes.data : [])
    } catch {
      setError('Could not connect to the server. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const deleteHistory = async (id) => {
    try {
      await deleteHistoryAPI(id)
      setHistoryData((prev) => prev.filter((item) => item.id !== id))
      Swal.fire('Deleted', 'History record deleted', 'success')
    } catch {
      Swal.fire('Error', 'Failed to delete history record', 'error')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f8f9fc, #eef1f6)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        {/* HEADER */}
        <Box mb={5}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Resume History
          </Typography>
          <Typography color="text.secondary">
            All previously generated resumes
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Typography color="text.secondary">Loading history...</Typography>
        ) : historyData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No resumes in history yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="flex-start">
            {historyData.map((item) => {
              const resume = resumeMap[item.resumeId]

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <Paper
                    sx={{
                      borderRadius: 4,
                      p: 2,
                      transition: '0.3s',
                      ':hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    {/* TOP BAR */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {item.formattedDate || (item.createdAt ? new Date(item.createdAt).toLocaleString() : '')}
                      </Typography>

                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Delete history entry"
                        onClick={() => deleteHistory(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>

                    {/* A4 PREVIEW CONTAINER */}
                    <Box
                      sx={{
                        background: '#fff',
                        borderRadius: 3,
                        boxShadow: 2,
                        p: 2,
                        height: 450,
                        overflow: 'hidden'
                      }}
                    >
                      {resume ? (
                        <>
                          <Typography align="center" fontWeight="bold" variant="subtitle1">
                            {resume.personalDetails?.name || 'Untitled Resume'}
                          </Typography>

                          <Typography
                            align="center"
                            fontSize={13}
                            color="text.secondary"
                          >
                            {resume.personalDetails?.title}
                          </Typography>

                          <Typography
                            align="center"
                            fontSize={11}
                            color="text.secondary"
                          >
                            {[resume.contactDetails?.phoneNumber, resume.contactDetails?.email]
                              .filter(Boolean)
                              .join(' • ')}
                          </Typography>

                          <Typography
                            align="center"
                            fontSize={11}
                            color="text.secondary"
                          >
                            {resume.personalDetails?.location}
                          </Typography>

                          {resume.summary && (
                            <Box mt={2}>
                              <Typography fontWeight="bold" fontSize={13}>
                                Summary
                              </Typography>
                              <Typography
                                fontSize={12}
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                {resume.summary}
                              </Typography>
                            </Box>
                          )}

                          {resume.education?.course && (
                            <Box mt={1.5}>
                              <Typography fontWeight="bold" fontSize={13}>
                                Education
                              </Typography>
                              <Typography fontSize={12}>
                                {resume.education.course}
                              </Typography>
                              <Typography fontSize={11} color="text.secondary">
                                {resume.education.college}
                              </Typography>
                            </Box>
                          )}

                          {resume.professionalDetails?.jobTitle && (
                            <Box mt={1.5}>
                              <Typography fontWeight="bold" fontSize={13}>
                                Experience
                              </Typography>
                              <Typography fontSize={12}>
                                {resume.professionalDetails.jobTitle}
                              </Typography>
                              <Typography fontSize={11} color="text.secondary">
                                {resume.professionalDetails.company}
                              </Typography>
                            </Box>
                          )}

                          {Array.isArray(resume.skills) && resume.skills.length > 0 && (
                            <Box mt={1.5}>
                              <Typography fontWeight="bold" fontSize={13} mb={0.5}>
                                Skills
                              </Typography>
                              <Stack
                                direction="row"
                                flexWrap="wrap"
                                gap={0.5}
                                sx={{
                                  maxHeight: 60,
                                  overflow: 'hidden'
                                }}
                              >
                                {resume.skills.map((s, i) => (
                                  <Chip key={i} label={s} size="small" />
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </>
                      ) : (
                        <Box sx={{ textAlign: 'center', mt: 15, px: 2 }}>
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            Resume details no longer available
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            aria-label="Remove record"
                            onClick={() => deleteHistory(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
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
