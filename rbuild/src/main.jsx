import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'
import ColorModeProvider from './context/ColorModeProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </StrictMode>,
)
