import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navBtnStyle = (path) => ({
    color: "white",
    fontWeight: 600,
    borderBottom: location.pathname === path ? "2px solid #ff7b00" : "none",
    borderRadius: 0,
    mx: 1,
    ":hover": {
      background: "rgba(255,255,255,0.08)"
    }
  });

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        background: "linear-gradient(90deg,#14002b,#3d0066)"
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* LOGO */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              letterSpacing: 1,
              mr: 4
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
            sx={{
              bgcolor: "#ff7b00",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
              ":hover": { bgcolor: "#e56a00" }
            }}
          >
            Start Now
          </Button>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;