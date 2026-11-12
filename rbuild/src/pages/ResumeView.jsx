import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { getAResumeAPI } from '../services/allAPIs'
import { normalizeResume } from '../utils/normalizeResume'
import Preview from '../components/Preview'
import { usePageTitle } from '../utils/usePageTitle'

const BackToArchive = () => (
  <Link to="/history" className="st-back">
    <ArrowBackIcon />
    Back to archive
  </Link>
)

const ResumeView = () => {
  const { id } = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const name = resumeData?.personalDetails?.name
  usePageTitle(name ? `${name} — Resume` : 'Resume')

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
    <div className="st st-page st-gallery">
      <div className="st-wrap">
        {loading && (
          <div className="st-state">
            <CircularProgress color="secondary" />
          </div>
        )}

        {error && (
          <div className="st-state">
            <Alert severity="error" sx={{ maxWidth: 600 }}>
              {error}
            </Alert>
            <BackToArchive />
          </div>
        )}

        {!loading && !error && resumeData && (
          <Preview
            formData={resumeData}
            resumeId={Number(id) || id}
            mode="final"
            lead={<BackToArchive />}
            onUpdate={(updated) => setResumeData(normalizeResume(updated))}
          />
        )}
      </div>
    </div>
  )
}

export default ResumeView
