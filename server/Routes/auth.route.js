import express from 'express'
import {registerController,loginController, logoutController,forgotPasswordController,resetPasswordController,sendVerification,verifyEmail} from '../Controller/auth.controller.js'

const authRoute = express.Router()

authRoute.post('/signUp',registerController)
authRoute.post('/signIn',loginController)
authRoute.post('/logout', logoutController)
authRoute.post('/forget-password',forgotPasswordController)
authRoute.post('/reset-password/:token',resetPasswordController)

// The emailed link opens the frontend page, which calls this public GET with
// the one-time token (?token=...). No session is required — the token itself
// is the credential.
authRoute.get('/verify-email', verifyEmail)
// Resend works both signed-in (Settings) and signed-out (right after signup,
// where no session exists yet — login is locked until the address is
// verified), so no auth middleware here; the handler picks the right path.
authRoute.post('/verify-email/resend', sendVerification)

export default authRoute
