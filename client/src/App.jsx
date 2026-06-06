import React from 'react'
import AuthPage from './Pages/common/AuthPage'
import {Routes,Route} from 'react-router-dom'


import StudentRoute from './Routers/StudentRoute'
import LandingPage from './Pages/home/LandingPage'

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/student/*" element={<StudentRoute />} />
    </Routes>
   
    </>
  )
}

export default App