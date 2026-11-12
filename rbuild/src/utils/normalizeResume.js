export const normalizeResume = (raw = {}) => {
  if (!raw || typeof raw !== 'object') {
    raw = {}
  }

  const personalDetails = {
    name: raw.personalDetails?.name ?? '',
    title: raw.personalDetails?.title ?? '',
    location: raw.personalDetails?.location ?? '',
  }

  const contactDetails = {
    email: raw.contactDetails?.email ?? '',
    phoneNumber: raw.contactDetails?.phoneNumber ?? '',
    github: raw.contactDetails?.github ?? '',
    linkedIn: raw.contactDetails?.linkedIn ?? '',
    portfolio: raw.contactDetails?.portfolio ?? '',
  }

  const education = {
    course: raw.education?.course ?? '',
    college: raw.education?.college ?? '',
    university: raw.education?.university ?? '',
    year: raw.education?.year ?? '',
  }

  const professionalDetails = {
    jobTitle: raw.professionalDetails?.jobTitle ?? '',
    company: raw.professionalDetails?.company ?? '',
    location: raw.professionalDetails?.location ?? '',
    duration: raw.professionalDetails?.duration ?? '',
  }

  // Backward compatibility: educationList[]
  let educationList = []
  if (Array.isArray(raw.educationList) && raw.educationList.length > 0) {
    educationList = raw.educationList.map((ed) => ({
      course: ed.course ?? '',
      college: ed.college ?? '',
      university: ed.university ?? '',
      year: ed.year ?? '',
    }))
  } else if (education.course || education.college) {
    educationList = [{ ...education }]
  }

  // Backward compatibility: experienceList[]
  let experienceList = []
  if (Array.isArray(raw.experienceList) && raw.experienceList.length > 0) {
    experienceList = raw.experienceList.map((exp) => ({
      jobTitle: exp.jobTitle ?? '',
      company: exp.company ?? '',
      location: exp.location ?? '',
      duration: exp.duration ?? '',
      bullets: Array.isArray(exp.bullets) ? exp.bullets : (exp.description ? [exp.description] : []),
    }))
  } else if (professionalDetails.jobTitle || professionalDetails.company) {
    experienceList = [
      {
        ...professionalDetails,
        bullets: raw.professionalDetails?.bullets ?? [],
      },
    ]
  }

  const skills = Array.isArray(raw.skills)
    ? raw.skills.filter(Boolean).map((s) => String(s).trim())
    : []

  const projects = Array.isArray(raw.projects)
    ? raw.projects.map((p) => ({
        name: p.name ?? '',
        link: p.link ?? '',
        description: p.description ?? '',
      }))
    : []

  const certifications = Array.isArray(raw.certifications)
    ? raw.certifications.map((c) => ({
        name: c.name ?? '',
        issuer: c.issuer ?? '',
        year: c.year ?? '',
      }))
    : []

  return {
    id: raw.id ?? null,
    template: raw.template || 'classic',
    accentColor: raw.accentColor || '#3d0066',
    personalDetails,
    contactDetails,
    education,
    educationList,
    professionalDetails,
    experienceList,
    skills,
    summary: raw.summary ?? '',
    projects,
    certifications,
  }
}

