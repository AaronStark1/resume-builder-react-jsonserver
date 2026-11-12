import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'
import { motion } from 'motion/react'
import { usePageTitle } from '../utils/usePageTitle'

const PageNotFound = () => {
  usePageTitle('Page Not Found')

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        bgcolor: 'background.default',
        py: 8,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h1"
            sx={(theme) => ({
              fontSize: { xs: '6rem', md: '9rem' },
              fontWeight: 900,
              background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #c084fc 0%, #ff9100 100%)' : theme.custom.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              mb: 2,
              userSelect: 'none'
            })}
          >
            404
          </Typography>

          <Typography variant="h4" fontWeight={700} color="primary.main" mb={1.5}>
            Page Not Found
          </Typography>

          <Typography color="text.secondary" mb={4}>
            The page you are looking for doesn&apos;t exist, has been removed, or the link is broken.
          </Typography>

          <Button
            component={Link}
            to="/"
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<HomeIcon />}
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
          >
            Back to Home
          </Button>
        </motion.div>
      </Container>
    </Box>
  )
}

export default PageNotFound
