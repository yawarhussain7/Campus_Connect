import React from 'react'
import AuthPage from './Pages/common/AuthPage'
import {Routes,Route,Navigate} from 'react-router-dom'
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
      {/* Unmatched URLs used to render an empty page (plus a console warning)
          instead of taking the visitor somewhere useful. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </AppProvider>
  )
}

export default App
