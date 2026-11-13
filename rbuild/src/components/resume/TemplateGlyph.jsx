/**
 * A thumbnail-sized wireframe of each template's layout, used as its icon in the picker.
 * Lines are `[x1, y, x2, weight?]` on a 28 × 36 sheet; accent parts take the studio's tomato.
 */
const line = ([x1, y, x2, weight = 1.3], key, accent = false) => (
  <path
    key={key}
    d={`M${x1} ${y}H${x2}`}
    strokeWidth={weight}
    stroke={accent ? 'var(--lp-tomato)' : 'currentColor'}
    strokeLinecap="round"
  />
)

const GLYPHS = {
  classic: {
    ink: [[8, 6, 20, 2.2], [10.5, 9.5, 17.5], [4, 16.5, 24], [4, 19.5, 19], [4, 26.5, 24], [4, 29.5, 16]],
    accent: [[4, 13, 24, 1], [4, 23, 24, 1]],
  },
  modern: {
    ink: [[13, 7, 22, 2.2], [13, 11.5, 24], [13, 14.5, 21], [13, 20, 24], [13, 23, 24], [13, 26, 19]],
    extra: <rect x="1.6" y="1.6" width="8" height="32.8" rx="1.4" fill="var(--lp-tomato)" />,
  },
  minimal: {
    ink: [[4, 7, 15, 2.2], [4, 16, 22], [4, 19, 18], [4, 25, 22], [4, 28, 14]],
    accent: [[4, 11.5, 24, 0.9]],
  },
  executive: {
    ink: [[8, 13.5, 20, 2], [4, 26, 24], [4, 29, 18]],
    accent: [[4, 17.5, 24, 0.8], [4, 22, 24, 0.8]],
    extra: (
      <>
        <circle cx="14" cy="7" r="3" fill="none" stroke="var(--lp-tomato)" strokeWidth="1.1" />
        <path d="M10.7 17.9V21.6M17.3 17.9V21.6" stroke="var(--lp-tomato)" strokeWidth="0.8" />
      </>
    ),
  },
  tech: {
    ink: [[4, 8.5, 15, 2.2], [4, 24, 24], [4, 27, 21], [4, 30, 16]],
    accent: [[1.6, 2.4, 26.4, 1.8], [4, 12.5, 10, 1.1]],
    extra: (
      <g fill="currentColor" opacity="0.55">
        <rect x="4" y="16" width="5.4" height="3.4" rx="1" />
        <rect x="11" y="16" width="5.4" height="3.4" rx="1" />
        <rect x="18" y="16" width="5.4" height="3.4" rx="1" />
      </g>
    ),
  },
  compact: {
    ink: [
      [4, 6, 13, 2],
      [4, 13.5, 14],
      [4, 16.5, 14],
      [4, 19.5, 12],
      [4, 23.5, 14],
      [4, 26.5, 14],
      [4, 29.5, 11],
      [19.5, 13.5, 24],
      [19.5, 16.5, 23],
      [19.5, 22, 24],
      [19.5, 25, 22],
    ],
    accent: [[4, 9.8, 24, 1]],
    extra: <path d="M16.8 12.6V30.4" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />,
  },
  creative: {
    ink: [[4, 6.5, 17, 2.6], [4, 10.5, 12, 2.6], [11.5, 19, 24], [11.5, 22, 21], [11.5, 27.5, 24], [11.5, 30.5, 18]],
    accent: [[4, 19, 8, 1.1], [4, 27.5, 8, 1.1]],
    extra: (
      <>
        <path d="M1.6 3A1.4 1.4 0 0 1 3 1.6H25A1.4 1.4 0 0 1 26.4 3V14.2H1.6Z" fill="var(--lp-tomato)" opacity="0.2" />
        <circle cx="14.6" cy="11.2" r="1.25" fill="var(--lp-tomato)" />
      </>
    ),
  },
}

const TemplateGlyph = ({ id }) => {
  const glyph = GLYPHS[id] ?? GLYPHS.classic
  return (
    <svg className="st-tpl__glyph" viewBox="0 0 28 36" aria-hidden="true" focusable="false" fill="none">
      <rect x="1" y="1" width="26" height="34" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      {glyph.extra}
      {glyph.ink.map((item, index) => line(item, `i${index}`))}
      {glyph.accent?.map((item, index) => line(item, `a${index}`, true))}
    </svg>
  )
}

export default TemplateGlyph
