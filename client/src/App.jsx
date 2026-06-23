import React from 'react'
import AuthPage from './Pages/common/AuthPage'
import {Routes,Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify";


import StudentRoute from './Routers/StudentRoute'
import LandingPage from './Pages/home/LandingPage'

const App = () => {
  // Temporary user role — replace with actual auth logic
  const userRole = 'user'

  return (
    <>
     <ToastContainer />
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/auth/signIn" element={<AuthPage />} />
      <Route path="/auth/signUp" element={<AuthPage />} />
      <Route path="/student/*" element={<StudentRoute userRole={userRole} />} />
    </Routes>
   
    </>
  )
}

export default App
