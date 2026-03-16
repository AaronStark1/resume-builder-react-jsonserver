import { useState } from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage';
import PageNotFound from './pages/PageNotFound';
import History from './pages/History';
import ResumeGeneratorPage from './pages/ResumeGeneratorPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Form from './components/Form';
import Edit from './components/Edit';

function App() {

  return (
    <>

      <BrowserRouter>
            <Header/>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='*' element={<PageNotFound/>} />
          <Route path='/resume' element={<ResumeGeneratorPage/>}/>
          <Route path='/form' element={<Form/>}/>
          <Route path='/history' element={<History/>}/>
          <Route path='/edit' element={<Edit/>}/>
        </Routes>
              <Footer/>
      </BrowserRouter>

    </>
  )
}

export default App
