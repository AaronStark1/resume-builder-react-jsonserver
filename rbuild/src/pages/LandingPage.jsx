import Box from '@mui/material/Box'

import '../components/landing/landing.css'

import { usePageTitle } from '../utils/usePageTitle'
import LandingNavigation from '../components/landing/LandingNavigation'
import HeroSection from '../components/landing/HeroSection'
import FeaturedTemplatesSection from '../components/landing/FeaturedTemplatesSection'
import ResumeJourneySection from '../components/landing/ResumeJourneySection'
import { landingVars } from '../components/landing/landingTokens'

/**
 * Landing page: one story in three sections.
 *   1. Hero — "Your story. Your next move."
 *   2. Featured templates — the three real templates as a pinned 3D stack.
 *   3. Resume journey — "From blank to brilliant", ending in the finished page.
 */
const LandingPage = () => {
  usePageTitle('Smart Resume Builder')

  return (
    <>
      <LandingNavigation />
      <Box className="lp" sx={landingVars}>
        <HeroSection />
        <FeaturedTemplatesSection />
        <ResumeJourneySection />
      </Box>
    </>
  )
}

export default LandingPage
