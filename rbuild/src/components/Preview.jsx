import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { addHistoryAPI } from '../services/allAPIs'
import Swal from 'sweetalert2'
import Edit from './Edit'

const Preview = ({ formData, resumeId }) => {

  const {
    personalDetails,
    contactDetails,
    education,
    professionalDetails,
    skills,
    summary
  } = formData

  const [updatedData, setUpdatedData] = useState({})

  const handlePdfDownload = async () => {

    const canvas = await html2canvas(
      document.getElementById("result"),
      { scale: 2 }
    )

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('resume.pdf')

    const formattedDate =
      new Date().toLocaleDateString() +
      " , " +
      new Date().toLocaleTimeString()

    try {

      // ⭐ NEW HISTORY SYSTEM
      await addHistoryAPI({
        resumeId,
        formattedDate
      })

      Swal.fire(
        "Success",
        "Resume downloaded & added to history",
        "success"
      )

    } catch {
      Swal.fire("Error", "History save failed", "error")
    }
  }

  // ⭐ live merge logic
  const pd = updatedData.personalDetails || personalDetails
  const cd = updatedData.contactDetails || contactDetails
  const ed = updatedData.education || education
  const pro = updatedData.professionalDetails || professionalDetails
  const sk = updatedData.skills?.length ? updatedData.skills : skills
  const sm = updatedData.summary ?? summary

  return (
    <Box>

      {/* ACTION BAR */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        mb={3}
        flexWrap="wrap"
      >
        <Button variant="contained" size="large" onClick={handlePdfDownload}>
          Download PDF
        </Button>

        <Edit
          resumeId={resumeId}
          onUpdate={(data) => setUpdatedData(data)}
        />

        <Link to="/history">
          <Button variant="outlined" size="large">
            History
          </Button>
        </Link>
      </Stack>

      {/* RESUME */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          id="result"
          elevation={6}
          sx={{
            width: 700,
            minHeight: 900,
            p: 5,
            borderRadius: 2,
            background: "white"
          }}
        >

          {/* HEADER */}
          <Typography variant="h3" align="center" fontWeight="bold">
            {pd.name || "Full Name"}
          </Typography>

          <Typography variant="h6" align="center" color="text.secondary">
            {pd.title || "Designation"}
          </Typography>

          <Typography align="center" mt={1} color="text.secondary">
            {cd.phoneNumber || "Phone"} • {cd.email || "Email"} • {pd.location || "Location"}
          </Typography>

          <Typography align="center" mt={1}>
            <a href={cd.github || "#"}>GitHub</a> •{" "}
            <a href={cd.linkedIn || "#"}>LinkedIn</a> •{" "}
            <a href={cd.portfolio || "#"}>Portfolio</a>
          </Typography>

          {/* SUMMARY */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight="bold">
            Professional Summary
          </Typography>

          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {sm || "Add your professional summary here."}
          </Typography>

          {/* EDUCATION */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight="bold">
            Education
          </Typography>

          <Typography fontWeight="bold">
            {ed.course || "Course"}
          </Typography>

          <Typography color="text.secondary">
            {ed.college || "College"} • {ed.university || "University"} • {ed.year || "Year"}
          </Typography>

          {/* EXPERIENCE */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight="bold">
            Professional Experience
          </Typography>

          <Typography fontWeight="bold">
            {pro.jobTitle || "Job Title"}
          </Typography>

          <Typography color="text.secondary">
            {pro.company || "Company"} • {pro.location || "Location"} • {pro.duration || "Duration"}
          </Typography>

          {/* SKILLS */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Skills
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {(sk.length ? sk : ["Skill 1", "Skill 2"]).map((item, i) => (
              <Box
                key={i}
                sx={{
                  px: 2,
                  py: 0.6,
                  borderRadius: 2,
                  bgcolor: "#f1f3f5",
                  fontSize: 13
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