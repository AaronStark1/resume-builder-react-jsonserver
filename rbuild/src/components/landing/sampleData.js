/**
 * Illustrative content for the landing page. Everything here is sample data for a fictional
 * person — fictional employers and a generic certificate, no real providers or logos — and the
 * page labels it as a sample wherever it is shown.
 */

export const sampleResume = {
  personalDetails: {
    name: 'Sarah Jenkins',
    title: 'Senior Product Designer',
    location: 'Lisbon, Portugal',
  },
  contactDetails: {
    email: 'sarah.jenkins@example.com',
    phoneNumber: '+1 (555) 234-5678',
    github: '',
    linkedIn: 'https://linkedin.com/in/example',
    portfolio: 'https://example.com',
  },
  educationList: [
    {
      course: 'B.A. Interaction Design',
      college: 'Example State University',
      university: '',
      year: '2017',
    },
  ],
  experienceList: [
    {
      jobTitle: 'Senior Product Designer',
      company: 'Northwind Studio',
      location: 'Remote',
      duration: '2021 – Present',
      bullets: [
        'Led the redesign of a self-serve onboarding flow now used by more than 40 teams.',
        'Built and maintained a shared design system across web and mobile products.',
      ],
    },
    {
      jobTitle: 'Product Designer',
      company: 'Lumen Labs',
      location: 'Lisbon',
      duration: '2018 – 2021',
      bullets: [
        'Ran discovery research that reshaped the roadmap for a scheduling product.',
        'Partnered with engineering to ship an accessible component library.',
      ],
    },
    {
      jobTitle: 'Junior Designer',
      company: 'Paper & Pixel',
      location: 'Porto',
      duration: '2017 – 2018',
      bullets: ['Designed marketing sites and brand systems for early-stage clients.'],
    },
  ],
  skills: [
    'Product Strategy',
    'Design Systems',
    'User Research',
    'Prototyping',
    'Accessibility',
    'Figma',
    'HTML & CSS',
    'Facilitation',
  ],
  summary:
    'Product designer with eight years of experience turning complex workflows into clear, accessible products. Comfortable leading research, shaping strategy and shipping polished interfaces alongside engineering.',
  certifications: [{ name: 'Accessible Design Fundamentals', issuer: 'Sample Institute', year: '2023' }],
}

/** The three real rBuild templates, in showcase order. `accent` is one of the builder's own swatches. */
export const showcaseTemplates = [
  {
    id: 'classic',
    index: '01',
    name: 'Classic',
    descriptor: 'Balanced & timeless',
    blurb: 'A centred header and clear, ruled sections. Strong hierarchy that reads well in any industry.',
    accent: '#3d0066',
    frame: 'var(--lp-lavender)',
  },
  {
    id: 'modern',
    index: '02',
    name: 'Modern',
    descriptor: 'Sidebar & identity',
    blurb: 'A confident colour sidebar for contact and skills, with a clean body for your experience.',
    accent: '#3d0066',
    frame: 'var(--lp-peach-soft)',
  },
  {
    id: 'minimal',
    index: '03',
    name: 'Minimal',
    descriptor: 'Whitespace & restraint',
    blurb: 'Left-aligned, generous margins and thin accent rules. Nothing between the reader and your work.',
    accent: '#c25e00',
    frame: 'var(--lp-sage)',
  },
]

/** Resume data per template, built once so the previews never re-create their props. */
export const resumeByTemplate = Object.fromEntries(
  showcaseTemplates.map((tpl) => [tpl.id, { ...sampleResume, template: tpl.id, accentColor: tpl.accent }]),
)

export const skillGroups = [
  { label: 'Craft', skills: ['Design Systems', 'Prototyping', 'Accessibility', 'Figma'], highlight: ['Design Systems'] },
  { label: 'Practice', skills: ['Product Strategy', 'User Research', 'Facilitation'], highlight: ['User Research'] },
]

export const initialsOf = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
