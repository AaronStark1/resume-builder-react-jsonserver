import React, { useState } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Preview from './Preview'
import FormSteps from './FormSteps'

const Form = () => {

  const [formData, setFormData] = useState({
    personalDetails: { name: "", title: '', location: '' },
    contactDetails: {
      email: '',
      phoneNumber: '',
      github: '',
      linkedIn: '',
      portfolio: '',
    },
    education: { course: '', college: '', university: '', year: '' },
    professionalDetails: {
      jobTitle: '',
      company: '',
      location: '',
      duration: ''
    },
    skills: [],
    summary: ''
  })
  const [resumeId, setResumeId] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 3 }}>

      {/* PAGE TITLE */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Resume Builder
      </Typography>

      {/* WORK AREA */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{
          alignItems: "flex-start"
        }}
      >

        {
          isFinished
            ? (
              <Box sx={{ width: "100%" }}>
                <Preview formData={formData} resumeId={resumeId}/>
              </Box>
            )
            : (
              <>
                {/* FORM SIDE */}
                <Box sx={{ flex: 1 }}>
                  <FormSteps
                    formData={formData}
                    setFormData={setFormData}
                    isFinished={isFinished}
                    setIsFinished={setIsFinished}
                    setResumeId={setResumeId}
                  />
                </Box>

                {/* PREVIEW SIDE */}
                <Box
                  sx={{
                    flex: 1.3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    border: "1px solid #e0e0e0",
                    minHeight: 500
                  }}
                >
                  <Preview formData={formData} resumeId={resumeId}/>
                </Box>
              </>
            )
        }

      </Stack>

    </Box>
  )
}

export default Form