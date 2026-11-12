export const sections = [
  {
    key: 'personalDetails',
    title: 'Basic Information',
    fields: [
      { name: 'name', label: 'Full Name', required: true },
      { name: 'title', label: 'Job Title' },
      { name: 'location', label: 'Location' },
    ],
  },
  {
    key: 'contactDetails',
    title: 'Contact Details',
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
      { name: 'github', label: 'GitHub URL', type: 'url' },
      { name: 'linkedIn', label: 'LinkedIn URL', type: 'url' },
      { name: 'portfolio', label: 'Portfolio URL', type: 'url' },
    ],
  },
  {
    key: 'education',
    title: 'Education Details',
    fields: [
      { name: 'course', label: 'Course / Degree', required: true },
      { name: 'college', label: 'College / School' },
      { name: 'university', label: 'University / Board' },
      { name: 'year', label: 'Graduation Year' },
    ],
  },
  {
    key: 'professionalDetails',
    title: 'Work Experience',
    fields: [
      { name: 'jobTitle', label: 'Job Title' },
      { name: 'company', label: 'Company Name' },
      { name: 'location', label: 'Location' },
      { name: 'duration', label: 'Duration (e.g. Jan 2023 - Present)' },
    ],
  },
]

