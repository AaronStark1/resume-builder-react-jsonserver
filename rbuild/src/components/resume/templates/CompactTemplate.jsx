import Box from '@mui/material/Box'

import Bullets from './Bullets'
import { FONT_SANS, hrefOf, pageSx } from './helpers'

const INK = '#111827'
const SOFT = '#4b5563'
const MUTED = '#6b7280'

const SectionTitle = ({ accentColor, children }) => (
  <Box
    component="h2"
    sx={{
      m: '0 0 7px',
      pb: '3px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: '0.12em',
      lineHeight: 1.4,
      textTransform: 'uppercase',
      color: accentColor,
    }}
  >
    {children}
  </Box>
)

const sectionSx = { '& + &': { mt: '14px' } }

/**
 * COMPACT — "The 1-Page High-Density ATS".
 * 12px Inter at 1.35 line height inside 16mm margins, with a 55 / 45 two-column body: summary and
 * experience on the left; education, skills, projects and certifications on the right.
 */
const CompactTemplate = ({
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
}) => (
  <Box
    id="resume-a4-page"
    sx={{ ...pageSx, p: '16mm', color: '#1f2937', fontFamily: FONT_SANS, fontSize: 12, lineHeight: 1.35 }}
  >
    {/* HEADER */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '20px',
        pb: '10px',
        mb: '14px',
        borderBottom: `2px solid ${accentColor}`,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box
          component="h1"
          sx={{ m: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: INK }}
        >
          {name}
        </Box>
        <Box component="p" sx={{ m: '3px 0 0', fontSize: 13, fontWeight: 600, color: accentColor }}>
          {title}
        </Box>
      </Box>

      {(contactItems.length > 0 || links.length > 0) && (
        <Box sx={{ flexShrink: 0, maxWidth: '50%', textAlign: 'right', fontSize: 11, lineHeight: 1.5, color: SOFT }}>
          {contactItems.map((item) => (
            <Box component="p" key={item} sx={{ m: 0 }}>
              {item}
            </Box>
          ))}
          {links.length > 0 && (
            <Box component="p" sx={{ m: 0 }}>
              {links.map((link, index) => (
                <span key={link.label}>
                  <a
                    href={hrefOf(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: accentColor, textDecoration: 'none', fontWeight: 600 }}
                  >
                    {link.label}
                  </a>
                  {index < links.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>

    {/* BODY: 55 / 45 */}
    <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 55fr) minmax(0, 45fr)', columnGap: '20px' }}>
      {/* LEFT: summary, experience */}
      <Box>
        {summary && (
          <Box component="section" sx={sectionSx}>
            <SectionTitle accentColor={accentColor}>Summary</SectionTitle>
            <Box component="p" sx={{ m: 0, color: '#374151', whiteSpace: 'pre-wrap' }}>
              {summary}
            </Box>
          </Box>
        )}

        {experienceList.length > 0 && (
          <Box component="section" sx={sectionSx}>
            <SectionTitle accentColor={accentColor}>Work Experience</SectionTitle>
            <Box sx={{ display: 'grid', rowGap: '10px' }}>
              {experienceList.map((exp, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Box component="h3" sx={{ m: 0, fontSize: 12.5, fontWeight: 700, color: INK }}>
                      {exp.jobTitle}
                    </Box>
                    <Box
                      component="span"
                      sx={{ flexShrink: 0, pl: '10px', fontSize: 10.5, color: MUTED, whiteSpace: 'nowrap' }}
                    >
                      {exp.duration}
                    </Box>
                  </Box>
                  {(exp.company || exp.location) && (
                    <Box component="p" sx={{ m: 0, fontSize: 11.5, fontWeight: 600, color: SOFT }}>
                      {[exp.company, exp.location].filter(Boolean).join(' · ')}
                    </Box>
                  )}
                  <Bullets items={exp.bullets} marker={accentColor} fontSize={11.5} indent={14} gap={2} />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* RIGHT: education, skills, projects, certifications */}
      <Box sx={{ pl: '20px', borderLeft: '1px solid #e5e7eb' }}>
        {educationList.length > 0 && (
          <Box component="section" sx={sectionSx}>
            <SectionTitle accentColor={accentColor}>Education</SectionTitle>
            <Box sx={{ display: 'grid', rowGap: '8px' }}>
              {educationList.map((ed, index) => (
                <Box key={index}>
                  <Box component="h3" sx={{ m: 0, fontSize: 12, fontWeight: 700, color: INK }}>
                    {ed.course}
                  </Box>
                  <Box component="p" sx={{ m: 0, fontSize: 11, color: SOFT }}>
                    {[ed.college, ed.university].filter(Boolean).join(' · ')}
                  </Box>
                  {ed.year && (
                    <Box component="p" sx={{ m: 0, fontSize: 10.5, color: MUTED }}>
                      {ed.year}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {skills.length > 0 && (
          <Box component="section" sx={sectionSx}>
            <SectionTitle accentColor={accentColor}>Skills</SectionTitle>
            <Box component="ul" sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px', m: 0, p: 0, listStyle: 'none' }}>
              {skills.map((skill, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    px: '6px',
                    py: '1px',
                    border: '1px solid #d1d5db',
                    borderRadius: '3px',
                    fontSize: 10.5,
                    lineHeight: 1.5,
                    color: '#1f2937',
                  }}
                >
                  {skill}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {projects.length > 0 && (
          <Box component="section" sx={sectionSx}>
            <SectionTitle accentColor={accentColor}>Projects</SectionTitle>
            <Box sx={{ display: 'grid', rowGap: '6px' }}>
              {projects.map((project, index) => (
                <Box key={index}>
                  <Box component="h3" sx={{ m: 0, fontSize: 12, fontWeight: 700, color: INK }}>
                    {project.name}
                  </Box>
                  <Box component="p" sx={{ m: 0, fontSize: 11, color: SOFT }}>
                    {project.description}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {certifications.length > 0 && (
          <Box component="section" sx={sectionSx}>
            <SectionTitle accentColor={accentColor}>Certifications</SectionTitle>
            <Box sx={{ display: 'grid', rowGap: '5px' }}>
              {certifications.map((cert, index) => (
                <Box key={index}>
                  <Box component="h3" sx={{ m: 0, fontSize: 11.5, fontWeight: 700, color: INK }}>
                    {cert.name}
                  </Box>
                  <Box component="p" sx={{ m: 0, fontSize: 11, color: SOFT }}>
                    {[cert.issuer, cert.year].filter(Boolean).join(' · ')}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  </Box>
)

export default CompactTemplate
