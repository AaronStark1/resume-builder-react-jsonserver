import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteHistoryAPI, getHistoryAPI, getAResumeAPI } from "../services/allAPIs";

const History = () => {

  const [historyData, setHistoryData] = useState([]);
  const [resumeMap, setResumeMap] = useState({});

  const loadHistory = async () => {
    try {
      const res = await getHistoryAPI();
      setHistoryData(res.data);

      // ⭐ fetch all resumes
      const resumePromises = res.data.map(item =>
        getAResumeAPI(item.resumeId)
      );

      const resumeResponses = await Promise.all(resumePromises);

      const map = {};
      resumeResponses.forEach(r => {
        map[r.data.id] = r.data;
      });

      setResumeMap(map);

    } catch (err) {
      console.log(err);
    }
  };

  const deleteHistory = async (id) => {
    try {
      await deleteHistoryAPI(id);
      loadHistory();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: "#f4f6fb", py: 6 }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Resume History
          </Typography>
          <Typography color="text.secondary">
            All previously generated resumes
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {historyData.map((item) => {

            const resume = resumeMap[item.resumeId];

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Paper
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: 3,
                    p: 2
                  }}
                >

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.formattedDate}
                    </Typography>

                    <Button
                      size="small"
                      color="error"
                      onClick={() => deleteHistory(item.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Stack>

                  {/* ⭐ Resume Preview Card */}
                  {resume && (
                    <Box>
                      <Typography fontWeight="bold">
                        {resume.personalDetails.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {resume.personalDetails.title}
                      </Typography>

                      <Typography variant="body2" mt={1}>
                        {resume.education.course}
                      </Typography>

                      <Typography variant="body2">
                        {resume.professionalDetails.company}
                      </Typography>
                    </Box>
                  )}

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