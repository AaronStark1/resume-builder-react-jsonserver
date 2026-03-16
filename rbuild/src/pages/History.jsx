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
import { deleteHistoryAPI, getHistoryAPI } from "../services/allAPIs";

const History = () => {
  const [historyData, setHistoryData] = useState([]);

  const loadHistory = async () => {
    try {
      const res = await getHistoryAPI();
      setHistoryData(res.data);
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f4f6fb",
        py: 6
      }}
    >
      <Container maxWidth="xl">

        {/* PAGE HEADER */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Resume History
          </Typography>
          <Typography color="text.secondary">
            All previously generated resumes
          </Typography>
        </Box>

        {/* EMPTY STATE */}
        {historyData.length === 0 && (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
            <Typography variant="h6">No history available</Typography>
            <Typography color="text.secondary">
              Downloaded resumes will appear here
            </Typography>
          </Paper>
        )}

        {/* HISTORY GRID */}
        <Grid container spacing={4}>
          {historyData.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Paper
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* CARD HEADER */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ px: 2, py: 1.5, borderBottom: "1px solid #eee" }}
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

                {/* PREVIEW */}
                <Box
                  component="img"
                  src={item.imgData}
                  alt="resume"
                  sx={{
                    width: "100%",
                    height: 360,
                    objectFit: "cover",
                    background: "#fff"
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
};

export default History;