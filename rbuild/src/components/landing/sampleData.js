import { DEFAULT_ACCENT, TEMPLATE_IDS } from '../../config/resumeDesign'

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

/**
 * A second fictional person, for the Tech template: its skills matrix and "Core Stack" lines are
 * derived from the resume's own skills and bullet points, so the sample needs an engineer's.
 */
export const sampleEngineer = {
  personalDetails: {
    name: 'Alex Rivera',
    title: 'Full Stack Engineer',
    location: 'Austin, USA',
  },
  contactDetails: {
    email: 'alex.rivera@example.com',
    phoneNumber: '+1 (555) 867-2310',
    github: 'https://github.com/example',
    linkedIn: 'https://linkedin.com/in/example',
    portfolio: 'https://example.com',
  },
  educationList: [
    {
      course: 'B.S. Computer Science',
      college: 'Example Institute of Technology',
      university: '',
      year: '2018',
    },
  ],
  experienceList: [
    {
      jobTitle: 'Senior Full Stack Engineer',
      company: 'Northwind Studio',
      location: 'Remote',
      duration: '2022 – Present',
      bullets: [
        'Rebuilt the scheduling dashboard in React and TypeScript, halving its time to interactive.',
        'Moved the billing API from a single Node.js server to Docker services on AWS.',
      ],
    },
    {
      jobTitle: 'Software Engineer',
      company: 'Lumen Labs',
      location: 'Austin',
      duration: '2018 – 2022',
      bullets: [
        'Built Python data pipelines on PostgreSQL that feed the reporting used by every team.',
        'Added Redis caching to the search endpoints and wrote the on-call runbook for them.',
      ],
    },
  ],
  skills: [
    'TypeScript',
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'Next.js',
    'AWS',
    'Docker',
    'GitHub Actions',
    'PostgreSQL',
    'Redis',
  ],
  summary:
    'Full stack engineer with seven years of experience building dependable web products end to end, from interface to infrastructure. Happiest making a slow system fast and a confusing one obvious.',
  certifications: [],
}

/**
 * The four flagship templates of the landing-page stack, in showcase order (the builder offers
 * seven; see config/resumeDesign.js). `accent` is one of the builder's own swatches.
 */
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
    id: 'executive',
    index: '03',
    name: 'Executive',
    descriptor: 'Crest & gravitas',
    blurb: 'A monogram crest, a serif nameplate and your three leading strengths set between hairline rules.',
    accent: '#1a365d',
    frame: 'var(--lp-butter)',
  },
  {
    id: 'tech',
    index: '04',
    name: 'Tech',
    descriptor: 'Matrix & stack',
    blurb: 'Monospace details, skills sorted into a matrix and the core stack called out under every role.',
    accent: '#065f46',
    frame: 'var(--lp-sage)',
  },
]

/** The colour of the mat each template is shown on (landing stack, launchpad). */
export const templateFrames = {
  classic: 'var(--lp-lavender)',
  modern: 'var(--lp-peach-soft)',
  minimal: 'var(--lp-sage)',
  executive: 'var(--lp-butter)',
  tech: 'var(--lp-sage)',
  compact: 'var(--lp-pink)',
  creative: 'var(--lp-peach)',
}

/** The sample person shown in a template: the engineer for Tech, the designer everywhere else. */
export const sampleFor = (template) => (template === 'tech' ? sampleEngineer : sampleResume)

const SAMPLE_ACCENTS = {
  ...Object.fromEntries(showcaseTemplates.map((tpl) => [tpl.id, tpl.accent])),
  minimal: '#c25e00',
}

/** Resume data per template (all seven), built once so the previews never re-create their props. */
export const resumeByTemplate = Object.fromEntries(
  TEMPLATE_IDS.map((id) => [id, { ...sampleFor(id), template: id, accentColor: SAMPLE_ACCENTS[id] ?? DEFAULT_ACCENT }]),
)

export const skillGroups = [
  { label: 'Craft', skills: ['Design Systems', 'Prototyping', 'Accessibility', 'Figma'], highlight: ['Design Systems'] },
  { label: 'Practice', skills: ['Product Strategy', 'User Research', 'Facilitation'], highlight: ['User Research'] },
]

export { initialsOf } from '../resume/templates/helpers'
