import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  Container,
  Avatar
} from "@mui/material";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Smart Resume Builder",
    desc: "Generate professional resumes with AI powered suggestions."
  },
  {
    title: "Modern Templates",
    desc: "Beautiful recruiter-friendly designs that stand out."
  },
  {
    title: "Instant PDF Export",
    desc: "Download high quality resumes in one click."
  },
  {
    title: "Skill Optimization",
    desc: "Highlight the right skills to match job descriptions."
  },
  {
    title: "Easy Editing",
    desc: "Update resumes anytime with simple drag & edit flow."
  },
  {
    title: "Fast Hiring Results",
    desc: "Users report getting interviews faster."
  }
];

const testimonials = [
  { name: "Arjun", role: "Frontend Dev" },
  { name: "Meera", role: "Designer" },
  { name: "Rahul", role: "Backend Eng" }
];

const LandingPage = () => {
  return (
    <Box>

      {/* HERO */}
      <Box
        sx={{
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(120deg,#14002b,#3d0066)",
          color: "white"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">

            {/* LEFT */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="h2" fontWeight="bold">
                  Build a Resume <br /> That Gets You Hired 🚀
                </Typography>

                <Typography variant="h6" sx={{ opacity: 0.85 }}>
                  Create professional resumes in minutes.
                  Showcase your skills and land your dream job faster.
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Link to="/resume">
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: "#ff7b00",
                        px: 5,
                        borderRadius: 3,
                        fontWeight: "bold",
                        ":hover": { bgcolor: "#e56a00" }
                      }}
                    >
                      Create Resume
                    </Button>
                  </Link>
                  <Link to="/history">
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      borderRadius: 3,
                      ":hover": { bgcolor: "#e56a00" }
                    }}
                  >
                    View History
                  </Button>
                  </Link>
                </Stack>
              </Stack>
            </Grid>

            {/* RIGHT IMAGE */}
<Grid item xs={12} md={6}>
  <Box
    component="img"
    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
    sx={{
      width: "100%",
      borderRadius: 2,
      boxShadow: 10,
      mb: 4,          // margin-bottom
      // or pb: 4,    // padding-bottom
    }}
  />
</Grid>


          </Grid>
        </Container>
      </Box>

      {/* TRUST STRIP */}
      <Box sx={{ py: 5, bgcolor: "#fafafa" }}>
        <Container maxWidth="md">
          <Typography align="center" color="text.secondary" mb={3}>
            Trusted by job seekers from
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            flexWrap="wrap"
            spacing={3}
          >
            <Typography fontWeight="bold">Google</Typography>
            <Typography fontWeight="bold">Amazon</Typography>
            <Typography fontWeight="bold">Infosys</Typography>
            <Typography fontWeight="bold">TCS</Typography>
            <Typography fontWeight="bold">Accenture</Typography>
          </Stack>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight="bold" mb={7}>
            Everything you need to get hired
          </Typography>

          <Grid container spacing={4}>
            {features.map((f) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <Card
                  sx={{
                    height: "100%",
                    p: 2,
                    borderRadius: 4,
                    boxShadow: 3,
                    ":hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 8
                    },
                    transition: "0.3s"
                  }}
                >
                  <CardContent>
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

      {/* RESUME PREVIEW SECTION */}
      <Box sx={{ py: 10, bgcolor: "#fafafa" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">

            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                sx={{ width: "100%", borderRadius: 4, boxShadow: 6 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" mb={3}>
                Create Stunning Resumes Effortlessly
              </Typography>

              <Typography color="text.secondary" mb={3}>
                Choose from professionally designed templates,
                customize sections easily and export instantly.
              </Typography>

              <Link to="/resume">
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#3d0066",
                    borderRadius: 3,
                    px: 4
                  }}
                >
                  Start Building
                </Button>
              </Link>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* TESTIMONIALS */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight="bold" mb={7}>
            Loved by Professionals ❤️
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((t) => (
              <Grid item xs={12} md={4} key={t.name}>
                <Card sx={{ p: 4, borderRadius: 4, textAlign: "center", boxShadow: 3 }}>
                  <Avatar
                    sx={{ width: 70, height: 70, mx: "auto", mb: 2 }}
                    src={`https://i.pravatar.cc/150?u=${t.name}`}
                  />
                  <Typography fontWeight="bold">{t.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {t.role}
                  </Typography>
                  <Typography variant="body2">
                    This platform helped me create a resume that actually got recruiter attention.
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FINAL CTA */}
      <Box sx={{ py: 10, bgcolor: "#14002b", color: "white", textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold" mb={3}>
          Your Dream Job is One Resume Away
        </Typography>

        <Link to="/resume">
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#ff7b00",
              px: 6,
              borderRadius: 3,
              fontWeight: "bold"
            }}
          >
            Build Resume Now
          </Button>
        </Link>
      </Box>

    </Box>
  );
};

export default LandingPage;