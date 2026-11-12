import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { addHistoryAPI } from '../services/allAPIs'
import Swal from 'sweetalert2'
import Edit from './Edit'

const Preview = ({ formData, resumeId, mode = 'final', onUpdate }) => {
  const [downloading, setDownloading] = useState(false)

  const {
    personalDetails = {},
    contactDetails = {},
    education = {},
    professionalDetails = {},
    skills = [],
    summary = ''
  } = formData

  const handlePdfDownload = async () => {
    if (!resumeId) {
      Swal.fire('Notice', 'Please complete and submit the resume before downloading.', 'info')
      return
    }

    setDownloading(true)
    try {
      const el = document.getElementById('result')
      if (!el) return

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#fff',
        useCORS: true
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.92)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      const safeName = (personalDetails.name || 'resume').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      pdf.save(`${safeName}-rbuild.pdf`)

      const formattedDate =
        new Date().toLocaleDateString() + ' , ' + new Date().toLocaleTimeString()

      // Record download in history
      try {
        await addHistoryAPI({
          resumeId,
          formattedDate,
          createdAt: new Date().toISOString()
        })
      } catch {
        // Non-blocking history save failure
        console.warn('History save failed')
      }

      Swal.fire({
        title: 'Success',
        text: 'Resume downloaded & added to history',
        icon: 'success'
      })
    } catch {
      Swal.fire('Error', 'Failed to generate PDF. Please try again.', 'error')
    } finally {
      setDownloading(false)
    }
  }

  // Filter present contact links
  const contactParts = [
    contactDetails.phoneNumber,
    contactDetails.email,
    personalDetails.location
  ].filter(Boolean)

  const onlineLinks = [
    contactDetails.github ? { label: 'GitHub', href: contactDetails.github } : null,
    contactDetails.linkedIn ? { label: 'LinkedIn', href: contactDetails.linkedIn } : null,
    contactDetails.portfolio ? { label: 'Portfolio', href: contactDetails.portfolio } : null,
  ].filter(Boolean)

  return (
    <Box>
      {/* ACTION BAR */}
      {mode === 'final' ? (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          mb={3}
          flexWrap="wrap"
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handlePdfDownload}
            disabled={downloading || !resumeId}
            startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>

          <Edit
            resumeId={resumeId}
            onUpdate={onUpdate}
          />

          <Button
            component={Link}
            to="/history"
            variant="outlined"
            size="large"
          >
            History
          </Button>
        </Stack>
      ) : (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Live Preview
          </Typography>
          <Tooltip title="Submit the form to enable PDF download and history saving">
            <span>
              <Button size="small" variant="text" disabled>
                PDF Available After Submit
              </Button>
            </span>
          </Tooltip>
        </Box>
      )}

      {/* RESUME DISPLAY */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper
          id="result"
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 700,
            minHeight: 850,
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            background: '#ffffff',
            color: '#111827'
          }}
        >
          {/* HEADER */}
          <Typography variant="h3" align="center" fontWeight="bold">
            {personalDetails.name || 'Full Name'}
          </Typography>

          <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 0.5 }}>
            {personalDetails.title || 'Designation / Professional Title'}
          </Typography>

          {contactParts.length > 0 && (
            <Typography align="center" mt={1} color="text.secondary" variant="body2">
              {contactParts.join(' • ')}
            </Typography>
          )}

          {onlineLinks.length > 0 && (
            <Typography align="center" mt={0.5} variant="body2">
              {onlineLinks.map((link, idx) => (
                <span key={link.label}>
                  <a
                    href={link.href.startsWith('http') ? link.href : `https://${link.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3d0066', textDecoration: 'none' }}
                  >
                    {link.label}
                  </a>
                  {idx < onlineLinks.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </Typography>
          )}

          {/* SUMMARY */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Professional Summary
          </Typography>

          <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1, color: '#374151' }}>
            {summary || 'Add your professional summary here.'}
          </Typography>

          {/* EDUCATION */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Education
          </Typography>

          <Typography fontWeight="bold" sx={{ mt: 1 }}>
            {education.course || 'Degree / Field of Study'}
          </Typography>

          <Typography color="text.secondary" variant="body2">
            {[education.college, education.university, education.year].filter(Boolean).join(' • ') ||
              'Institution • University • Year'}
          </Typography>

          {/* EXPERIENCE */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Professional Experience
          </Typography>

          <Typography fontWeight="bold" sx={{ mt: 1 }}>
            {professionalDetails.jobTitle || 'Job Title'}
          </Typography>

          <Typography color="text.secondary" variant="body2">
            {[
              professionalDetails.company,
              professionalDetails.location,
              professionalDetails.duration
            ].filter(Boolean).join(' • ') || 'Company • Location • Duration'}
          </Typography>

          {/* SKILLS */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold" mb={1.5} color="primary.main">
            Skills
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {(skills.length ? skills : ['Skill 1', 'Skill 2', 'Skill 3']).map((item, i) => (
              <Box
                key={i}
                sx={{
                  px: 2,
                  py: 0.6,
                  borderRadius: 2,
                  bgcolor: '#f1f3f5',
                  fontSize: 13,
                  fontWeight: 500
                }}
              >
                {item}
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}

export default Preview
