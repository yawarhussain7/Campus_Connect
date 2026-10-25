import AuthPage from './Pages/common/AuthPage'
import ForgotPasswordPage from './Pages/common/ForgotPasswordPage'
import ResetPasswordPage from './Pages/common/ResetPasswordPage'
import VerifyEmailPage from './Pages/common/VerifyEmailPage'
import NotFoundPage from './Pages/common/NotFoundPage'
import {Routes,Route} from 'react-router-dom'
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";
import { AppProvider } from './context/AppContext'

import StudentRoute from './Routers/StudentRoute'
import LandingPage from './Pages/home/LandingPage'
import AboutPage from './Pages/home/AboutPage'
import ServicesPage from './Pages/home/ServicesPage'
import ResourcesPage from './Pages/resources/ResourcesPage'

const TOAST_ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <TriangleAlert className="h-5 w-5 text-amber-500" />,
};

const App = () => {
  return (
    <AppProvider>
     <ToastContainer
       position="top-right"
       autoClose={5000}
       limit={4}
       hideProgressBar={false}
       newestOnTop
       closeOnClick
       pauseOnHover
       pauseOnFocusLoss
       draggable
       theme="light"
       transition={Slide}
       icon={({ type }) => TOAST_ICONS[type] || TOAST_ICONS.info}
       toastClassName="unimate-toast"
       bodyClassName="unimate-toast-body"
       progressClassName="unimate-toast-progress"
     />
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/about" element={<AboutPage/>} />
      <Route path="/services" element={<ServicesPage/>} />
      <Route path="/resources" element={<ResourcesPage/>} />
      <Route path="/auth/signIn" element={<AuthPage />} />
      <Route path="/auth/signUp" element={<AuthPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      {/* The verification email links to /verify-email?token=...; the page
          hands the token to the API and reports the outcome. */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/student/*" element={<StudentRoute />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </AppProvider>
  )
}

export default App
