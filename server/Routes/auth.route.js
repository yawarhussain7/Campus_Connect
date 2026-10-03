import express from 'express'
import {registerController,loginController, logoutController,forgotPasswordController,resetPasswordController} from '../Controller/auth.controller.js'

const authRoute = express.Router()

authRoute.post('/signUp',registerController)
authRoute.post('/signIn',loginController)
authRoute.post('/logout', logoutController)
authRoute.post('/forget-password',forgotPasswordController)
authRoute.post('/reset-password/:token',resetPasswordController)

export default authRoute
