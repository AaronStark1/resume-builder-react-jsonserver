import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

import { ease } from '../motion/variants'
import { useColorMode } from '../context/useColorMode'
import ThemeToggleIcon from './ThemeToggleIcon'
import { CtaLink } from './studio/Bits'

const LINKS = [
  { label: 'Studio', to: '/form' },
  { label: 'Archive', to: '/history' },
  { label: 'Templates', to: '/resume' },
]

/** A saved resume (/resume/:id) belongs to the archive. */
const sectionOf = (pathname) => (pathname.startsWith('/resume/') ? '/history' : pathname)

/**
 * Global header for the inner routes: the landing page's navigation language (wordmark, pill
 * navigation, theme toggle, tomato call to action) as a sticky frosted bar. The landing page
 * itself renders LandingNavigation instead (see App.jsx).
 */
const Header = () => {
  const { pathname } = useLocation()
  const { mode, toggleColorMode, prepareColorModeToggle } = useColorMode()
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const themeLabel = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  const current = sectionOf(pathname)

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

  const close = () => setOpen(false)

  return (
    <header className="lpn lpn--app">
      <nav className="lpn__bar" aria-label="Primary">
        <Link to="/" className="lpn__brand" aria-label="rBuild — home" onClick={close}>
          <span className="lpn__mono" aria-hidden="true">
            rB
          </span>
          rBuild
        </Link>

        <ul className="lpn__pill">
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} aria-current={current === link.to ? 'page' : undefined}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="lpn__actions">
          {/* Intent to toggle (hover / focus / press) lets the ink snapshot the page before the click lands. */}
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
          <CtaLink to="/form" size="sm" className="lpn__cta" onClick={close}>
            Start building
          </CtaLink>
          <button
            ref={menuButtonRef}
            type="button"
            className="lpn__icon lpn__menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="lpn-app-sheet"
            data-open={open ? '' : undefined}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="lpn-app-sheet"
            className="lpn__sheet"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease }}
          >
            <ul>
              {[{ label: 'Home', to: '/' }, ...LINKS].map((link, index) => (
                <li key={link.to}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <Link to={link.to} onClick={close} aria-current={current === link.to ? 'page' : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <CtaLink to="/form" size="md" onClick={close}>
              Start building
            </CtaLink>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default Header
