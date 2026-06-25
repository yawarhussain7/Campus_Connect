import express from 'express'
import {registerController,loginController, logoutController} from '../Controller/auth.controller.js'

const authRoute = express.Router()

authRoute.post('/signUp',registerController)
authRoute.post('/signIn',loginController)
authRoute.post('/logout', logoutController)

export default authRoute
