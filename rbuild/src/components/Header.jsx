import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from "@mui/material"
import { Link, useLocation } from "react-router-dom"

const Header = () => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/resume') {
      return location.pathname === '/resume' || location.pathname === '/form'
    }
    return location.pathname === path
  }

  const navBtnStyle = (path) => ({
    color: "white",
    fontWeight: 600,
    borderBottom: isActive(path) ? "2px solid" : "none",
    borderBottomColor: isActive(path) ? "secondary.main" : "transparent",
    borderRadius: 0,
    mx: 1,
    ":hover": {
      background: "rgba(255,255,255,0.08)"
    }
  })

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={(theme) => ({
        background: theme.custom.gradient,
        backdropFilter: "blur(12px)",
      })}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* LOGO */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              letterSpacing: 1,
              mr: 4,
              color: "white",
              textDecoration: "none",
            }}
          >
            rBuild
          </Typography>

          {/* NAVIGATION */}
          <Box sx={{ flexGrow: 1 }}>
            <Button
              component={Link}
              to="/"
              sx={navBtnStyle("/")}
            >
              Home
            </Button>

            <Button
              component={Link}
              to="/resume"
              sx={navBtnStyle("/resume")}
            >
              Create Resume
            </Button>

            <Button
              component={Link}
              to="/history"
              sx={navBtnStyle("/history")}
            >
              History
            </Button>
          </Box>

          {/* RIGHT CTA */}
          <Button
            component={Link}
            to="/resume"
            variant="contained"
            color="secondary"
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
            }}
          >
            Start Now
          </Button>

        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
