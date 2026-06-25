import React from 'react'
import AuthPage from './Pages/common/AuthPage'
import {Routes,Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { AppProvider } from './context/AppContext'

import StudentRoute from './Routers/StudentRoute'
import LandingPage from './Pages/home/LandingPage'

const App = () => {
  return (
    <AppProvider>
     <ToastContainer />
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/auth/signIn" element={<AuthPage />} />
      <Route path="/auth/signUp" element={<AuthPage />} />
      <Route path="/student/*" element={<StudentRoute />} />
    </Routes>
    </AppProvider>
  )
}

export default App
