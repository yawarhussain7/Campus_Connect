import express from 'express'
import { ProtectedRoute } from '../middleware/verifyToken.js'
import { uploadAvatar } from '../middleware/profileUpload.middleware.js'
import { getProfileController, updateProfileController } from '../Controller/profile.controller.js'

const profileRoute = express.Router()

profileRoute.get('/me', ProtectedRoute, getProfileController)
// The profile picture arrives as multipart/form-data; the shared uploadAvatar
// middleware turns a multer rejection into the API's JSON error shape.
profileRoute.put('/update', ProtectedRoute, uploadAvatar, updateProfileController)

export default profileRoute