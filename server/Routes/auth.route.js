import express from 'express'
import {registerController,loginController} from '../Controller/auth.controller.js'

const authRoute = express.Router()

authRoute.post('/signUp',registerController)

authRoute.post('/signIn',loginController)

export default authRoute