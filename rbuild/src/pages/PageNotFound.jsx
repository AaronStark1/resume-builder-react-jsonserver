import { motion } from 'motion/react'
import { usePageTitle } from '../utils/usePageTitle'
import { ease } from '../motion/variants'
import { CtaLink, EditorialLink } from '../components/studio/Bits'

const PageNotFound = () => {
  usePageTitle('Page Not Found')

  return (
    <div className="st st-page">
      <motion.div
        className="st-state st-lost"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <p className="lp-eyebrow">Page not found</p>
        <h1 className="lp-display st-lost__code">404</h1>
        <p className="st-sub">This page isn’t in the archive.</p>
        <p className="st-note">
          The page you are looking for doesn&apos;t exist, has been removed, or the link is broken.
        </p>
        <div className="st-lost__actions">
          <CtaLink to="/">Back to Home</CtaLink>
          <EditorialLink to="/history">Open the archive</EditorialLink>
        </div>
      </motion.div>
    </div>
  )
}

export default PageNotFound
