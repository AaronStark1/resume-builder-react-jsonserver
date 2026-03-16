import React from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Grid,
  Container
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      bgcolor: "#14002b",
      color: "white",
      pt: 2,
      pb: 2,
      mt: 0
    }}
  >
    <Container maxWidth="lg">

      <Grid container spacing={5} alignItems="flex-start">

        {/* BRAND */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            ResumeBuilder
          </Typography>

          <Typography sx={{ opacity: 0.7 }}>
            Create modern resumes that help you stand out
            and land interviews faster.
          </Typography>
        </Grid>

        {/* CONTACT */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Contact
          </Typography>

          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ opacity: 0.8 }}>
                rbuilder@gmail.com
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ opacity: 0.8 }}>
                +91 98989 89898
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        {/* SOCIAL */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Follow Us
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                ":hover": { bgcolor: "#ff7b00" }
              }}
            >
              <WhatsAppIcon sx={{ color: "white" }} />
            </IconButton>

            <IconButton
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                ":hover": { bgcolor: "#ff7b00" }
              }}
            >
              <InstagramIcon sx={{ color: "white" }} />
            </IconButton>

            <IconButton
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                ":hover": { bgcolor: "#ff7b00" }
              }}
            >
              <LinkedInIcon sx={{ color: "white" }} />
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
            sx={{ color: "#ff7b00", verticalAlign: "middle" }}
          />{" "}
          using React
        </Typography>
      </Box>

    </Container>
  </Box>
);

export default Footer;