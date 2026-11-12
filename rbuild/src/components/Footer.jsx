import {
  Box,
  Typography,
  Stack,
  IconButton,
  Grid,
  Container,
  Button
} from "@mui/material"
import { Link } from "react-router-dom"
import EmailIcon from "@mui/icons-material/Email"
import GitHubIcon from "@mui/icons-material/GitHub"
import FavoriteIcon from "@mui/icons-material/Favorite"
import HomeIcon from "@mui/icons-material/Home"
import DescriptionIcon from "@mui/icons-material/Description"
import HistoryIcon from "@mui/icons-material/History"

const Footer = () => (
  <Box
    component="footer"
    sx={{
      bgcolor: "primary.dark",
      color: "white",
      pt: 6,
      pb: 3,
      mt: 0
    }}
  >
    <Container maxWidth="lg">

      <Grid container spacing={5} alignItems="flex-start">

        {/* BRAND */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            rBuild
          </Typography>

          <Typography sx={{ opacity: 0.7 }}>
            Create modern resumes that help you stand out
            and land interviews faster.
          </Typography>
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
              sx={{ color: "white", justifyContent: "flex-start", opacity: 0.8, ":hover": { opacity: 1 } }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/form"
              startIcon={<DescriptionIcon />}
              sx={{ color: "white", justifyContent: "flex-start", opacity: 0.8, ":hover": { opacity: 1 } }}
            >
              Create Resume
            </Button>
            <Button
              component={Link}
              to="/history"
              startIcon={<HistoryIcon />}
              sx={{ color: "white", justifyContent: "flex-start", opacity: 0.8, ":hover": { opacity: 1 } }}
            >
              History
            </Button>
          </Stack>
        </Grid>

        {/* CONNECT */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Connect
          </Typography>

          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon sx={{ fontSize: 20, opacity: 0.8 }} />
              <Typography sx={{ opacity: 0.8 }}>
                {/* TODO: Replace with real contact email */}
                contact@rbuild.app
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} mt={2}>
            <IconButton
              component="a"
              href="https://github.com/AaronStark1/resume-builder-react-jsonserver"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                ":hover": { bgcolor: "secondary.main" }
              }}
            >
              <GitHubIcon sx={{ color: "white" }} />
            </IconButton>
          </Stack>
        </Grid>

      </Grid>

      {/* DIVIDER */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          mt: 6,
          pt: 3,
          textAlign: "center"
        }}
      >
        <Typography sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} rBuild —
          Designed with{" "}
          <FavoriteIcon
            fontSize="small"
            sx={{ color: "secondary.main", verticalAlign: "middle" }}
          />{" "}
          using React
        </Typography>
      </Box>

    </Container>
  </Box>
)

export default Footer
