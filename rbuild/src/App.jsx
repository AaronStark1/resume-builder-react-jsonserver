import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PageNotFound from './pages/PageNotFound'
import History from './pages/History'
import ResumeGeneratorPage from './pages/ResumeGeneratorPage'
import ResumeView from './pages/ResumeView'
import Header from './components/Header'
import Footer from './components/Footer'
import Form from './components/Form'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/resume" element={<ResumeGeneratorPage />} />
        <Route path="/resume/:id" element={<ResumeView />} />
        <Route path="/form" element={<Form />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
