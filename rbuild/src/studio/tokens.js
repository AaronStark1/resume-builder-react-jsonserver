/**
 * Studio design tokens, exposed as CSS custom properties and applied to <body> for every route
 * (see App.jsx). Consumed by studio.css, landing.css and the per-route stylesheets.
 *
 * Brand values come straight from the MUI theme, so every surface follows the global light/dark
 * mode (and therefore the ink-bleed transition) without any theme state of its own.
 */

import lightTheme from '../theme'

// Brand purples that stay constant on "physical" surfaces (cards, paper frames) in either mode.
const brand = lightTheme.palette.primary

const ACCENTS = {
  '--lp-ink': brand.dark,
  '--lp-violet': brand.main,
  '--lp-tomato-deep': '#c5361a',
  '--lp-cream': '#fbf6ee',
  '--lp-tomato': '#ef4a23',
  '--lp-coral': '#fa653d',
  '--lp-orange-soft': '#ff895f',
  '--lp-peach': '#ffb18a',
  '--lp-peach-soft': '#ffdcc8',
  '--lp-butter': '#f7e6a6',
  '--lp-sage': '#cbd8bc',
  '--lp-pink': '#efcbd3',
  '--lp-lavender': '#e4d7f5',
}

export const studioVars = (theme) => {
  const { palette, custom } = theme
  const dark = palette.mode === 'dark'

  return {
    ...ACCENTS,

    // Page surface (featured templates): warm paper in light mode, the app's dark palette in dark.
    '--lp-surface': palette.background.default,
    '--lp-surface-raised': palette.background.paper,
    '--lp-text': palette.text.primary,
    '--lp-text-soft': palette.text.secondary,
    '--lp-line': dark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(20, 0, 43, 0.16)',
    '--lp-brand': palette.primary.main,
    '--lp-accent-text': dark ? '#ff895f' : '#d63c17',
    '--lp-focus': dark ? '#ff895f' : palette.primary.main,
    '--lp-card-shadow': dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(20, 0, 43, 0.3)',

    // Hero: the existing brand gradient with a duotone photograph.
    '--lp-hero-bg': custom.gradient,
    '--lp-hero-base': dark ? '#1b0b30' : '#3d0066',
    '--lp-hero-photo': dark ? 0.42 : 0.6,
    '--lp-hero-veil': dark
      ? 'linear-gradient(100deg, rgba(9, 3, 15, 0.94) 0%, rgba(14, 6, 24, 0.72) 48%, rgba(42, 14, 68, 0.38) 100%), linear-gradient(0deg, rgba(9, 3, 15, 0.86) 0%, rgba(9, 3, 15, 0) 52%)'
      : 'linear-gradient(100deg, rgba(20, 0, 43, 0.9) 0%, rgba(40, 0, 72, 0.62) 48%, rgba(61, 0, 102, 0.22) 100%), linear-gradient(0deg, rgba(20, 0, 43, 0.78) 0%, rgba(20, 0, 43, 0) 52%)',

    // Resume journey: a section-level "night" treatment. Purely visual — it never touches the
    // global theme state — and it is tuned separately for each global theme.
    '--lp-night': dark ? '#07030c' : '#14002b',
    '--lp-night-raised': dark ? '#1a0f2b' : '#2b0a4a',
    '--lp-night-line': dark ? 'rgba(216, 180, 254, 0.16)' : 'rgba(228, 215, 245, 0.2)',
    '--lp-night-glow': dark ? 'rgba(124, 58, 237, 0.26)' : 'rgba(106, 27, 154, 0.62)',
    '--lp-night-soft': dark ? '#a79fb7' : '#cbbfdc',

    // Inner studio routes: the drafting desk, fields, the easel mat and the app chrome.
    '--st-desk': dark ? palette.background.paper : '#fffdf8',
    '--st-desk-line': dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(20, 0, 43, 0.08)',
    '--st-wash': dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(20, 0, 43, 0.04)',
    '--st-shadow': dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(20, 0, 43, 0.22)',
    '--st-chrome': dark ? 'rgba(12, 7, 20, 0.84)' : 'rgba(20, 0, 43, 0.9)',
    '--st-mat': dark
      ? 'radial-gradient(120% 70% at 50% 0%, #27153d 0%, #120a1e 62%, #0d0716 100%)'
      : 'radial-gradient(120% 70% at 50% 0%, #f6f0fc 0%, #e9dff3 62%, #e2d6ee 100%)',
    '--st-mat-line': dark ? 'rgba(216, 180, 254, 0.22)' : 'rgba(61, 0, 102, 0.26)',
    '--st-good': dark ? '#b9d3a2' : '#47703a',
    '--st-glass': dark ? 'rgba(23, 16, 36, 0.86)' : 'rgba(255, 253, 248, 0.88)',
    '--st-seal': dark ? '#22163a' : '#fbf6ee',
    '--st-room': dark
      ? 'radial-gradient(80rem 46rem at 50% 0%, #1f1133 0%, #0c0714 58%, #07030c 100%)'
      : 'radial-gradient(90rem 50rem at 50% 0%, #fffaf1 0%, #f8f3ea 55%, #f0e8da 100%)',
  }
}
