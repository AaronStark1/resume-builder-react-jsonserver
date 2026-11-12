import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/inter'
// Editorial display faces, used by every route: Archivo with its width axis and Playfair italic.
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/playfair/wght-italic.css'
import './index.css'
import './studio/studio.css'
import App from './App.jsx'
import ColorModeProvider from './context/ColorModeProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </StrictMode>,
)
