import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'

import '../components/landing/landing.css'

import { usePageTitle } from '../utils/usePageTitle'
import HeroSection from '../components/landing/HeroSection'
import FeaturedTemplatesSection from '../components/landing/FeaturedTemplatesSection'
import ResumeJourneySection from '../components/landing/ResumeJourneySection'
import { landingVars } from '../components/landing/landingTokens'

/**
 * Landing page: one story in three sections.
 *   1. Hero — "Your story. Your next move."
 *   2. Featured templates — four flagship templates as a pinned 3D stack.
 *   3. Resume journey — "From blank to brilliant", ending in the finished page.
 */
const LandingPage = () => {
  usePageTitle('Smart Resume Builder')
  const { hash } = useLocation()
  const navigate = useNavigate()

  // Arriving from another route with a section in the URL (the header's "About"): go straight
  // there, then drop the hash so it doesn't outlive the visit to that section.
  useEffect(() => {
    if (!hash) return undefined
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
      navigate({ pathname: '/', hash: '' }, { replace: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hash, navigate])

  return (
    <Box className="lp" sx={landingVars}>
      <HeroSection />
      <FeaturedTemplatesSection />
      <ResumeJourneySection />
    </Box>
  )
}

export default LandingPage
