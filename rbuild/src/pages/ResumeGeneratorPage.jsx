import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Grid
} from "@mui/material"
import { Link } from "react-router-dom"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

const ResumeGeneratorPage = () => {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: theme.custom.gradient,
        color: "white",
        py: 8,
      })}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">

          {/* LEFT CONTENT */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>

              <Typography variant="h2" fontWeight="bold">
                Create Your Professional Resume
              </Typography>

              <Typography variant="h6" sx={{ opacity: 0.85 }}>
                Build a job-winning resume in minutes using our
                smart resume generator. Highlight your strengths,
                organize your experience and stand out to recruiters.
              </Typography>

              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="secondary" />
                  <Typography>Guided step-by-step form</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="secondary" />
                  <Typography>Live resume preview</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="secondary" />
                  <Typography>Instant PDF download</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="secondary" />
                  <Typography>Edit anytime &amp; update easily</Typography>
                </Stack>
              </Stack>

              <Box>
                <Button
                  component={Link}
                  to="/form"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "bold",
                  }}
                >
                  Start Building Resume
                </Button>
              </Box>

            </Stack>
          </Grid>

          {/* RIGHT IMAGE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=75"
              alt="Professional resume on a desk"
              loading="lazy"
              width={600}
              height={400}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 4,
                boxShadow: '0 4px 24px rgba(20,0,43,0.3)',
              }}
            />
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default ResumeGeneratorPage
