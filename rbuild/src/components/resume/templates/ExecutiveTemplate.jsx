import Box from '@mui/material/Box'
import '@fontsource-variable/playfair/wght.css'

import Bullets from './Bullets'
import { FONT_DISPLAY, FONT_SANS, FONT_SERIF, hrefOf, initialsOf, pageSx } from './helpers'

const INK = '#111827'
const SOFT = '#4b5563'
const HAIRLINE = '0.75pt solid #9ca3af'

const SectionTitle = ({ accentColor, children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', mb: '12px' }}>
    <Box
      component="h2"
      sx={{
        m: 0,
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: '0.22em',
        lineHeight: 1.4,
        textTransform: 'uppercase',
        color: accentColor,
      }}
    >
      {children}
    </Box>
    <Box sx={{ flex: 1, borderTop: '0.75pt solid #d1d5db' }} />
  </Box>
)

const dateSx = {
  flexShrink: 0,
  pl: '16px',
  fontFamily: FONT_SERIF,
  fontStyle: 'italic',
  fontSize: 13,
  color: SOFT,
  whiteSpace: 'nowrap',
}

/**
 * EXECUTIVE — "The C-Suite Monograph".
 * A centred monogram crest and serif nameplate, a three-column strengths banner under the summary
 * (the first three skills the candidate listed), then company-led roles with italic dates.
 */
const ExecutiveTemplate = ({
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
  const strengths = skills.slice(0, 3)
  const expertise = skills.slice(3)

  return (
    <Box
      id="resume-a4-page"
      sx={{ ...pageSx, p: '50px 64px 56px', color: INK, fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.5 }}
    >
      {/* MASTHEAD */}
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: '14px' }}>
          <Box
            aria-hidden="true"
            sx={{ p: '3px', border: `1px solid ${accentColor}`, borderRadius: '50%', lineHeight: 0 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 46,
                height: 46,
                border: `1px solid ${accentColor}`,
                borderRadius: '50%',
                color: accentColor,
                fontFamily: FONT_SERIF,
                fontWeight: 600,
                fontSize: 17,
                letterSpacing: '0.06em',
                lineHeight: 1,
              }}
            >
              {initialsOf(name)}
            </Box>
          </Box>
        </Box>

        <Box
          component="h1"
          sx={{ m: 0, fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 38, letterSpacing: '-0.01em', lineHeight: 1.1 }}
        >
          {name}
        </Box>
        <Box
          component="p"
          sx={{
            m: '11px 0 0',
            fontFamily: FONT_DISPLAY,
            fontWeight: 600,
            fontSize: 11.5,
            letterSpacing: '0.26em',
            lineHeight: 1.4,
            textTransform: 'uppercase',
            color: accentColor,
          }}
        >
          {title}
        </Box>

        {(contactItems.length > 0 || links.length > 0) && (
          <Box sx={{ mt: '16px', pt: '11px', borderTop: `0.75pt solid ${INK}`, fontSize: 12, color: SOFT }}>
            {contactItems.length > 0 && <Box component="p" sx={{ m: 0 }}>{contactItems.join('   ·   ')}</Box>}
            {links.length > 0 && (
              <Box component="p" sx={{ m: '2px 0 0' }}>
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
                    {index < links.length - 1 ? '   ·   ' : ''}
                  </span>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* SUMMARY */}
      {summary && (
        <Box component="section" sx={{ mt: '24px' }}>
          <SectionTitle accentColor={accentColor}>Executive Summary</SectionTitle>
          <Box component="p" sx={{ m: 0, fontSize: 13.5, lineHeight: 1.65, color: '#374151', whiteSpace: 'pre-wrap' }}>
            {summary}
          </Box>
        </Box>
      )}

      {/* KEY STRENGTHS BANNER */}
      {strengths.length > 0 && (
        <Box
          component="ul"
          aria-label="Core strengths"
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${strengths.length}, minmax(0, 1fr))`,
            m: '20px 0 0',
            p: 0,
            borderTop: HAIRLINE,
            borderBottom: HAIRLINE,
            listStyle: 'none',
          }}
        >
          {strengths.map((strength, index) => (
            <Box
              component="li"
              key={strength}
              sx={{ p: '11px 12px 12px', textAlign: 'center', borderLeft: index > 0 ? HAIRLINE : 'none' }}
            >
              <Box
                component="span"
                aria-hidden="true"
                sx={{ display: 'block', fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 12, color: accentColor }}
              >
                {String(index + 1).padStart(2, '0')}
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  mt: '3px',
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: 11.5,
                  letterSpacing: '0.14em',
                  lineHeight: 1.35,
                  textTransform: 'uppercase',
                }}
              >
                {strength}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* EXPERIENCE */}
      {experienceList.length > 0 && (
        <Box component="section" sx={{ mt: '26px' }}>
          <SectionTitle accentColor={accentColor}>Leadership Experience</SectionTitle>
          <Box sx={{ display: 'grid', rowGap: '16px' }}>
            {experienceList.map((exp, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Box
                    component="h3"
                    sx={{ m: 0, fontSize: 13.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                  >
                    {exp.company || exp.jobTitle}
                  </Box>
                  <Box component="span" sx={dateSx}>
                    {exp.duration}
                  </Box>
                </Box>
                {(exp.company ? exp.jobTitle || exp.location : exp.location) && (
                  <Box component="p" sx={{ m: '1px 0 0', fontSize: 13 }}>
                    {exp.company && exp.jobTitle && (
                      <span style={{ color: accentColor, fontWeight: 600 }}>{exp.jobTitle}</span>
                    )}
                    {exp.location && (
                      <span style={{ color: '#6b7280' }}>
                        {exp.company && exp.jobTitle ? '  ·  ' : ''}
                        {exp.location}
                      </span>
                    )}
                  </Box>
                )}
                <Bullets items={exp.bullets} marker={accentColor} fontSize={13} />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* EDUCATION */}
      {educationList.length > 0 && (
        <Box component="section" sx={{ mt: '26px' }}>
          <SectionTitle accentColor={accentColor}>Education</SectionTitle>
          <Box sx={{ display: 'grid', rowGap: '10px' }}>
            {educationList.map((ed, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Box>
                  <Box component="h3" sx={{ m: 0, fontSize: 13.5, fontWeight: 700 }}>
                    {ed.course}
                  </Box>
                  <Box component="p" sx={{ m: 0, fontSize: 12.5, color: SOFT }}>
                    {[ed.college, ed.university].filter(Boolean).join('  ·  ')}
                  </Box>
                </Box>
                <Box component="span" sx={dateSx}>
                  {ed.year}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* FURTHER EXPERTISE */}
      {expertise.length > 0 && (
        <Box component="section" sx={{ mt: '26px' }}>
          <SectionTitle accentColor={accentColor}>Areas of Expertise</SectionTitle>
          <Box component="p" sx={{ m: 0, fontSize: 13, lineHeight: 1.7, color: '#374151' }}>
            {expertise.join('   ·   ')}
          </Box>
        </Box>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Box component="section" sx={{ mt: '26px' }}>
          <SectionTitle accentColor={accentColor}>Selected Initiatives</SectionTitle>
          <Box sx={{ display: 'grid', rowGap: '9px' }}>
            {projects.map((project, index) => (
              <Box key={index}>
                <Box component="h3" sx={{ m: 0, fontSize: 13.5, fontWeight: 700 }}>
                  {project.name}
                </Box>
                <Box component="p" sx={{ m: 0, fontSize: 12.5, color: SOFT }}>
                  {project.description}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <Box component="section" sx={{ mt: '26px' }}>
          <SectionTitle accentColor={accentColor}>Certifications</SectionTitle>
          <Box sx={{ display: 'grid', rowGap: '5px' }}>
            {certifications.map((cert, index) => (
              <Box component="p" key={index} sx={{ m: 0, fontSize: 13, color: '#374151' }}>
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

export default ExecutiveTemplate
