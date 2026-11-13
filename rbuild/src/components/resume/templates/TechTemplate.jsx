import Box from '@mui/material/Box'

import Bullets from './Bullets'
import { FONT_MONO, FONT_SANS, groupSkills, hrefOf, pageSx, stackFor } from './helpers'

const INK = '#0f172a'
const BODY = '#334155'
const MUTED = '#64748b'

const SectionTitle = ({ accentColor, children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '11px' }}>
    <Box
      component="h2"
      sx={{
        m: 0,
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '0.14em',
        lineHeight: 1.4,
        textTransform: 'uppercase',
        color: accentColor,
      }}
    >
      {children}
    </Box>
    <Box sx={{ flex: 1, borderTop: '1px solid #e2e8f0' }} />
  </Box>
)

const monoMeta = { flexShrink: 0, pl: '14px', fontFamily: FONT_MONO, fontSize: 11.5, color: MUTED, whiteSpace: 'nowrap' }

/**
 * TECH — "The Engineer's Matrix".
 * Monospace `// TITLE` subtitle and `[link]` tags, the candidate's skills sorted into a
 * Languages / Frameworks / Tools & Cloud / Databases matrix, and a "Core Stack" line per role
 * listing the skills that role's own text mentions.
 */
const TechTemplate = ({
  name,
  title,
  contactItems,
  links,
  accentColor,
  summary,
  experienceList,
  educationList,
  skills,
  projects,
  certifications,
}) => {
  const matrix = groupSkills(skills)

  return (
    <Box
      id="resume-a4-page"
      sx={{
        ...pageSx,
        p: '42px 52px 52px',
        borderTop: `6px solid ${accentColor}`,
        color: INK,
        fontFamily: FONT_SANS,
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      {/* HEADER */}
      <Box sx={{ pb: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <Box component="h1" sx={{ m: 0, fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {name}
        </Box>
        <Box
          component="p"
          sx={{
            m: '7px 0 0',
            fontFamily: FONT_MONO,
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: '0.06em',
            lineHeight: 1.4,
            textTransform: 'uppercase',
            color: accentColor,
          }}
        >
          <span aria-hidden="true">{'// '}</span>
          {title}
        </Box>

        {(contactItems.length > 0 || links.length > 0) && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '3px 16px',
              mt: '12px',
              fontFamily: FONT_MONO,
              fontSize: 11.5,
              color: '#475569',
            }}
          >
            {contactItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
            {links.map((link) => (
              <a
                key={link.label}
                href={hrefOf(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: accentColor, textDecoration: 'none', fontWeight: 600 }}
              >
                [{link.label.toLowerCase()}]
              </a>
            ))}
          </Box>
        )}
      </Box>

      {/* SUMMARY */}
      {summary && (
        <Box component="section" sx={{ mt: '20px' }}>
          <SectionTitle accentColor={accentColor}>Profile</SectionTitle>
          <Box component="p" sx={{ m: 0, color: BODY, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {summary}
          </Box>
        </Box>
      )}

      {/* SKILLS MATRIX */}
      {matrix.length > 0 && (
        <Box component="section" sx={{ mt: '22px' }}>
          <SectionTitle accentColor={accentColor}>Skills Matrix</SectionTitle>
          <Box sx={{ display: 'grid', gridTemplateColumns: '124px minmax(0, 1fr)', gap: '8px 12px' }}>
            {matrix.map((row) => [
              <Box
                component="h3"
                key={`${row.label}-label`}
                sx={{
                  m: 0,
                  pt: '3px',
                  fontFamily: FONT_MONO,
                  fontWeight: 600,
                  fontSize: 10.5,
                  letterSpacing: '0.08em',
                  lineHeight: 1.5,
                  textTransform: 'uppercase',
                  color: MUTED,
                }}
              >
                {row.label}
              </Box>,
              <Box
                component="ul"
                key={`${row.label}-skills`}
                sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px', m: 0, p: 0, listStyle: 'none' }}
              >
                {row.skills.map((skill) => (
                  <Box
                    component="li"
                    key={skill}
                    sx={{
                      px: '8px',
                      py: '2px',
                      borderRadius: '4px',
                      bgcolor: '#f3f4f6',
                      color: '#1f2937',
                      fontFamily: FONT_MONO,
                      fontSize: 11.5,
                      lineHeight: 1.5,
                    }}
                  >
                    {skill}
                  </Box>
                ))}
              </Box>,
            ])}
          </Box>
        </Box>
      )}

      {/* EXPERIENCE */}
      {experienceList.length > 0 && (
        <Box component="section" sx={{ mt: '22px' }}>
          <SectionTitle accentColor={accentColor}>Experience</SectionTitle>
          <Box sx={{ display: 'grid', rowGap: '15px' }}>
            {experienceList.map((exp, index) => {
              const stack = stackFor(exp, skills)
              return (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Box component="h3" sx={{ m: 0, fontSize: 14, fontWeight: 700 }}>
                      {exp.jobTitle}
                      {exp.company && (
                        <span style={{ color: accentColor, fontWeight: 600 }}>
                          {exp.jobTitle ? ' @ ' : ''}
                          {exp.company}
                        </span>
                      )}
                    </Box>
                    <Box component="span" sx={monoMeta}>
                      {exp.duration}
                    </Box>
                  </Box>
                  {exp.location && (
                    <Box component="p" sx={{ m: 0, fontSize: 12, color: MUTED }}>
                      {exp.location}
                    </Box>
                  )}
                  {stack.length > 0 && (
                    <Box component="p" sx={{ m: '4px 0 0', fontFamily: FONT_MONO, fontSize: 11.5, color: INK }}>
                      <span style={{ color: MUTED }}>Core Stack: </span>
                      {stack.join(' • ')}
                    </Box>
                  )}
                  <Bullets items={exp.bullets} color={BODY} marker={accentColor} fontSize={12.5} />
                </Box>
              )
            })}
          </Box>
        </Box>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Box component="section" sx={{ mt: '22px' }}>
          <SectionTitle accentColor={accentColor}>Projects</SectionTitle>
          <Box sx={{ display: 'grid', rowGap: '9px' }}>
            {projects.map((project, index) => (
              <Box key={index}>
                <Box component="h3" sx={{ m: 0, fontSize: 13, fontWeight: 700 }}>
                  {project.name}
                  {project.link && (
                    <a
                      href={hrefOf(project.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 8,
                        color: accentColor,
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      [link]
                    </a>
                  )}
                </Box>
                <Box component="p" sx={{ m: 0, fontSize: 12.5, color: BODY }}>
                  {project.description}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* EDUCATION */}
      {educationList.length > 0 && (
        <Box component="section" sx={{ mt: '22px' }}>
          <SectionTitle accentColor={accentColor}>Education</SectionTitle>
          <Box sx={{ display: 'grid', rowGap: '8px' }}>
            {educationList.map((ed, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Box>
                  <Box component="h3" sx={{ m: 0, fontSize: 13, fontWeight: 700 }}>
                    {ed.course}
                  </Box>
                  <Box component="p" sx={{ m: 0, fontSize: 12, color: MUTED }}>
                    {[ed.college, ed.university].filter(Boolean).join(' • ')}
                  </Box>
                </Box>
                <Box component="span" sx={monoMeta}>
                  {ed.year}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <Box component="section" sx={{ mt: '22px' }}>
          <SectionTitle accentColor={accentColor}>Certifications</SectionTitle>
          <Box sx={{ display: 'grid', rowGap: '4px' }}>
            {certifications.map((cert, index) => (
              <Box component="p" key={index} sx={{ m: 0, fontSize: 12.5, color: BODY }}>
                <strong style={{ color: INK }}>{cert.name}</strong>
                {cert.issuer ? ` — ${cert.issuer}` : ''}
                {cert.year ? ` (${cert.year})` : ''}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default TechTemplate
