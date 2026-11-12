import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  Container,
} from "@mui/material"
import { Link } from "react-router-dom"
import DescriptionIcon from "@mui/icons-material/Description"
import PreviewIcon from "@mui/icons-material/Preview"
import DownloadIcon from "@mui/icons-material/Download"
import EditIcon from "@mui/icons-material/Edit"
import HistoryIcon from "@mui/icons-material/History"
import SaveIcon from "@mui/icons-material/Save"

const features = [
  {
    title: "Guided Step Form",
    desc: "Create your resume with an easy step-by-step guided form.",
    icon: <DescriptionIcon />,
  },
  {
    title: "Live Preview",
    desc: "See your resume update in real time as you type.",
    icon: <PreviewIcon />,
  },
  {
    title: "Instant PDF Export",
    desc: "Download high quality resumes in one click.",
    icon: <DownloadIcon />,
  },
  {
    title: "Easy Editing",
    desc: "Update your resume anytime with a simple modal editor.",
    icon: <EditIcon />,
  },
  {
    title: "Resume History",
    desc: "Track all your previously generated resumes.",
    icon: <HistoryIcon />,
  },
  {
    title: "Autosave Drafts",
    desc: "Never lose your progress — drafts are saved automatically.",
    icon: <SaveIcon />,
  },
]

const LandingPage = () => {
  return (
    <Box>

      {/* HERO */}
      <Box
        sx={(theme) => ({
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          background: theme.custom.gradient,
          color: "white",
        })}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">

            {/* LEFT */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Typography variant="h2" fontWeight="bold">
                  Build a Resume <br /> That Gets You Hired 🚀
                </Typography>

                <Typography variant="h6" sx={{ opacity: 0.85 }}>
                  Create professional resumes in minutes.
                  Showcase your skills and land your dream job faster.
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button
                    component={Link}
                    to="/resume"
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                      px: 5,
                      borderRadius: 3,
                      fontWeight: "bold",
                    }}
                  >
                    Create Resume
                  </Button>
                  <Button
                    component={Link}
                    to="/history"
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      borderRadius: 3,
                      ":hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "white" }
                    }}
                  >
                    View History
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            {/* RIGHT — placeholder for animated resume in Phase 5 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=75"
                alt="Person working on a resume at a desk"
                loading="lazy"
                width={600}
                height={400}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: '0 4px 24px rgba(20,0,43,0.3)',
                  mb: 4,
                }}
              />
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: "background.default" }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" fontWeight="bold" mb={2}>
            How It Works
          </Typography>
          <Typography align="center" color="text.secondary" mb={6}>
            Three simple steps to your perfect resume
          </Typography>

          <Grid container spacing={4}>
            {[
              { step: "1", title: "Fill", desc: "Enter your details in a guided step-by-step form." },
              { step: "2", title: "Preview", desc: "See a live preview update as you type." },
              { step: "3", title: "Download", desc: "Export your resume as a professional PDF." },
            ].map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.step}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      fontSize: 24,
                      fontWeight: 800,
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" mb={1}>{item.title}</Typography>
                  <Typography color="text.secondary">{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box sx={{ py: { xs: 8, md: 14 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight="bold" mb={7}>
            Everything you need to get hired
          </Typography>

          <Grid container spacing={4}>
            {features.map((f) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
                <Card
                  sx={{
                    height: "100%",
                    p: 2,
                    transition: "0.3s",
                    ":hover": {
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {f.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {f.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* TECH STRIP */}
      <Box sx={{ py: 5, bgcolor: "background.default" }}>
        <Container maxWidth="md">
          <Typography align="center" color="text.secondary" mb={3}>
            Built with
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            flexWrap="wrap"
            gap={3}
          >
            <Typography fontWeight="bold">React 19</Typography>
            <Typography fontWeight="bold">MUI v7</Typography>
            <Typography fontWeight="bold">Vite</Typography>
            <Typography fontWeight="bold">json-server</Typography>
          </Stack>
        </Container>
      </Box>

      {/* FINAL CTA */}
      <Box
        sx={(theme) => ({
          py: { xs: 8, md: 14 },
          background: theme.custom.gradient,
          color: "white",
          textAlign: "center",
        })}
      >
        <Typography variant="h3" fontWeight="bold" mb={3}>
          Your Dream Job is One Resume Away
        </Typography>

        <Button
          component={Link}
          to="/resume"
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            px: 6,
            borderRadius: 3,
            fontWeight: "bold",
          }}
        >
          Build Resume Now
        </Button>
      </Box>

    </Box>
  )
}

export default LandingPage
