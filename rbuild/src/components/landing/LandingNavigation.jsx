import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Box from '@mui/material/Box'

import { ease } from '../../motion/variants'
import { useColorMode } from '../../context/useColorMode'
import ThemeToggleIcon from '../ThemeToggleIcon'
import { CtaLink } from '../studio/Bits'
import { scrollToSection } from './hooks'
import { landingVars } from './landingTokens'

// Every entry is a real destination: two sections of this page and two existing routes.
const LINKS = [
  { label: 'About', section: 'journey' },
  { label: 'Templates', section: 'templates' },
  { label: 'Features', to: '/resume' },
  { label: 'History', to: '/history' },
]

const NavItem = ({ link, onNavigate }) =>
  link.to ? (
    <Link to={link.to} onClick={onNavigate}>
      {link.label}
    </Link>
  ) : (
    <a
      href={`#${link.section}`}
      onClick={(event) => {
        event.preventDefault()
        onNavigate?.()
        scrollToSection(link.section)
      }}
    >
      {link.label}
    </a>
  )

/**
 * Minimal fixed navigation for the landing page. It is portalled to <body> so that the route
 * transition's transform can never capture its `position: fixed`, and it uses the app's existing
 * colour-mode context — the toggle drives the same ink-bleed transition as the shared header.
 */
const LandingNavigation = () => {
  const { pathname } = useLocation()
  const { mode, toggleColorMode, prepareColorModeToggle } = useColorMode()
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const themeLabel = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  // While the landing page plays its exit transition the next route's header is already up.
  if (pathname !== '/') return null

  const close = () => setOpen(false)

  return createPortal(
    <Box component="header" className="lpn" sx={landingVars}>
      <motion.nav
        className="lpn__bar"
        aria-label="Primary"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
      >
        <Link
          to="/"
          className="lpn__brand"
          aria-label="rBuild — home"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="lp-serif">r</span>Build
        </Link>

        <ul className="lpn__pill">
          {LINKS.map((link) => (
            <li key={link.label}>
              <NavItem link={link} />
            </li>
          ))}
        </ul>

        <div className="lpn__actions">
          <button
            type="button"
            className="lpn__icon"
            aria-label={themeLabel}
            title={themeLabel}
            onClick={toggleColorMode}
            onPointerEnter={prepareColorModeToggle}
            onPointerDown={prepareColorModeToggle}
            onFocus={prepareColorModeToggle}
          >
            <ThemeToggleIcon mode={mode} size={18} />
          </button>
          <CtaLink to="/form" size="sm" className="lpn__cta">
            Get started
          </CtaLink>
          <button
            ref={menuButtonRef}
            type="button"
            className="lpn__icon lpn__menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="lpn-sheet"
            data-open={open ? '' : undefined}
            onClick={() => setOpen((current) => !current)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="lpn-sheet"
            className="lpn__sheet"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease }}
          >
            <ul>
              {LINKS.map((link, index) => (
                <li key={link.label}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <NavItem link={link} onNavigate={close} />
                </li>
              ))}
            </ul>
            <CtaLink to="/form" size="md" onClick={close}>
              Get started
            </CtaLink>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Box>,
    document.body,
  )
}

export default LandingNavigation
