import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  IconButton,
  Chip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteHistoryAPI, getHistoryAPI, getResumesAPI } from "../services/allAPIs";

const History = () => {

  const [historyData, setHistoryData] = useState([]);
  const [resumeMap, setResumeMap] = useState({});

  const loadData = async () => {
    try {
      const historyRes = await getHistoryAPI();
      const resumesRes = await getResumesAPI();

      const map = {};
      resumesRes.data.forEach(r => map[r.id] = r);

      setResumeMap(map);
      setHistoryData(historyRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  const deleteHistory = async (id) => {
    await deleteHistoryAPI(id);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom,#f8f9fc,#eef1f6)",
        py: 6
      }}
    >
      <Container maxWidth="lg">

        {/* HEADER */}
        <Box mb={5}>
          <Typography variant="h4" fontWeight="bold">
            Resume History
          </Typography>
          <Typography color="text.secondary">
            All previously generated resumes
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">

          {historyData.map(item => {

            const resume = resumeMap[item.resumeId];

            return (
              <Grid item key={item.id}>

                <Paper
                  sx={{
                    width: 320,          // ⭐ fixed card width
                    borderRadius: 4,
                    p: 2,
                    transition: "0.3s",
                    ":hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6
                    }
                  }}
                >

                  {/* TOP BAR */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {item.formattedDate}
                    </Typography>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteHistory(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>

                  {/* A4 PREVIEW */}
                  <Box
                    sx={{
                      background: "#fff",
                      borderRadius: 3,
                      boxShadow: 3,
                      p: 2,
                      height: 450,        // ⭐ A4 feel
                      overflow: "hidden"
                    }}
                  >

                    {resume ? (
                      <>

                        <Typography align="center" fontWeight="bold">
                          {resume.personalDetails.name}
                        </Typography>

                        <Typography
                          align="center"
                          fontSize={13}
                          color="text.secondary"
                        >
                          {resume.personalDetails.title}
                        </Typography>

                        <Typography
                          align="center"
                          fontSize={11}
                          color="text.secondary"
                        >
                          {resume.contactDetails.phoneNumber} • {resume.contactDetails.email}
                        </Typography>

                        <Typography
                          align="center"
                          fontSize={11}
                          color="text.secondary"
                        >
                          {resume.personalDetails.location}
                        </Typography>

                        <Box mt={2}>
                          <Typography fontWeight="bold" fontSize={13}>
                            Summary
                          </Typography>

                          <Typography
                            fontSize={12}
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                          >
                            {resume.summary}
                          </Typography>
                        </Box>

                        <Box mt={1}>
                          <Typography fontWeight="bold" fontSize={13}>
                            Education
                          </Typography>

                          <Typography fontSize={12}>
                            {resume.education.course}
                          </Typography>

                          <Typography fontSize={11} color="text.secondary">
                            {resume.education.college}
                          </Typography>
                        </Box>

                        <Box mt={1}>
                          <Typography fontWeight="bold" fontSize={13}>
                            Experience
                          </Typography>

                          <Typography fontSize={12}>
                            {resume.professionalDetails.jobTitle}
                          </Typography>

                          <Typography fontSize={11} color="text.secondary">
                            {resume.professionalDetails.company}
                          </Typography>
                        </Box>

                        <Box mt={1}>
                          <Typography fontWeight="bold" fontSize={13}>
                            Skills
                          </Typography>

                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            gap={0.5}
                            sx={{
                              maxHeight: 60,
                              overflow: "hidden"
                            }}
                          >
                            {resume.skills.map((s, i) => (
                              <Chip key={i} label={s} size="small" />
                            ))}
                          </Stack>
                        </Box>

                      </>
                    ) : (
                      <Typography align="center" mt={15}>
                        Loading...
                      </Typography>
                    )}

                  </Box>

                </Paper>

              </Grid>
            );
          })}

        </Grid>

      </Container>
    </Box>
  );
};

export default History;