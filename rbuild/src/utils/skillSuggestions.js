const skillMaps = [
  {
    keywords: ['front', 'ui', 'react', 'web', 'javascript', 'vue', 'angular'],
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'HTML5/CSS3',
      'Redux Toolkit',
      'Figma',
      'REST APIs',
      'Git',
    ],
  },
  {
    keywords: ['back', 'node', 'api', 'server', 'python', 'java', 'go', 'engineer'],
    skills: [
      'Node.js',
      'Express',
      'Python',
      'Java',
      'PostgreSQL',
      'MongoDB',
      'Docker',
      'AWS',
      'REST APIs',
      'Microservices',
      'Git',
    ],
  },
  {
    keywords: ['design', 'ux', 'product', 'creative'],
    skills: [
      'Figma',
      'UI/UX Design',
      'Wireframing',
      'Prototyping',
      'User Research',
      'Design Systems',
      'Responsive Design',
      'Information Architecture',
    ],
  },
  {
    keywords: ['data', 'analytics', 'machine', 'ai', 'sql'],
    skills: [
      'Python',
      'SQL',
      'Pandas',
      'NumPy',
      'Machine Learning',
      'Data Visualization',
      'Power BI',
      'Git',
    ],
  },
]

const defaultSkills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Git',
  'Docker',
  'SQL',
  'Problem Solving',
  'Team Collaboration',
  'Agile',
]

export const getSkillSuggestions = (jobTitle = '') => {
  const lower = jobTitle.toLowerCase().trim()
  if (!lower) return defaultSkills

  for (const group of skillMaps) {
    if (group.keywords.some((k) => lower.includes(k))) {
      return group.skills
    }
  }

  return defaultSkills
}

