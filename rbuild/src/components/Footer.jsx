import {
  Box,
  Typography,
  Stack,
  IconButton,
  Grid,
  Container,
  Button
} from '@mui/material'
import { Link } from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HomeIcon from '@mui/icons-material/Home'
import DescriptionIcon from '@mui/icons-material/Description'
import HistoryIcon from '@mui/icons-material/History'

const Footer = () => (
  <Box
    component="footer"
    sx={(theme) => ({
      bgcolor: theme.palette.mode === 'dark' ? '#080310' : 'primary.dark',
      color: 'white',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      pt: 6,
      pb: 3,
      mt: 0
    })}
  >
    <Container maxWidth="lg">
      <Grid container spacing={5} alignItems="flex-start" justifyContent="space-between">

        {/* BRAND & SOCIAL */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            rBuild
          </Typography>

          <Typography sx={{ opacity: 0.75, maxWidth: 440, mb: 3, lineHeight: 1.6 }}>
            Create professional, modern resumes that help you stand out and land interviews faster.
            Fully responsive, customizable, and ATS-friendly.
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <IconButton
              component="a"
              href="https://github.com/AaronStark1/resume-builder-react-jsonserver"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              sx={{
                bgcolor: 'rgba(255,255,255,0.08)',
                color: 'white',
                transition: 'all 0.2s',
                ':hover': {
                  bgcolor: 'secondary.main',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Stack>
        </Grid>

        {/* QUICK LINKS */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Quick Links
          </Typography>

          <Stack spacing={1.5}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              sx={{
                color: 'white',
                justifyContent: 'flex-start',
                opacity: 0.8,
                ':hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.06)' }
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/form"
              startIcon={<DescriptionIcon />}
              sx={{
                color: 'white',
                justifyContent: 'flex-start',
                opacity: 0.8,
                ':hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.06)' }
              }}
            >
              Create Resume
            </Button>
            <Button
              component={Link}
              to="/history"
              startIcon={<HistoryIcon />}
              sx={{
                color: 'white',
                justifyContent: 'flex-start',
                opacity: 0.8,
                ':hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.06)' }
              }}
            >
              History
            </Button>
          </Stack>
        </Grid>

      </Grid>

      {/* DIVIDER & COPYRIGHT */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          mt: 5,
          pt: 3,
          textAlign: 'center'
        }}
      >
        <Typography sx={{ opacity: 0.7, fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} rBuild — Designed with{' '}
          <FavoriteIcon
            fontSize="small"
            sx={{ color: 'secondary.main', verticalAlign: 'middle', mx: 0.3 }}
          />{' '}
          using React
        </Typography>
      </Box>
    </Container>
  </Box>
)

export default Footer
