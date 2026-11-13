/** The resume templates and accent swatches offered by the builder. */
export const TEMPLATE_IDS = ['classic', 'modern', 'minimal', 'executive', 'tech', 'compact', 'creative']

/**
 * `badge` is the archetype in a word, `desc` what the layout does, `fit` who it suits.
 * The order here is the order of TEMPLATE_IDS and of every picker.
 */
export const resumeTemplates = [
  {
    id: 'classic',
    name: 'Classic',
    badge: 'Heritage',
    desc: 'Centred header and ruled sections in a balanced single column.',
    fit: 'Business, operations, public sector',
  },
  {
    id: 'modern',
    name: 'Modern',
    badge: 'Sidebar',
    desc: 'Accent sidebar for contact, skills and education beside a clean body.',
    fit: 'Product, marketing, design',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    badge: 'Editorial',
    desc: 'Left-aligned type, generous whitespace and thin accent lines.',
    fit: 'Writing, research, consulting',
  },
  {
    id: 'executive',
    name: 'Executive',
    badge: 'C-Suite',
    desc: 'Monogram crest, serif nameplate and a three-column strengths banner.',
    fit: 'Directors, founders, senior leaders',
  },
  {
    id: 'tech',
    name: 'Tech',
    badge: 'Engineer',
    desc: 'Monospace details, a grouped skills matrix and a core stack per role.',
    fit: 'Software, data, DevOps',
  },
  {
    id: 'compact',
    name: 'Compact',
    badge: '1-Page',
    desc: 'Dense 55 / 45 two-column body built to stay on one page.',
    fit: 'Long histories, ATS-heavy applications',
  },
  {
    id: 'creative',
    name: 'Creative',
    badge: 'Atelier',
    desc: 'Tinted banner, oversized nameplate and callouts for featured work.',
    fit: 'Design, brand, portfolio-led roles',
  },
]

export const accentColors = [
  { name: 'Royal Purple', value: '#3d0066' },
  { name: 'Navy Blue', value: '#1a365d' },
  { name: 'Emerald', value: '#065f46' },
  { name: 'Crimson', value: '#991b1b' },
  { name: 'Slate Gray', value: '#334155' },
  { name: 'Warm Amber', value: '#c25e00' },
]

export const DEFAULT_TEMPLATE = 'classic'
export const DEFAULT_ACCENT = '#3d0066'

export const templateName = (id) => resumeTemplates.find((tpl) => tpl.id === id)?.name ?? 'Classic'

export const accentName = (hex = '') =>
  accentColors.find((color) => color.value.toLowerCase() === hex.toLowerCase())?.name ?? 'Custom accent'

export const isTemplateId = (id) => TEMPLATE_IDS.includes(id)
export const isAccentHex = (hex) => typeof hex === 'string' && /^#[0-9a-f]{6}$/i.test(hex)
