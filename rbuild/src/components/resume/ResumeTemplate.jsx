import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import { normalizeResume } from '../../utils/normalizeResume'

const A4_WIDTH = 794
const A4_MIN_HEIGHT = 1123

const ResumeTemplate = ({ data, placeholders = false }) => {
  const resume = normalizeResume(data)
  const {
    template = 'classic',
    accentColor = '#3d0066',
    personalDetails,
    contactDetails,
    educationList,
    experienceList,
    skills,
    summary,
    projects = [],
    certifications = []
  } = resume

  const name = personalDetails.name || (placeholders ? 'Full Name' : '')
  const title = personalDetails.title || (placeholders ? 'Job Title / Designation' : '')
  const location = personalDetails.location || (placeholders ? 'City, Country' : '')

  const contactItems = [
    contactDetails.phoneNumber || (placeholders ? '+1 (555) 000-0000' : null),
    contactDetails.email || (placeholders ? 'email@example.com' : null),
    location || null
  ].filter(Boolean)

  const links = [
    contactDetails.github ? { label: 'GitHub', url: contactDetails.github } : null,
    contactDetails.linkedIn ? { label: 'LinkedIn', url: contactDetails.linkedIn } : null,
    contactDetails.portfolio ? { label: 'Portfolio', url: contactDetails.portfolio } : null
  ].filter(Boolean)

  // -------------------------------------------------------------
  // MODERN TEMPLATE (2 Columns: Left Accent Sidebar, Right Body)
  // -------------------------------------------------------------
  if (template === 'modern') {
    return (
      <Box
        id="resume-a4-page"
        sx={{
          width: A4_WIDTH,
          minHeight: A4_MIN_HEIGHT,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          color: '#1f2937',
          display: 'flex',
          fontFamily: '"Inter Variable", "Inter", sans-serif',
          lineHeight: 1.5,
          position: 'relative'
        }}
      >
        {/* LEFT SIDEBAR */}
        <Box
          sx={{
            width: 250,
            bgcolor: accentColor,
            color: '#ffffff',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3.5,
            flexShrink: 0
          }}
        >
          {/* Header */}
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#ffffff', lineHeight: 1.2 }}>
              {name || 'Your Name'}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.85, mt: 0.5, fontWeight: 500 }}>
              {title || 'Professional Title'}
            </Typography>
          </Box>

          {/* Contact Details */}
          {(contactItems.length > 0 || links.length > 0) && (
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: 1, textTransform: 'uppercase', opacity: 0.75, display: 'block', mb: 1.5 }}>
                Contact
              </Typography>
              <Stack spacing={1} sx={{ fontSize: 13 }}>
                {contactItems.map((item, idx) => (
                  <Typography key={idx} variant="body2" sx={{ fontSize: 12.5, opacity: 0.9 }}>
                    {item}
                  </Typography>
                ))}
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#ffffff', textDecoration: 'underline', fontSize: '12.5px', opacity: 0.95 }}
                  >
                    {link.label}
                  </a>
                ))}
              </Stack>
            </Box>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: 1, textTransform: 'uppercase', opacity: 0.75, display: 'block', mb: 1.5 }}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {skills.map((s, i) => (
                  <Box
                    key={i}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.18)',
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 1,
                      fontSize: 11.5,
                      fontWeight: 500
                    }}
                  >
                    {s}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Education in sidebar for modern layout */}
          {educationList.length > 0 && (
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: 1, textTransform: 'uppercase', opacity: 0.75, display: 'block', mb: 1.5 }}>
                Education
              </Typography>
              <Stack spacing={2}>
                {educationList.map((ed, idx) => (
                  <Box key={idx}>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                      {ed.course}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
                      {ed.college}{ed.university ? `, ${ed.university}` : ''}
                    </Typography>
                    {ed.year && (
                      <Typography variant="caption" sx={{ opacity: 0.75, display: 'block' }}>
                        {ed.year}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* RIGHT MAIN BODY */}
        <Box sx={{ flex: 1, p: 4.5, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Summary */}
          {(summary || placeholders) && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: accentColor, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5 }}>
                Summary
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {summary || 'Add your professional summary here.'}
              </Typography>
            </Box>
          )}

          {/* Work Experience */}
          {experienceList.length > 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: accentColor, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5 }}>
                Experience
              </Typography>
              <Stack spacing={2.5}>
                {experienceList.map((exp, idx) => (
                  <Box key={idx}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography variant="body1" fontWeight={700} color="#111827">
                        {exp.jobTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {exp.duration}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>
                      {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                    </Typography>
                    {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                      <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '13px', color: '#4b5563' }}>
                        {exp.bullets.map((b, i) => (
                          <li key={i} style={{ marginBottom: 3 }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: accentColor, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5 }}>
                Projects
              </Typography>
              <Stack spacing={2}>
                {projects.map((proj, idx) => (
                  <Box key={idx}>
                    <Typography variant="body2" fontWeight={700} color="#111827">
                      {proj.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {proj.description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: accentColor, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5 }}>
                Certifications
              </Typography>
              <Stack spacing={1}>
                {certifications.map((cert, idx) => (
                  <Typography key={idx} variant="body2" color="#374151">
                    <strong>{cert.name}</strong> — {cert.issuer} {cert.year ? `(${cert.year})` : ''}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  // -------------------------------------------------------------
  // MINIMAL TEMPLATE (Clean, Left-aligned, Elegant Whitespace)
  // -------------------------------------------------------------
  if (template === 'minimal') {
    return (
      <Box
        id="resume-a4-page"
        sx={{
          width: A4_WIDTH,
          minHeight: A4_MIN_HEIGHT,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          color: '#111827',
          p: 6,
          fontFamily: '"Inter Variable", "Inter", sans-serif',
          lineHeight: 1.6,
          position: 'relative'
        }}
      >
        {/* HEADER */}
        <Box sx={{ borderBottom: `1px solid ${accentColor}`, pb: 3, mb: 3 }}>
          <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.02em', color: '#111827' }}>
            {name || 'Full Name'}
          </Typography>
          <Typography variant="h6" fontWeight={500} sx={{ color: accentColor, mt: 0.5 }}>
            {title || 'Professional Title'}
          </Typography>

          {contactItems.length > 0 && (
            <Typography variant="body2" color="text.secondary" mt={1.5}>
              {contactItems.join('   |   ')}
            </Typography>
          )}

          {links.length > 0 && (
            <Typography variant="body2" mt={0.5}>
              {links.map((link, idx) => (
                <span key={link.label}>
                  <a
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: accentColor, textDecoration: 'none' }}
                  >
                    {link.label}
                  </a>
                  {idx < links.length - 1 ? '   |   ' : ''}
                </span>
              ))}
            </Typography>
          )}
        </Box>

        {/* SUMMARY */}
        {(summary || placeholders) && (
          <Box sx={{ mb: 3.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, color: accentColor, mb: 1 }}>
              About
            </Typography>
            <Typography variant="body2" sx={{ color: '#374151', whiteSpace: 'pre-wrap' }}>
              {summary || 'Add your professional summary here.'}
            </Typography>
          </Box>
        )}

        {/* EXPERIENCE */}
        {experienceList.length > 0 && (
          <Box sx={{ mb: 3.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, color: accentColor, mb: 1.5 }}>
              Experience
            </Typography>
            <Stack spacing={2.5}>
              {experienceList.map((exp, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="body1" fontWeight={700} color="#111827">
                      {exp.jobTitle} — <span style={{ fontWeight: 500, color: '#4b5563' }}>{exp.company}</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {exp.duration}
                    </Typography>
                  </Box>
                  {exp.location && (
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                      {exp.location}
                    </Typography>
                  )}
                  {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                    <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '13px', color: '#374151' }}>
                      {exp.bullets.map((b, i) => (
                        <li key={i} style={{ marginBottom: 3 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* EDUCATION */}
        {educationList.length > 0 && (
          <Box sx={{ mb: 3.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, color: accentColor, mb: 1.5 }}>
              Education
            </Typography>
            <Stack spacing={2}>
              {educationList.map((ed, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={700} color="#111827">
                      {ed.course}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {[ed.college, ed.university].filter(Boolean).join(' • ')}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {ed.year}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <Box sx={{ mb: 3.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, color: accentColor, mb: 1 }}>
              Core Skills
            </Typography>
            <Typography variant="body2" color="#374151">
              {skills.join('  •  ')}
            </Typography>
          </Box>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <Box sx={{ mb: 3.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, color: accentColor, mb: 1.5 }}>
              Projects
            </Typography>
            <Stack spacing={1.5}>
              {projects.map((proj, idx) => (
                <Box key={idx}>
                  <Typography variant="body2" fontWeight={700} color="#111827">
                    {proj.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {proj.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, color: accentColor, mb: 1 }}>
              Certifications
            </Typography>
            <Stack spacing={0.8}>
              {certifications.map((cert, idx) => (
                <Typography key={idx} variant="body2" color="#374151">
                  <strong>{cert.name}</strong> — {cert.issuer} {cert.year ? `(${cert.year})` : ''}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    )
  }

  // -------------------------------------------------------------
  // CLASSIC TEMPLATE (Default: Centered Header, Clean Sections)
  // -------------------------------------------------------------
  return (
    <Box
      id="resume-a4-page"
      sx={{
        width: A4_WIDTH,
        minHeight: A4_MIN_HEIGHT,
        boxSizing: 'border-box',
        bgcolor: '#ffffff',
        color: '#111827',
        p: { xs: 4, sm: 5, md: 6 },
        fontFamily: '"Inter Variable", "Inter", sans-serif',
        lineHeight: 1.5,
        position: 'relative'
      }}
    >
      {/* HEADER */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h3" fontWeight={800} sx={{ color: '#111827', letterSpacing: '-0.02em' }}>
          {name || 'Full Name'}
        </Typography>

        <Typography variant="h6" color={accentColor} fontWeight={600} sx={{ mt: 0.5 }}>
          {title || 'Professional Title'}
        </Typography>

        {contactItems.length > 0 && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {contactItems.join(' • ')}
          </Typography>
        )}

        {links.length > 0 && (
          <Typography variant="body2" mt={0.5}>
            {links.map((link, idx) => (
              <span key={link.label}>
                <a
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: accentColor, textDecoration: 'none' }}
                >
                  {link.label}
                </a>
                {idx < links.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </Typography>
        )}
      </Box>

      {/* SUMMARY */}
      {(summary || placeholders) && (
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="subtitle1" fontWeight={700} color={accentColor} sx={{ borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Professional Summary
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {summary || 'Add your professional summary here.'}
          </Typography>
        </Box>
      )}

      {/* EXPERIENCE */}
      {experienceList.length > 0 && (
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="subtitle1" fontWeight={700} color={accentColor} sx={{ borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Professional Experience
          </Typography>
          <Stack spacing={2.5}>
            {experienceList.map((exp, idx) => (
              <Box key={idx}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Typography variant="body1" fontWeight={700} color="#111827">
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {exp.duration}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>
                  {[exp.company, exp.location].filter(Boolean).join(' • ')}
                </Typography>
                {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                  <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '13px', color: '#4b5563' }}>
                    {exp.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: 3 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* EDUCATION */}
      {educationList.length > 0 && (
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="subtitle1" fontWeight={700} color={accentColor} sx={{ borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Education
          </Typography>
          <Stack spacing={2}>
            {educationList.map((ed, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Box>
                  <Typography variant="body1" fontWeight={700} color="#111827">
                    {ed.course}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[ed.college, ed.university].filter(Boolean).join(' • ')}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {ed.year}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="subtitle1" fontWeight={700} color={accentColor} sx={{ borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Skills
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {skills.map((item, i) => (
              <Chip
                key={i}
                label={item}
                size="small"
                sx={{
                  bgcolor: '#f3f4f6',
                  color: '#1f2937',
                  fontWeight: 500,
                  fontSize: 12.5
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="subtitle1" fontWeight={700} color={accentColor} sx={{ borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Projects
          </Typography>
          <Stack spacing={1.5}>
            {projects.map((proj, idx) => (
              <Box key={idx}>
                <Typography variant="body2" fontWeight={700} color="#111827">
                  {proj.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {proj.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color={accentColor} sx={{ borderBottom: `2px solid ${accentColor}`, pb: 0.5, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Certifications
          </Typography>
          <Stack spacing={0.8}>
            {certifications.map((cert, idx) => (
              <Typography key={idx} variant="body2" color="#374151">
                <strong>{cert.name}</strong> — {cert.issuer} {cert.year ? `(${cert.year})` : ''}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default ResumeTemplate

