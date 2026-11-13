import Box from '@mui/material/Box'

import Bullets from './Bullets'
import { FONT_DISPLAY, FONT_SANS, FONT_SERIF, hexToRgb, hrefOf, pageSx } from './helpers'

const INK = '#14131a'
const SOFT = '#4b5563'
const MUTED = '#6b7280'
const TOMATO = '#ef4a23' // the nameplate's signature dot keeps rBuild's tomato whatever the accent

/** A body row: a narrow rail with the numbered section label, and the content beside it. */
const Row = ({ index, label, accentColor, children }) => (
  <Box
    component="section"
    sx={{
      display: 'grid',
      gridTemplateColumns: '118px minmax(0, 1fr)',
      columnGap: '26px',
      '& + &': { mt: '20px', pt: '18px', borderTop: '1px solid #e5e7eb' },
    }}
  >
    <Box>
      <Box
        component="span"
        aria-hidden="true"
        sx={{ display: 'block', fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 19, lineHeight: 1, color: '#9ca3af' }}
      >
        {String(index).padStart(2, '0')}
      </Box>
      <Box
        component="h2"
        sx={{
          m: '7px 0 0',
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: '0.18em',
          lineHeight: 1.45,
          textTransform: 'uppercase',
          color: accentColor,
        }}
      >
        {label}
      </Box>
    </Box>
    <Box sx={{ minWidth: 0 }}>{children}</Box>
  </Box>
)

/**
 * CREATIVE — "The Atelier Portfolio".
 * An asymmetrical banner tinted with 6% of the accent, an oversized Archivo nameplate closed by a
 * tomato dot, a numbered rail of sections, and bordered callout boxes for featured work (shown
 * when the resume carries projects).
 */
const CreativeTemplate = ({
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
  const rows = [
    summary && {
      label: 'Profile',
      content: (
        <Box component="p" sx={{ m: 0, fontSize: 14, lineHeight: 1.65, color: '#1f2937', whiteSpace: 'pre-wrap' }}>
          {summary}
        </Box>
      ),
    },
    projects.length > 0 && {
      label: 'Featured Work',
      content: (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
          {projects.map((project, index) => (
            <Box
              key={index}
              sx={{ p: '11px 13px 12px', border: '1px solid rgba(var(--accent-rgb), 0.38)', borderRadius: '6px' }}
            >
              <Box component="h3" sx={{ m: 0, fontSize: 13, fontWeight: 700, color: INK }}>
                {project.name}
              </Box>
              {project.description && (
                <Box component="p" sx={{ m: '3px 0 0', fontSize: 12, lineHeight: 1.5, color: SOFT }}>
                  {project.description}
                </Box>
              )}
              {project.link && (
                <a
                  href={hrefOf(project.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: 5,
                    color: accentColor,
                    fontSize: 11,
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  View project
                </a>
              )}
            </Box>
          ))}
        </Box>
      ),
    },
    experienceList.length > 0 && {
      label: 'Experience',
      content: (
        <Box sx={{ display: 'grid', rowGap: '15px' }}>
          {experienceList.map((exp, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Box component="h3" sx={{ m: 0, fontSize: 14, fontWeight: 700, color: INK }}>
                  {exp.jobTitle}
                </Box>
                <Box
                  component="span"
                  sx={{
                    flexShrink: 0,
                    pl: '14px',
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 600,
                    fontSize: 10.5,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: MUTED,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {exp.duration}
                </Box>
              </Box>
              {(exp.company || exp.location) && (
                <Box component="p" sx={{ m: '1px 0 0', fontSize: 12.5, color: MUTED }}>
                  {exp.company && (
                    <span style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 14, color: accentColor }}>
                      {exp.company}
                    </span>
                  )}
                  {exp.company && exp.location ? '  ·  ' : ''}
                  {exp.location}
                </Box>
              )}
              <Bullets items={exp.bullets} marker={accentColor} fontSize={12.5} />
            </Box>
          ))}
        </Box>
      ),
    },
    skills.length > 0 && {
      label: 'Skills',
      content: (
        <Box component="ul" sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', m: 0, p: 0, listStyle: 'none' }}>
          {skills.map((skill, index) => (
            <Box
              component="li"
              key={index}
              sx={{
                px: '11px',
                py: '3px',
                border: '1px solid rgba(var(--accent-rgb), 0.42)',
                borderRadius: '999px',
                fontSize: 11.5,
                lineHeight: 1.5,
                color: '#1f2937',
              }}
            >
              {skill}
            </Box>
          ))}
        </Box>
      ),
    },
    educationList.length > 0 && {
      label: 'Education',
      content: (
        <Box sx={{ display: 'grid', rowGap: '9px' }}>
          {educationList.map((ed, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Box>
                <Box component="h3" sx={{ m: 0, fontSize: 13.5, fontWeight: 700, color: INK }}>
                  {ed.course}
                </Box>
                <Box component="p" sx={{ m: 0, fontSize: 12.5, color: SOFT }}>
                  {[ed.college, ed.university].filter(Boolean).join('  ·  ')}
                </Box>
              </Box>
              <Box component="span" sx={{ flexShrink: 0, pl: '14px', fontSize: 12, color: MUTED, whiteSpace: 'nowrap' }}>
                {ed.year}
              </Box>
            </Box>
          ))}
        </Box>
      ),
    },
    certifications.length > 0 && {
      label: 'Certifications',
      content: (
        <Box sx={{ display: 'grid', rowGap: '5px' }}>
          {certifications.map((cert, index) => (
            <Box component="p" key={index} sx={{ m: 0, fontSize: 12.5, color: SOFT }}>
              <strong style={{ color: INK }}>{cert.name}</strong>
              {cert.issuer ? ` — ${cert.issuer}` : ''}
              {cert.year ? ` (${cert.year})` : ''}
            </Box>
          ))}
        </Box>
      ),
    },
  ].filter(Boolean)

  return (
    <Box
      id="resume-a4-page"
      sx={{ ...pageSx, color: '#1f2937', fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.5 }}
      style={{ '--accent-rgb': hexToRgb(accentColor) }}
    >
      {/* BANNER */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 196px',
          columnGap: '28px',
          alignItems: 'end',
          p: '46px 56px 30px',
          bgcolor: 'rgba(var(--accent-rgb), 0.06)',
          borderBottom: `3px solid ${accentColor}`,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            component="p"
            sx={{ m: '0 0 8px', fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 18, lineHeight: 1.3, color: accentColor }}
          >
            {title}
          </Box>
          <Box
            component="h1"
            sx={{
              m: 0,
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 52,
              letterSpacing: '-0.025em',
              lineHeight: 0.96,
              textTransform: 'uppercase',
              color: INK,
              overflowWrap: 'break-word',
            }}
          >
            {name}
            <span aria-hidden="true" style={{ color: TOMATO }}>
              .
            </span>
          </Box>
        </Box>

        {(contactItems.length > 0 || links.length > 0) && (
          <Box sx={{ textAlign: 'right', fontSize: 11.5, lineHeight: 1.65, color: '#374151' }}>
            {contactItems.map((item) => (
              <Box component="p" key={item} sx={{ m: 0, overflowWrap: 'anywhere' }}>
                {item}
              </Box>
            ))}
            {links.length > 0 && (
              <Box component="p" sx={{ m: '4px 0 0' }}>
                {links.map((link, index) => (
                  <span key={link.label}>
                    <a
                      href={hrefOf(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: accentColor, fontWeight: 600, textDecoration: 'underline' }}
                    >
                      {link.label}
                    </a>
                    {index < links.length - 1 ? '  ·  ' : ''}
                  </span>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* BODY */}
      <Box sx={{ p: '30px 56px 52px' }}>
        {rows.map((row, index) => (
          <Row key={row.label} index={index + 1} label={row.label} accentColor={accentColor}>
            {row.content}
          </Row>
        ))}
      </Box>
    </Box>
  )
}

export default CreativeTemplate
