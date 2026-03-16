import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Grid
} from "@mui/material";
import { Link } from "react-router-dom";

const ResumeGeneratorPage = () => {
  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(120deg,#14002b,#3d0066)",
        color: "white",
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">

          {/* LEFT CONTENT */}
          <Grid item xs={12} md={6}>
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
                <Typography>✔ Guided step-by-step form</Typography>
                <Typography>✔ Modern recruiter-approved templates</Typography>
                <Typography>✔ Instant PDF download</Typography>
                <Typography>✔ Edit anytime & update easily</Typography>
              </Stack>

              <Box>
                <Link to="/form">
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "#ff7b00",
                      px: 6,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: "bold",
                      ":hover": { bgcolor: "#e56a00" }
                    }}
                  >
                    Start Building Resume
                  </Button>
                </Link>
              </Box>

            </Stack>
          </Grid>

          {/* RIGHT IMAGE */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://img.freepik.com/free-photo/resume-new-business-launch-plan-concept_53876-124948.jpg?semt=ais_hybrid&w=740&q=80"
              alt="resume builder"
              sx={{
                width: "100%",
                borderRadius: 4,
                boxShadow: 10
              }}
            />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default ResumeGeneratorPage;