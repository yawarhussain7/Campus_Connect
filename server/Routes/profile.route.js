import express from 'express'
import { ProtectedRoute } from '../middleware/verifyToken.js'
import { getProfileController, updateProfileController } from '../Controller/profile.controller.js'

const profileRoute = express.Router()

profileRoute.get('/me', ProtectedRoute, getProfileController)
profileRoute.put('/update', ProtectedRoute, updateProfileController)

export default profileRoute