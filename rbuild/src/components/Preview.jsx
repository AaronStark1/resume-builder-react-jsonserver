import { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import { Link } from 'react-router-dom'
import PrintIcon from '@mui/icons-material/Print'
import DownloadIcon from '@mui/icons-material/Download'
import HistoryIcon from '@mui/icons-material/History'
import Swal from 'sweetalert2'

import { addHistoryAPI } from '../services/allAPIs'
import Edit from './Edit'
import ResumeTemplate from './resume/ResumeTemplate'
import ScaledPage from './resume/ScaledPage'

const slugify = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

const Preview = ({ formData, resumeId, mode = 'final', onUpdate }) => {
  const [downloading, setDownloading] = useState(false)
  const resumeContainerRef = useRef(null)

  const handlePdfDownload = async () => {
    if (!resumeId) {
      Swal.fire('Notice', 'Please submit your resume form before downloading.', 'info')
      return
    }

    setDownloading(true)
    try {
      // Lazy load html2canvas and jspdf to reduce initial bundle
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])

      const el = document.getElementById('resume-a4-page')
      if (!el) {
        throw new Error('Resume element not found')
      }

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        onclone: (doc) => {
          const scaler = doc.getElementById('resume-scaler')
          if (scaler) {
            scaler.style.transform = 'none'
            scaler.style.position = 'static'
          }
        }
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.92)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidthMm = 210
      const pageHeightMm = 297
      const totalHeightMm = (canvas.height * pageWidthMm) / canvas.width

      let heightLeft = totalHeightMm
      let position = 0

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, pageWidthMm, totalHeightMm)
      heightLeft -= pageHeightMm

      // Multi-page slicing if content exceeds 1 page
      while (heightLeft > 0) {
        position = -(totalHeightMm - heightLeft)
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, pageWidthMm, totalHeightMm)
        heightLeft -= pageHeightMm
      }

      const safeName = slugify(formData.personalDetails?.name) || 'resume'
      pdf.save(`${safeName}-rbuild.pdf`)

      const formattedDate =
        new Date().toLocaleDateString() + ' , ' + new Date().toLocaleTimeString()

      // Record in history after PDF succeeds
      try {
        await addHistoryAPI({
          resumeId,
          formattedDate,
          createdAt: new Date().toISOString()
        })
      } catch {
        // Non-blocking history save
      }

      Swal.fire({
        title: 'Success!',
        text: 'Resume PDF downloaded and saved to history.',
        icon: 'success'
      })
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Failed to generate PDF. Please try again.', 'error')
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

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
          className="no-print"
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
            onClick={handlePdfDownload}
            disabled={downloading || !resumeId}
            sx={{ fontWeight: 'bold', px: 3 }}
          >
            {downloading ? 'Exporting PDF...' : 'Download PDF'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            title="Browser print produces selectable text and clickable links"
          >
            Print / ATS PDF
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
            startIcon={<HistoryIcon />}
          >
            History
          </Button>
        </Stack>
      ) : (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
            Live Resume Preview
          </Typography>
          <Tooltip title="Complete and submit the form to download as PDF or save to history">
            <span>
              <Button size="small" variant="text" disabled>
                PDF available after submit
              </Button>
            </span>
          </Tooltip>
        </Box>
      )}

      {/* RESPONSIVE SCALED RESUME DISPLAY */}
      <Box ref={resumeContainerRef} sx={{ display: 'flex', justifyContent: 'center' }}>
        <ScaledPage>
          <ResumeTemplate data={formData} placeholders={mode === 'live'} />
        </ScaledPage>
      </Box>
    </Box>
  )
}

export default Preview
