import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  Container,
  Chip
} from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import DescriptionIcon from '@mui/icons-material/Description'
import PreviewIcon from '@mui/icons-material/Preview'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import HistoryIcon from '@mui/icons-material/History'
import SaveIcon from '@mui/icons-material/Save'
import PaletteIcon from '@mui/icons-material/Palette'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { usePageTitle } from '../utils/usePageTitle'
import { fadeUp, stagger } from '../motion/variants'
import ScaledPage from '../components/resume/ScaledPage'
import ResumeTemplate from '../components/resume/ResumeTemplate'

const heroSampleResume = {
  personalDetails: {
    name: 'Sarah Jenkins',
    title: 'Senior Frontend Engineer',
    location: 'San Francisco, CA'
  },
  contactDetails: {
    email: 'sarah.jenkins@example.com',
    phoneNumber: '+1 (555) 234-5678',
    github: 'https://github.com/example',
    linkedIn: 'https://linkedin.com/in/example',
    portfolio: 'https://sarahjenkins.dev'
  },
  education: {
    course: 'B.S. in Computer Science',
    college: 'University of California, Berkeley',
    university: 'UC Berkeley',
    year: '2021'
  },
  professionalDetails: {
    jobTitle: 'Senior Software Engineer',
    company: 'Vercel',
    location: 'San Francisco',
    duration: '2021 - Present'
  },
  skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GraphQL'],
  summary: 'Passionate frontend engineer with 4+ years of experience architecting fast, accessible web applications.'
}

const features = [
  {
    title: 'Guided Step Form',
    desc: 'Structured 7-step wizard with built-in validation for every field.',
    icon: <DescriptionIcon />
  },
  {
    title: 'Instant Live Preview',
    desc: 'Watch your resume render in real-time with authentic A4 proportions as you type.',
    icon: <PreviewIcon />
  },
  {
    title: 'High-Resolution PDF',
    desc: 'Export crisp, print-ready multi-page PDFs in seconds using client-side generation.',
    icon: <DownloadIcon />
  },
  {
    title: 'Direct Resume Editor',
    desc: 'Revisit and edit any section with an intuitive modal editor that stays in sync.',
    icon: <EditIcon />
  },
  {
    title: 'Download History',
    desc: 'Access your previous resume snapshots anytime with instant previews and re-download.',
    icon: <HistoryIcon />
  },
  {
    title: 'Automatic Draft Autosave',
    desc: 'Work at your own pace. Form drafts are safely preserved in your browser.',
    icon: <SaveIcon />
  },
  {
    title: 'Modern Templates',
    desc: 'Choose between Classic, Modern sidebar, and Minimal layouts with custom accent colors.',
    icon: <PaletteIcon />
  }
]

const steps = [
  {
    num: '01',
    title: 'Fill Your Details',
    desc: 'Follow the guided steps for contact info, education, work experience, and skills with helpful smart suggestions.'
  },
  {
    num: '02',
    title: 'Live Preview & Refine',
    desc: 'Review your resume formatted in standard A4 dimensions. Pick your favorite template and color palette.'
  },
  {
    num: '03',
    title: 'Export & Apply',
    desc: 'Generate a clean, recruiter-ready PDF with one click or print directly for applicant tracking systems.'
  }
]

const LandingPage = () => {
  usePageTitle('Smart Resume Builder')

  return (
    <Box sx={{ overflowX: 'hidden' }}>

      {/* HERO SECTION */}
      <Box
        sx={(theme) => ({
          minHeight: { xs: 'auto', md: '92vh' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          bgcolor: '#14002b',
          background: theme.custom.gradient,
          color: 'white',
          py: { xs: 8, md: 12 },
          overflow: 'hidden',
          '::before': {
            content: '""',
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,123,0,0.18) 0%, rgba(20,0,43,0) 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          },
          '::after': {
            content: '""',
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(61,0,102,0.6) 0%, rgba(20,0,43,0) 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }
        })}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">

            {/* LEFT HERO TEXT */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial="hidden"
                animate="show"
                variants={stagger(0.12)}
              >
                <motion.div variants={fadeUp}>
                  <Chip
                    icon={<CheckCircleIcon sx={{ color: '#ff7b00 !important' }} />}
                    label="Free & Open Source Resume Builder"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: 'white',
                      fontWeight: 600,
                      mb: 2.5,
                      border: '1px solid rgba(255,255,255,0.12)'
                    }}
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem' },
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                      mb: 2.5
                    }}
                  >
                    Build a Resume <br />
                    <span
                      style={{
                        background: 'linear-gradient(90deg, #ff7b00, #ffab40)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      That Gets Interviews
                    </span>
                  </Typography>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Typography
                    variant="h6"
                    sx={{
                      opacity: 0.88,
                      fontWeight: 400,
                      lineHeight: 1.6,
                      fontSize: { xs: '1.05rem', md: '1.2rem' },
                      mb: 4,
                      maxWidth: 520
                    }}
                  >
                    Craft a structured, recruiter-ready resume in minutes with our step-by-step generator, real-time A4 preview, and instant PDF download.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      component={Link}
                      to="/form"
                      variant="contained"
                      color="secondary"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4,
                        py: 1.6,
                        borderRadius: 3,
                        fontWeight: 'bold',
                        fontSize: '1.05rem',
                        boxShadow: '0 8px 24px rgba(255,123,0,0.35)',
                        ':hover': {
                          bgcolor: 'secondary.dark',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      Create My Resume
                    </Button>

                    <Button
                      component={Link}
                      to="/history"
                      variant="outlined"
                      size="large"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.4)',
                        borderRadius: 3,
                        px: 3.5,
                        py: 1.6,
                        ':hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                          borderColor: 'white'
                        }
                      }}
                    >
                      View History
                    </Button>
                  </Stack>
                </motion.div>
              </motion.div>
            </Grid>

            {/* RIGHT HERO INTERACTIVE MINI RESUME */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  perspective: 1000
                }}
              >
                {/* FLOATING RESUME PREVIEW */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateY: -6 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateY: -4,
                    y: [0, -10, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.8 },
                    scale: { duration: 0.8 },
                    y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  style={{
                    width: '100%',
                    maxWidth: 380,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                    borderRadius: 16,
                    overflow: 'hidden'
                  }}
                >
                  <ScaledPage targetWidth={380}>
                    <ResumeTemplate data={heroSampleResume} />
                  </ScaledPage>
                </motion.div>

                {/* FLOATING HIGHLIGHT CHIPS */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  sx={{
                    position: 'absolute',
                    top: '12%',
                    left: { xs: 0, md: -20 },
                    bgcolor: 'rgba(20, 0, 43, 0.92)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    border: '1px solid rgba(255,123,0,0.4)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CheckCircleIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                  <Typography variant="caption" fontWeight="bold">
                    100% Client-Side PDF
                  </Typography>
                </Box>

                <Box
                  component={motion.div}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  sx={{
                    position: 'absolute',
                    bottom: '15%',
                    right: { xs: 0, md: -20 },
                    bgcolor: 'rgba(20, 0, 43, 0.92)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    ⚡ Live A4 Scaling
                  </Typography>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <Typography variant="h3" align="center" fontWeight="bold" color="primary.main" mb={2}>
              How It Works
            </Typography>
            <Typography align="center" color="text.secondary" maxWidth={600} mx="auto" mb={8}>
              Build and download a complete, ATS-friendly resume in three easy steps
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {steps.map((st, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={st.num}>
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } }
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 4,
                      borderRadius: 4,
                      position: 'relative',
                      bgcolor: '#ffffff',
                      boxShadow: '0 4px 16px rgba(20,0,43,0.04)',
                      border: '1px solid rgba(20,0,43,0.06)'
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight={900}
                      sx={{
                        color: 'rgba(255,123,0,0.18)',
                        position: 'absolute',
                        top: 16,
                        right: 24,
                        userSelect: 'none'
                      }}
                    >
                      {st.num}
                    </Typography>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                        fontWeight: 'bold',
                        fontSize: 18
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="primary.main" mb={1.5}>
                      {st.title}
                    </Typography>
                    <Typography color="text.secondary" lineHeight={1.6}>
                      {st.desc}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CORE FEATURES GRID */}
      <Box sx={{ py: { xs: 8, md: 14 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <Typography variant="h3" align="center" fontWeight="bold" color="primary.main" mb={2}>
              Designed for Speed &amp; Accuracy
            </Typography>
            <Typography align="center" color="text.secondary" maxWidth={600} mx="auto" mb={8}>
              Everything you need to showcase your professional qualifications cleanly
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feat, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feat.title}>
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { delay: (i % 3) * 0.1, duration: 0.5 } }
                  }}
                  whileHover={{ y: -6 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: 3.5,
                      transition: 'all 0.3s ease',
                      ':hover': {
                        boxShadow: '0 12px 30px rgba(20,0,43,0.08)',
                        borderColor: 'secondary.main'
                      }
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          bgcolor: 'rgba(61,0,102,0.08)',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2.5
                        }}
                      >
                        {feat.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" color="primary.main" mb={1}>
                        {feat.title}
                      </Typography>
                      <Typography color="text.secondary" variant="body2" lineHeight={1.6}>
                        {feat.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* TECH STRIP */}
      <Box sx={{ py: 6, bgcolor: 'background.default', borderTop: '1px solid rgba(20,0,43,0.06)' }}>
        <Container maxWidth="md">
          <Typography align="center" variant="subtitle2" color="text.secondary" textTransform="uppercase" letterSpacing={1} mb={3}>
            Built with Modern Web Technologies
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            gap={{ xs: 3, md: 6 }}
          >
            {['React 19', 'MUI v7', 'Vite 7', 'Motion', 'json-server'].map((tech) => (
              <Typography key={tech} variant="subtitle1" fontWeight={700} color="primary.main">
                {tech}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* FINAL CALL TO ACTION */}
      <Box
        sx={(theme) => ({
          py: { xs: 8, md: 14 },
          background: theme.custom.gradient,
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        })}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" fontWeight={800} mb={2.5}>
            Ready to Build Your Resume?
          </Typography>
          <Typography sx={{ opacity: 0.85, mb: 4, fontSize: '1.1rem' }}>
            Get started for free in seconds. No signup required.
          </Typography>
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
              fontSize: '1.1rem',
              boxShadow: '0 8px 24px rgba(255,123,0,0.4)'
            }}
          >
            Start Building Now
          </Button>
        </Container>
      </Box>

    </Box>
  )
}

export default LandingPage
