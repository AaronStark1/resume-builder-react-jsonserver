import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

import { ease } from '../motion/variants'
import { useColorMode } from '../context/useColorMode'
import ThemeToggleIcon from './ThemeToggleIcon'
import { CtaLink } from './studio/Bits'
import { scrollToSection } from './landing/hooks'

/**
 * One set of links on every route, so the bar never changes size. `section` is a section of the
 * landing page: on the landing page the link scrolls to it; elsewhere it goes to `to` (or, with
 * no route of its own, to that section of the landing page).
 */
const LINKS = [
  { label: 'About', section: 'journey' },
  { label: 'Templates', section: 'templates', to: '/resume' },
  { label: 'Studio', to: '/form' },
  { label: 'Archive', to: '/history' },
]

/** A saved resume (/resume/:id) belongs to the archive. */
const sectionOf = (pathname) => (pathname.startsWith('/resume/') ? '/history' : pathname)

const NavItem = ({ link, onHome, current, onNavigate }) => {
  if (onHome && link.section) {
    return (
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
  }
  return (
    <Link
      to={link.to ?? { pathname: '/', hash: `#${link.section}` }}
      aria-current={link.to && current === link.to ? 'page' : undefined}
      onClick={onNavigate}
    >
      {link.label}
    </Link>
  )
}

/**
 * The application's only header: the floating editorial pill navigation, fixed above every route.
 * It is rendered once in App.jsx, outside the route transition, so it never remounts, resizes or
 * moves when the page changes.
 *
 * `data-ink-ignore` keeps it out of the ink transition's snapshots: while the ink spreads the
 * header sits above the canvas, live, so the theme toggle morphs in place with nothing baked
 * into the texture underneath it.
 */
const Header = () => {
  const { pathname } = useLocation()
  const { mode, toggleColorMode, prepareColorModeToggle } = useColorMode()
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const themeLabel = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  const onHome = pathname === '/'
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
    <header className="lpn" data-ink-ignore="true">
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
          onClick={() => {
            close()
            if (onHome) window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <span className="lp-serif">r</span>Build
        </Link>

        <ul className="lpn__pill">
          {LINKS.map((link) => (
            <li key={link.label}>
              <NavItem link={link} onHome={onHome} current={current} />
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
            onClick={() => setOpen((value) => !value)}
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
                  <NavItem link={link} onHome={onHome} current={current} onNavigate={close} />
                </li>
              ))}
            </ul>
            <CtaLink to="/form" size="md" onClick={close}>
              Get started
            </CtaLink>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default Header
