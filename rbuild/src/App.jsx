import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig, AnimatePresence, motion } from 'motion/react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import GlobalStyles from '@mui/material/GlobalStyles'

import Header from './components/Header'
import Footer from './components/Footer'
import { pageTransition } from './motion/variants'
import { studioVars } from './studio/tokens'

// Studio design tokens as CSS custom properties on <body>, so pages, dialogs and menus all share them.
const studioTokens = <GlobalStyles styles={(theme) => ({ body: studioVars(theme) })} />

// Route-level code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'))
const ResumeGeneratorPage = lazy(() => import('./pages/ResumeGeneratorPage'))
const Form = lazy(() => import('./components/Form'))
const History = lazy(() => import('./pages/History'))
const ResumeView = lazy(() => import('./pages/ResumeView'))
const PageNotFound = lazy(() => import('./pages/PageNotFound'))

const PageFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
    }}
  >
    <CircularProgress color="secondary" />
  </Box>
)

// The landing page brings its own editorial navigation (same colour-mode context and ink toggle).
const AppHeader = () => {
  const { pathname } = useLocation()
  return pathname === '/' ? null : <Header />
}

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: '100%' }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/resume" element={<ResumeGeneratorPage />} />
            <Route path="/resume/:id" element={<ResumeView />} />
            <Route path="/form" element={<Form />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      {studioTokens}
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppHeader />
          <Box component="main" sx={{ flex: 1 }}>
            <AnimatedRoutes />
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
