import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { getAResumeAPI } from '../services/allAPIs'
import { normalizeResume } from '../utils/normalizeResume'
import Preview from '../components/Preview'

const ResumeView = () => {
  const { id } = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchResume = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAResumeAPI(id)
        if (isMounted) {
          if (response?.data) {
            setResumeData(normalizeResume(response.data))
          } else {
            setError('Resume not found')
          }
        }
      } catch {
        if (isMounted) {
          setError('Could not load resume. Please check if the server is running.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (id) {
      fetchResume()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  return (
    <Box sx={{ minHeight: '90vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* TOP BAR */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            component={Link}
            to="/history"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Back to History
          </Button>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            {resumeData?.personalDetails?.name
              ? `${resumeData.personalDetails.name}'s Resume`
              : 'Resume Details'}
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {error && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
            <Button component={Link} to="/history" variant="contained">
              Go back to History
            </Button>
          </Box>
        )}

        {!loading && !error && resumeData && (
          <Box sx={{ width: '100%' }}>
            <Preview
              formData={resumeData}
              resumeId={Number(id) || id}
              mode="final"
              onUpdate={(updated) => setResumeData(normalizeResume(updated))}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default ResumeView

