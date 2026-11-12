import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { flushSync } from 'react-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ColorModeContext } from './ColorModeContext'
import { getAppTheme } from '../theme'
import { crossFadeTheme } from '../ink/themeFade'

const STORAGE_KEY = 'rbuild_theme_mode'
const ENGINE_IDLE_DELAY_MS = 1500

const otherMode = (mode) => (mode === 'dark' ? 'light' : 'dark')

const readSavedMode = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'dark' || saved === 'light' ? saved : null
  } catch {
    return null
  }
}

const systemMode = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

// The WebGL ink engine is its own chunk, loaded in idle time or on the first toggle intent.
const loadInkEngine = () => import('../ink/InkTransition')

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => readSavedMode() ?? systemMode())
  const modeRef = useRef(mode) // the theme applied to the DOM right now
  const inkRef = useRef(null) // InkTransition, once loaded
  const loadRef = useRef(null) // pending engine load

  /** Commits a theme synchronously: the ink flips the DOM in the same task as its first frame. */
  const commitMode = useCallback((next) => {
    modeRef.current = next
    document.documentElement.setAttribute('data-theme', next)
    flushSync(() => setMode(next))
  }, [])

  const ensureInk = useCallback(() => {
    if (inkRef.current) return Promise.resolve(inkRef.current)
    if (!loadRef.current) {
      const pending = loadInkEngine()
        .then(({ InkTransition }) => {
          if (loadRef.current !== pending) return null // unmounted while loading
          inkRef.current = new InkTransition({ getTheme: () => modeRef.current, applyTheme: commitMode })
          return inkRef.current
        })
        .catch(() => {
          if (loadRef.current === pending) loadRef.current = null
          return null
        })
      loadRef.current = pending
    }
    return loadRef.current
  }, [commitMode])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  // Load the engine once the page has settled; it tears down its canvas and context on unmount.
  useEffect(() => {
    const timer = window.setTimeout(() => void ensureInk(), ENGINE_IDLE_DELAY_MS)
    return () => {
      window.clearTimeout(timer)
      inkRef.current?.destroy()
      inkRef.current = null
      loadRef.current = null
    }
  }, [ensureInk])

  // Follow OS theme changes until the user has explicitly picked a theme.
  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mediaQuery?.addEventListener) return undefined
    const handleChange = (e) => {
      if (readSavedMode()) return
      const next = e.matches ? 'dark' : 'light'
      if (inkRef.current) inkRef.current.set(next)
      else if (modeRef.current !== next) crossFadeTheme(() => commitMode(next))
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [commitMode])

  /** Click handler for theme toggles: the ink spreads from the click (or the button, for keyboard). */
  const toggleColorMode = useCallback(
    (event) => {
      const element = event?.currentTarget instanceof Element ? event.currentTarget : null
      const point =
        event?.detail > 0 && Number.isFinite(event.clientX) ? { x: event.clientX, y: event.clientY } : undefined
      let next
      if (inkRef.current) {
        next = inkRef.current.toggle({ point, element })
      } else {
        next = otherMode(modeRef.current)
        crossFadeTheme(() => commitMode(next))
        void ensureInk()
      }
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore (private mode / storage disabled)
      }
    },
    [commitMode, ensureInk],
  )

  /** Hover / focus / pointer-down on a toggle: prepare the ink so the click starts instantly. */
  const prepareColorModeToggle = useCallback(() => {
    if (inkRef.current) inkRef.current.prepare()
    else void ensureInk().then((ink) => ink?.prepare())
  }, [ensureInk])

  const colorMode = useMemo(
    () => ({ mode, toggleColorMode, prepareColorModeToggle }),
    [mode, toggleColorMode, prepareColorModeToggle],
  )

  const theme = useMemo(() => getAppTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default ColorModeProvider
