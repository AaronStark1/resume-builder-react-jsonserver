import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Preview from './Preview'
import FormSteps from './FormSteps'

const Form = () => {
  const [formData, setFormData] = useState({
    personalDetails: { name: '', title: '', location: '' },
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
      duration: '',
    },
    skills: [],
    summary: '',
  })
  const [resumeId, setResumeId] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* PAGE TITLE */}
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary.main">
        {isFinished ? 'Your Resume is Ready!' : 'Resume Builder'}
      </Typography>

      {/* WORK AREA */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        sx={{
          alignItems: 'flex-start',
        }}
      >
        {isFinished ? (
          <Box sx={{ width: '100%' }}>
            <Preview
              formData={formData}
              resumeId={resumeId}
              mode="final"
              onUpdate={(updated) => setFormData(updated)}
            />
          </Box>
        ) : (
          <>
            {/* FORM SIDE */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <FormSteps
                formData={formData}
                setFormData={setFormData}
                setIsFinished={setIsFinished}
                setResumeId={setResumeId}
              />
            </Box>

            {/* PREVIEW SIDE */}
            <Box
              sx={{
                flex: 1.2,
                width: '100%',
                p: 2,
                borderRadius: 2,
                backgroundColor: '#fafafa',
                border: '1px solid #e0e0e0',
                minHeight: 500,
              }}
            >
              <Preview
                formData={formData}
                resumeId={resumeId}
                mode="live"
                onUpdate={(updated) => setFormData(updated)}
              />
            </Box>
          </>
        )}
      </Stack>
    </Box>
  )
}

export default Form
