import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PrintIcon from '@mui/icons-material/Print'
import HistoryIcon from '@mui/icons-material/History'
import Swal from 'sweetalert2'

import { addHistoryAPI } from '../services/allAPIs'
import Edit from './Edit'
import ResumeTemplate from './resume/ResumeTemplate'
import ScaledPage from './resume/ScaledPage'
import TemplatePicker from './resume/TemplatePicker'
import ResumeScore from './resume/ResumeScore'
import { CtaButton } from './studio/Bits'
import { accentName, templateName, DEFAULT_ACCENT, DEFAULT_TEMPLATE } from '../config/resumeDesign'
import '../studio/easel.css'

const slugify = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * The resume on its easel.
 *   mode="live"  — the builder's side pane: status, completeness seal, design controls, live page.
 *   mode="final" — the presentation view: a floating toolbar (optional `lead` slot, document title,
 *                  edit / print / export actions), design controls and the finished A4 page.
 * Everything except the page itself is marked `no-print`.
 */
const Preview = ({ formData, resumeId, mode = 'final', onUpdate, lead = null, draftSaved = false }) => {
  const [downloading, setDownloading] = useState(false)
  const resumeContainerRef = useRef(null)

  const handleTemplateChange = (tplId) => {
    if (onUpdate) {
      onUpdate({ ...formData, template: tplId })
    }
  }

  const handleAccentChange = (hex) => {
    if (onUpdate) {
      onUpdate({ ...formData, accentColor: hex })
    }
  }

  const handlePdfDownload = async () => {
    if (!resumeId) {
      Swal.fire('Notice', 'Please submit your resume form before downloading.', 'info')
      return
    }

    setDownloading(true)
    try {
      // Lazy load html2canvas and jspdf
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

  const template = formData.template || DEFAULT_TEMPLATE
  const accent = formData.accentColor || DEFAULT_ACCENT

  const picker = (compact) => (
    <TemplatePicker
      compact={compact}
      currentTemplate={template}
      currentAccent={accent}
      onTemplateChange={handleTemplateChange}
      onAccentChange={handleAccentChange}
    />
  )

  if (mode !== 'final') {
    return (
      <div className="st-live">
        <div className="st-live__bar">
          <span className="st-pill">
            <span className="st-pill__dot" data-state={draftSaved ? 'saved' : 'saving'} />
            Live draft • {draftSaved ? 'Autosaved' : 'Unsaved'}
          </span>
          <span className="st-note" title="Complete and submit the form to download as PDF or save to history">
            PDF available after submit
          </span>
        </div>

        {/* COMPLETENESS SCORE */}
        <ResumeScore data={formData} compact />

        {/* TEMPLATE & ACCENT PICKER DURING LIVE FORM EDITING */}
        {picker(true)}

        {/* RESPONSIVE SCALED RESUME DISPLAY */}
        <div className="st-mat" ref={resumeContainerRef}>
          <div className="st-sheet">
            <ScaledPage>
              <ResumeTemplate data={formData} placeholders />
            </ScaledPage>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="st-view">
      {/* FLOATING TOOLBAR */}
      <div className="st-toolbar no-print">
        {lead ? <div className="st-toolbar__lead">{lead}</div> : null}

        <div className="st-toolbar__title">
          <strong className="lp-display">{formData.personalDetails?.name || 'Untitled resume'}</strong>
          <span className="st-pill">
            {templateName(template)} • {accentName(accent)}
          </span>
        </div>

        <div className="st-toolbar__actions">
          <Edit resumeId={resumeId} onUpdate={onUpdate} />

          <button
            type="button"
            className="st-btn"
            onClick={handlePrint}
            title="Browser print produces selectable text and clickable links"
          >
            <PrintIcon />
            Print ATS PDF
          </button>

          <Link to="/history" className="st-btn st-btn--quiet">
            <HistoryIcon />
            Archive
          </Link>

          <CtaButton size="sm" onClick={handlePdfDownload} busy={downloading} disabled={!resumeId}>
            {downloading ? 'Exporting PDF...' : 'Download High-Res PDF'}
          </CtaButton>
        </div>
      </div>

      <div className="st-view__body">
        <aside className="st-view__side no-print">
          {/* COMPLETENESS SCORE */}
          <ResumeScore data={formData} />

          {/* TEMPLATE PICKER IN FINAL PREVIEW */}
          <div className="st-card st-view__design">{picker(false)}</div>
        </aside>

        {/* RESPONSIVE SCALED RESUME DISPLAY */}
        <div className="st-view__stage" ref={resumeContainerRef}>
          <div className="st-sheet st-sheet--hero">
            <ScaledPage>
              <ResumeTemplate data={formData} />
            </ScaledPage>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview
