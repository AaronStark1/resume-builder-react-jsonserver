/**
 * Shared constants and pure helpers for the resume templates.
 *
 * Two rules every template follows, because the same markup is printed natively and rasterised by
 * html2canvas for the PDF download:
 *  - no <header>, <footer> or <button> elements (the print stylesheet hides them), and
 *  - no `font-stretch` / `font-variation-settings` (html2canvas draws text with the default width).
 */

export const A4_WIDTH = 794
export const A4_MIN_HEIGHT = 1123

export const FONT_SANS = '"Inter Variable", "Inter", sans-serif'
export const FONT_DISPLAY = '"Archivo Variable", "Inter Variable", "Inter", sans-serif'
export const FONT_SERIF = '"Playfair Variable", "Playfair Display", Georgia, "Times New Roman", serif'
export const FONT_MONO =
  'ui-monospace, "SF Mono", SFMono-Regular, "Cascadia Code", Menlo, Consolas, "Liberation Mono", monospace'

/** The sheet itself: always A4-proportioned white paper, whatever the app theme. */
export const pageSx = {
  width: A4_WIDTH,
  minHeight: A4_MIN_HEIGHT,
  boxSizing: 'border-box',
  bgcolor: '#ffffff',
  position: 'relative',
}

export const hrefOf = (url = '') => (url.startsWith('http') ? url : `https://${url}`)

/** '#3d0066' -> '61, 0, 102' (for rgba() tints of the accent colour). */
export const hexToRgb = (hex = '') => {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) return '61, 0, 102'
  const value = parseInt(match[1], 16)
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`
}

export const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

// ---------- skills ----------

const keyOf = (skill) => String(skill).toLowerCase().replace(/[^a-z0-9+#]/g, '')

const words = (list) => new Set(list.split(' '))

/** Order matters: it is the order of the rows in the Tech template's matrix. */
const SKILL_GROUPS = [
  {
    label: 'Languages',
    keys: words(
      'javascript js typescript ts python java c c++ c# csharp go golang rust ruby php swift kotlin scala dart r sql ' +
        'html html5 css css3 htmlcss html5css3 sass scss less bash shell shellscripting powershell perl elixir ' +
        'haskell lua matlab objectivec solidity graphql',
    ),
  },
  {
    label: 'Frameworks',
    keys: words(
      'react reactjs reactnative nextjs next vue vuejs nuxt nuxtjs angular angularjs svelte sveltekit nodejs node ' +
        'express expressjs nestjs django flask fastapi spring springboot rails rubyonrails laravel dotnet net ' +
        'aspnet aspnetcore redux reduxtoolkit tailwind tailwindcss bootstrap materialui mui jquery flutter electron ' +
        'remix astro gatsby pytorch tensorflow pandas numpy scikitlearn langchain prisma',
    ),
  },
  {
    label: 'Tools & Cloud',
    keys: words(
      'aws amazonwebservices azure microsoftazure gcp googlecloud googlecloudplatform docker kubernetes k8s git ' +
        'github gitlab bitbucket githubactions cicd jenkins terraform ansible linux nginx vite webpack babel jest ' +
        'vitest cypress playwright selenium postman jira figma vercel netlify heroku cloudflare kafka rabbitmq ' +
        'restapis rest restfulapis microservices serverless lambda awslambda s3 ec2 datadog grafana prometheus ' +
        'sentry npm yarn pnpm storybook',
    ),
  },
  {
    label: 'Databases',
    keys: words(
      'mysql postgresql postgres mongodb mongo redis sqlite oracle oracledb dynamodb firebase firestore supabase ' +
        'elasticsearch cassandra mariadb sqlserver mssql microsoftsqlserver neo4j snowflake bigquery couchdb ' +
        'influxdb clickhouse',
    ),
  },
]

/**
 * Sorts the user's own skills into the Tech template's rows. Nothing is added or renamed: a skill
 * the dictionary doesn't know goes under "Additional", and when none are recognised the result is
 * a single "Skills" row.
 */
export const groupSkills = (skills = []) => {
  const rows = SKILL_GROUPS.map((group) => ({ label: group.label, skills: [] }))
  const rest = []
  for (const skill of skills) {
    const key = keyOf(skill)
    const index = SKILL_GROUPS.findIndex((group) => group.keys.has(key))
    if (index === -1) rest.push(skill)
    else rows[index].skills.push(skill)
  }
  const known = rows.filter((row) => row.skills.length > 0)
  if (known.length === 0) return rest.length > 0 ? [{ label: 'Skills', skills: rest }] : []
  return rest.length > 0 ? [...known, { label: 'Additional', skills: rest }] : known
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * The listed skills that a role's own title and bullet points mention, in the order the user
 * listed them: the "Core Stack" line of the Tech template. Derived, never invented — a role that
 * names none of the skills gets no line.
 */
export const stackFor = (experience, skills = [], limit = 6) => {
  const text = [experience?.jobTitle, ...(Array.isArray(experience?.bullets) ? experience.bullets : [])]
    .filter(Boolean)
    .join(' \n ')
    .toLowerCase()
  if (!text) return []
  return skills
    .filter((skill) => {
      const full = String(skill).trim().toLowerCase()
      if (full.length < 2) return false
      // "Node.js" is usually written "Node" in a sentence.
      const short = full.replace(/\.?js$/, '')
      return [full, short.length >= 3 ? short : full].some((term) =>
        new RegExp(`(^|[^a-z0-9+#])${escapeRegExp(term)}(?![a-z0-9+#])`).test(text),
      )
    })
    .slice(0, limit)
}
