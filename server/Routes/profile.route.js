import express from 'express'
import { ProtectedRoute } from '../middleware/verifyToken.js'
import { profileUploadMiddleware } from '../middleware/profileUpload.middleware.js'
import { getProfileController, updateProfileController } from '../Controller/profile.controller.js'

const profileRoute = express.Router()

// The profile picture arrives as multipart/form-data. Multer rejects a
// disallowed type or an oversize image before the controller runs, so the
// error is turned into the same JSON shape the rest of the API uses.
const uploadAvatar = (req, res, next) => {
    profileUploadMiddleware.single('avatar')(req, res, (error) => {
        if (!error) return next()

        return res.status(400).json({
            success: false,
            message: error.message || 'Profile image upload failed'
        })
    })
}

profileRoute.get('/me', ProtectedRoute, getProfileController)
profileRoute.put('/update', ProtectedRoute, uploadAvatar, updateProfileController)

export default profileRoute