import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'

const calculateResumeScore = (resume = {}) => {
  let score = 0
  const tips = []

  // 1. Personal Details (20 pts)
  if (resume.personalDetails?.name?.trim()) {
    score += 10
  } else {
    tips.push('Add your full name')
  }

  if (resume.personalDetails?.title?.trim()) {
    score += 10
  } else {
    tips.push('Add your professional job title or target role')
  }

  // 2. Contact Details (15 pts)
  if (resume.contactDetails?.email?.trim()) {
    score += 10
  } else {
    tips.push('Add an email address')
  }

  if (resume.contactDetails?.phoneNumber?.trim()) {
    score += 5
  } else {
    tips.push('Include a contact phone number')
  }

  // 3. Education (15 pts)
  const hasEd =
    Boolean(resume.education?.course?.trim()) ||
    (Array.isArray(resume.educationList) &&
      resume.educationList.some((e) => e.course?.trim()))

  if (hasEd) {
    score += 15
  } else {
    tips.push('Add your degree or education credentials')
  }

  // 4. Experience & Bullets (20 pts)
  const experiences = Array.isArray(resume.experienceList) && resume.experienceList.length > 0
    ? resume.experienceList
    : (resume.professionalDetails?.jobTitle ? [resume.professionalDetails] : [])

  if (experiences.length > 0) {
    score += 10
    const hasBullets = experiences.some(
      (exp) => Array.isArray(exp.bullets) && exp.bullets.length > 0
    )
    if (hasBullets) {
      score += 10
    } else {
      tips.push('Add bullet points highlighting specific achievements in your experience')
    }
  } else {
    tips.push('Add your work experience or internship details')
  }

  // 5. Skills (15 pts)
  const skillsCount = Array.isArray(resume.skills) ? resume.skills.length : 0
  if (skillsCount >= 5) {
    score += 15
  } else if (skillsCount >= 1) {
    score += 8
    tips.push(`Add ${5 - skillsCount} more skills to reach the recommended 5+ skills`)
  } else {
    tips.push('Add at least 5 core technical or soft skills')
  }

  // 6. Professional Summary (15 pts)
  const summaryLength = (resume.summary || '').trim().length
  if (summaryLength >= 150) {
    score += 15
  } else if (summaryLength > 0) {
    score += 7
    tips.push('Expand your summary to at least 150 characters for better impact')
  } else {
    tips.push('Write a professional summary outlining your background and goals')
  }

  return {
    score: Math.min(score, 100),
    tips: tips.slice(0, 3), // Show top 3 actionable tips
  }
}

const ResumeScore = ({ data }) => {
  const { score, tips } = calculateResumeScore(data)

  const getScoreColor = (val) => {
    if (val >= 80) return 'success.main'
    if (val >= 50) return 'secondary.main'
    return 'error.main'
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: '#ffffff',
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: tips.length > 0 ? 2 : 0 }}>
        {/* CIRCULAR PROGRESS */}
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={score}
            size={56}
            thickness={5}
            sx={{ color: getScoreColor(score) }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" fontWeight={800} color="text.primary">
              {score}%
            </Typography>
          </Box>
        </Box>

        {/* SCORE LABEL */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color="primary.main">
            Resume Completeness Score
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {score >= 80
              ? 'Great job! Your resume covers all core sections.'
              : score >= 50
              ? 'Good progress. Follow the tips below to strengthen it.'
              : 'Add more details to increase recruiter interest.'}
          </Typography>
        </Box>
      </Box>

      {/* ACTIONABLE TIPS */}
      {tips.length > 0 && (
        <Stack spacing={1} sx={{ mt: 1, pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LightbulbIcon fontSize="inherit" color="secondary" /> Actionable Tips:
          </Typography>
          {tips.map((tip, idx) => (
            <Typography key={idx} variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
              <span style={{ color: '#ff7b00', fontWeight: 'bold' }}>•</span> {tip}
            </Typography>
          ))}
        </Stack>
      )}

      {score === 100 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, color: 'success.main' }}>
          <CheckCircleIcon fontSize="small" />
          <Typography variant="caption" fontWeight={700}>
            All recommended resume sections are complete!
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default ResumeScore
