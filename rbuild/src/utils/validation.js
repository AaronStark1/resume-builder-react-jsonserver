export const isValidEmail = (email) => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export const isValidPhone = (phone) => {
  if (!phone) return true // optional
  const trimmed = phone.trim()
  if (!trimmed) return true
  // Allow digits, spaces, +, - with 7 to 15 digits
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (digitsOnly.length < 7 || digitsOnly.length > 15) return false
  const phonePattern = /^[+\d\s-]+$/
  return phonePattern.test(trimmed)
}

export const normalizeUrl = (url) => {
  if (!url) return ''
  let trimmed = url.trim()
  if (!trimmed) return ''
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`
  }
  return trimmed
}

export const isValidUrl = (url) => {
  if (!url) return true // optional
  const trimmed = url.trim()
  if (!trimmed) return true
  try {
    const parsed = new URL(normalizeUrl(trimmed))
    return Boolean(parsed.hostname)
  } catch {
    return false
  }
}

export const isValidYear = (year) => {
  if (!year) return true // optional
  const trimmed = String(year).trim()
  if (!trimmed) return true
  if (!/^\d{4}$/.test(trimmed)) return false
  const num = parseInt(trimmed, 10)
  const currentYear = new Date().getFullYear()
  return num >= 1950 && num <= currentYear + 6
}

export const validateStep = (step, formData) => {
  const errors = {}

  if (step === 0) {
    // Basics
    if (!formData.personalDetails?.name?.trim()) {
      errors.name = 'Full Name is required'
    }
  } else if (step === 1) {
    // Contact
    const email = formData.contactDetails?.email
    if (!email?.trim()) {
      errors.email = 'Email address is required'
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com)'
    }

    const phone = formData.contactDetails?.phoneNumber
    if (phone && !isValidPhone(phone)) {
      errors.phoneNumber = 'Enter a valid phone number (7-15 digits)'
    }

    const urls = ['github', 'linkedIn', 'portfolio']
    urls.forEach((key) => {
      const val = formData.contactDetails?.[key]
      if (val && !isValidUrl(val)) {
        errors[key] = 'Please enter a valid URL'
      }
    })
  } else if (step === 2) {
    // Education
    if (!formData.education?.course?.trim()) {
      errors.course = 'Course / Degree is required'
    }
    const year = formData.education?.year
    if (year && !isValidYear(year)) {
      const maxYear = new Date().getFullYear() + 6
      errors.year = `Year must be 4 digits between 1950 and ${maxYear}`
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
