/** The resume templates and accent swatches offered by the builder. */
export const resumeTemplates = [
  { id: 'classic', name: 'Classic', desc: 'Centered header, balanced horizontal layout' },
  { id: 'modern', name: 'Modern', desc: 'Colored sidebar for contact & skills, clean body' },
  { id: 'minimal', name: 'Minimal', desc: 'Left-aligned, generous whitespace, thin accent lines' },
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

export const isTemplateId = (id) => resumeTemplates.some((tpl) => tpl.id === id)
export const isAccentHex = (hex) => typeof hex === 'string' && /^#[0-9a-f]{6}$/i.test(hex)
