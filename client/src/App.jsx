import React from 'react'
import AuthPage from './Pages/common/AuthPage'
import ForgotPasswordPage from './Pages/common/ForgotPasswordPage'
import ResetPasswordPage from './Pages/common/ResetPasswordPage'
import {Routes,Route,Navigate} from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { AppProvider } from './context/AppContext'

import StudentRoute from './Routers/StudentRoute'
import LandingPage from './Pages/home/LandingPage'
import ResourcesPage from './Pages/resources/ResourcesPage'

const App = () => {
  return (
    <AppProvider>
     <ToastContainer />
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/resources" element={<ResourcesPage/>} />
      <Route path="/auth/signIn" element={<AuthPage />} />
      <Route path="/auth/signUp" element={<AuthPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/student/*" element={<StudentRoute />} />
      {/* Unmatched URLs used to render an empty page (plus a console warning)
          instead of taking the visitor somewhere useful. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </AppProvider>
  )
}

export default App
