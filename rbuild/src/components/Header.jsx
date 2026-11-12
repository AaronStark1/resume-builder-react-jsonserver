import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { Link, useLocation } from 'react-router-dom'

import { useColorMode } from '../context/useColorMode'
import ThemeToggleIcon from './ThemeToggleIcon'

const Header = () => {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { mode, toggleColorMode, prepareColorModeToggle } = useColorMode()
  const themeLabel = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  // Intent to toggle: lets the ink snapshot the page before the click lands.
  const themeToggleProps = {
    onClick: toggleColorMode,
    onPointerEnter: prepareColorModeToggle,
    onPointerDown: prepareColorModeToggle,
    onFocus: prepareColorModeToggle,
  }

  const isActive = (path) => {
    if (path === '/resume') {
      return location.pathname === '/resume' || location.pathname === '/form'
    }
    return location.pathname === path
  }

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Create Resume', path: '/resume' },
    { label: 'History', path: '/history' },
  ]

  const navBtnStyle = (path) => ({
    color: 'white',
    fontWeight: 600,
    fontSize: '0.95rem',
    borderBottom: isActive(path) ? '2px solid' : '2px solid transparent',
    borderBottomColor: isActive(path) ? 'secondary.main' : 'transparent',
    borderRadius: 0,
    mx: 1.5,
    px: 1,
    py: 1,
    transition: '0.2s',
    ':hover': {
      background: 'rgba(255,255,255,0.08)',
      borderBottomColor: isActive(path) ? 'secondary.main' : 'rgba(255,255,255,0.3)',
    },
  })

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={(theme) => ({
        background: theme.palette.mode === 'dark' ? 'rgba(12, 7, 20, 0.92)' : 'rgba(20, 0, 43, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>

          {/* BRAND LOGO (Monogram + Wordmark) */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              mr: 4,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: 'secondary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 18,
                mr: 1.5,
                boxShadow: '0 2px 8px rgba(255,123,0,0.4)',
              }}
            >
              rB
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #ffffff, #f0e6ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              rBuild
            </Typography>
          </Box>

          {/* DESKTOP NAVIGATION */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={navBtnStyle(link.path)}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* DESKTOP THEME TOGGLE & CTA */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Tooltip title={themeLabel}>
              <IconButton
                {...themeToggleProps}
                aria-label={themeLabel}
                sx={{
                  color: mode === 'dark' ? 'secondary.main' : 'rgba(255,255,255,0.9)',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  p: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.18)',
                    transform: 'rotate(15deg)',
                  },
                }}
              >
                <ThemeToggleIcon mode={mode} />
              </IconButton>
            </Tooltip>

            <Button
              component={Link}
              to="/form"
              variant="contained"
              color="secondary"
              sx={{
                fontWeight: 'bold',
                borderRadius: 2.5,
                px: 3,
                py: 1,
                boxShadow: '0 4px 14px rgba(255,123,0,0.3)',
                ':hover': {
                  bgcolor: 'secondary.dark',
                  transform: 'translateY(-1px)',
                },
                transition: '0.2s',
              }}
            >
              Start Building
            </Button>
          </Box>

          {/* MOBILE THEME TOGGLE & HAMBURGER */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto', alignItems: 'center', gap: 1 }}>
            <IconButton
              {...themeToggleProps}
              aria-label={themeLabel}
              sx={{
                color: mode === 'dark' ? 'secondary.main' : 'rgba(255,255,255,0.9)',
                bgcolor: 'rgba(255,255,255,0.08)',
                p: 0.8,
              }}
            >
              <ThemeToggleIcon mode={mode} />
            </IconButton>

            <IconButton
              color="inherit"
              aria-label="Open mobile menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              edge="end"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>

        </Toolbar>
      </Container>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: (theme) => ({
            width: 270,
            bgcolor: theme.palette.mode === 'dark' ? '#140c22' : 'primary.dark',
            color: 'white',
            p: 3,
            pt: 11, // start below the app bar, which sits above the drawer (zIndex drawer + 1)
          }),
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            size="small"
            {...themeToggleProps}
            startIcon={<ThemeToggleIcon mode={mode} size={18} />}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.08)',
              px: 1.5,
              py: 0.5,
              fontSize: '0.8rem',
              ':hover': { bgcolor: 'rgba(255,255,255,0.15)' }
            }}
          >
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>

          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{ color: 'white' }}
            aria-label="Close menu"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive(link.path) ? 'rgba(255,123,0,0.18)' : 'transparent',
                  color: isActive(link.path) ? 'secondary.main' : 'white',
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontWeight: isActive(link.path) ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/form"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => setMobileOpen(false)}
            sx={{ py: 1.2, fontWeight: 'bold' }}
          >
            Start Building
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  )
}

export default Header
