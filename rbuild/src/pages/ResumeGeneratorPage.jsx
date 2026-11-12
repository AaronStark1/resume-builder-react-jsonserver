import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Grid
} from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { usePageTitle } from '../utils/usePageTitle'
import ScaledPage from '../components/resume/ScaledPage'
import ResumeTemplate from '../components/resume/ResumeTemplate'

const sampleResume = {
  personalDetails: {
    name: 'David Miller',
    title: 'Full Stack Web Developer',
    location: 'Austin, TX'
  },
  contactDetails: {
    email: 'david.miller@example.com',
    phoneNumber: '+1 (555) 987-6543',
    github: 'https://github.com/example',
    linkedIn: 'https://linkedin.com/in/example',
    portfolio: 'https://davidmiller.dev'
  },
  education: {
    course: 'B.S. Software Engineering',
    college: 'University of Texas at Austin',
    year: '2022'
  },
  professionalDetails: {
    jobTitle: 'Full Stack Engineer',
    company: 'Stripe',
    duration: '2022 - Present'
  },
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  summary: 'Detail-oriented engineer experienced in designing scalable RESTful architectures and high-performance React frontends.'
}

const points = [
  'Structured 7-step guided input form',
  'Real-time live A4 resume preview',
  'Multiple professional templates & accent colors',
  'Instant high-resolution PDF download',
  'Autosaved draft history in browser',
  'Edit anytime with direct sync'
]

const ResumeGeneratorPage = () => {
  usePageTitle('Create Resume')

  return (
    <Box
      sx={(theme) => ({
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: theme.custom.gradient,
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      })}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">

          {/* LEFT CONTENT */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  fontSize: { xs: '2.4rem', md: '3.2rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  mb: 2.5
                }}
              >
                Create Your Professional Resume
              </Typography>

              <Typography variant="h6" sx={{ opacity: 0.88, mb: 4, lineHeight: 1.6, fontWeight: 400 }}>
                Build a job-winning resume in minutes using our smart resume generator. Highlight your strengths, organize your experience, and make a lasting impression on recruiters.
              </Typography>

              <Stack spacing={2} mb={5}>
                {points.map((pt) => (
                  <Stack key={pt} direction="row" spacing={1.5} alignItems="center">
                    <CheckCircleIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
                    <Typography variant="body1" fontWeight={500}>
                      {pt}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Button
                component={Link}
                to="/form"
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 5,
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: '1.05rem',
                  boxShadow: '0 8px 24px rgba(255,123,0,0.35)'
                }}
              >
                Launch Builder
              </Button>
            </motion.div>
          </Grid>

          {/* RIGHT INTERACTIVE PREVIEW */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.7 },
                scale: { duration: 0.7 },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
              }}
              style={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 380,
                  boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <ScaledPage targetWidth={380}>
                  <ResumeTemplate data={sampleResume} />
                </ScaledPage>
              </Box>
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default ResumeGeneratorPage
