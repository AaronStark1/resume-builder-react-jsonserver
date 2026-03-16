import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  TextField,
  Divider,
  Chip
} from "@mui/material";
import { getAResumeAPI, updateAResumeAPI } from "../services/allAPIs";
import Swal from "sweetalert2";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", md: 820 },
  maxHeight: "90vh",
  overflow: "hidden",
  bgcolor: "#fff",
  borderRadius: 4,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column"
};

const Edit = ({ resumeId, onUpdate }) => {
  const [open, setOpen] = useState(false);

  const [resumeData, setResumeData] = useState({
    personalDetails: { name: "", title: "", location: "" },
    contactDetails: { email: "", phoneNumber: "", github: "", linkedIn: "", portfolio: "" },
    education: { course: "", college: "", university: "", year: "" },
    professionalDetails: { jobTitle: "", company: "", location: "", duration: "" },
    skills: [],
    summary: ""
  });

  const [inputSkill, setInputSkill] = useState("");

  const getResumeDetailsById = async (id) => {
    const response = await getAResumeAPI(id);
    setResumeData(response.data);
  };

  useEffect(() => {
    if (resumeId) getResumeDetailsById(resumeId);
  }, [resumeId]);

  const addSkill = () => {
    if (!inputSkill) return;
    if (resumeData.skills.includes(inputSkill)) return;
    setResumeData({ ...resumeData, skills: [...resumeData.skills, inputSkill] });
    setInputSkill("");
  };

  const removeSkill = (skill) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((s) => s !== skill)
    });
  };

  const handleUpdate = async () => {
    const response = await updateAResumeAPI(resumeId, resumeData);
    onUpdate(response.data);
    setOpen(false);

    Swal.fire({
      title: "Updated",
      text: "Resume updated successfully",
      icon: "success"
    });
  };

  const Section = ({ title, children }) => (
    <Box sx={{ mb: 4 }}>
      <Typography fontWeight="bold" mb={2}>
        {title}
      </Typography>
      <Stack spacing={2}>{children}</Stack>
    </Box>
  );

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)} disabled={!resumeId}>
        Edit
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>

          {/* HEADER */}
          <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
            <Typography variant="h6" fontWeight="bold">
              Edit Resume
            </Typography>
          </Box>

          {/* SCROLL BODY */}
          <Box sx={{ p: 3, overflowY: "auto" }}>

            <Section title="Personal Details">
              <TextField
                label="Full Name"
                value={resumeData.personalDetails.name}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalDetails: { ...resumeData.personalDetails, name: e.target.value }
                  })
                }
                fullWidth
              />
              <TextField
                label="Title"
                value={resumeData.personalDetails.title}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalDetails: { ...resumeData.personalDetails, title: e.target.value }
                  })
                }
                fullWidth
              />
              <TextField
                label="Location"
                value={resumeData.personalDetails.location}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalDetails: { ...resumeData.personalDetails, location: e.target.value }
                  })
                }
                fullWidth
              />
            </Section>

            <Divider />

            <Section title="Contact">
              <TextField label="Email" value={resumeData.contactDetails.email}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    contactDetails: { ...resumeData.contactDetails, email: e.target.value }
                  })
                } fullWidth />

              <TextField label="Phone" value={resumeData.contactDetails.phoneNumber}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    contactDetails: { ...resumeData.contactDetails, phoneNumber: e.target.value }
                  })
                } fullWidth />

              <TextField label="GitHub" value={resumeData.contactDetails.github}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    contactDetails: { ...resumeData.contactDetails, github: e.target.value }
                  })
                } fullWidth />

              <TextField label="LinkedIn" value={resumeData.contactDetails.linkedIn}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    contactDetails: { ...resumeData.contactDetails, linkedIn: e.target.value }
                  })
                } fullWidth />
            </Section>

            <Divider />

            <Section title="Education">
              <TextField label="Course" value={resumeData.education.course}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    education: { ...resumeData.education, course: e.target.value }
                  })
                } fullWidth />
              <TextField label="College" value={resumeData.education.college}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    education: { ...resumeData.education, college: e.target.value }
                  })
                } fullWidth />
            </Section>

            <Divider />

            <Section title="Skills">
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Add Skill"
                  value={inputSkill}
                  onChange={(e) => setInputSkill(e.target.value)}
                  fullWidth
                />
                <Button onClick={addSkill}>Add</Button>
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={1}>
                {resumeData.skills.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    onDelete={() => removeSkill(s)}
                    color="primary"
                  />
                ))}
              </Stack>
            </Section>

            <Divider />

            <Section title="Summary">
              <TextField
                multiline
                rows={4}
                value={resumeData.summary}
                onChange={(e) =>
                  setResumeData({ ...resumeData, summary: e.target.value })
                }
                fullWidth
              />
            </Section>

          </Box>

          {/* FOOTER */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "flex-end",
              gap: 2
            }}
          >
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Box>

        </Box>
      </Modal>
    </>
  );
};

export default Edit;