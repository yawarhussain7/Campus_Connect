import express from 'express'
import {PaperUploadMiddleware} from '../middleware/PaperUpload.middleware.js'
import {PaperUpload,GetPaper,downloadPaper} from '../Controller/paper.controller.js'
import { ProtectedRoute } from '../middleware/verifyToken.js'

const paperRoute  = express.Router()

// Multer errors (disallowed type, oversize file) are reported as JSON instead
// of falling through to the default HTML error page.
const uploadFile = (req, res, next) => {
    PaperUploadMiddleware.single('file')(req, res, (error) => {
        if (!error) return next()

        return res.status(400).json({
            success: false,
            message: error.message || 'File upload failed'
        })
    })
}

// Protected: the controller stores `uploadedBy: req.user.id`.
paperRoute.post("/past-papers/upload", ProtectedRoute, uploadFile, PaperUpload)

paperRoute.get('/past-papers',GetPaper)

// Kept under /past-papers so it cannot collide with the assignment download
// route (/student/download/:id), which was registered first and therefore
// swallowed every paper download request.
paperRoute.get('/past-papers/download/:id', downloadPaper)

export default paperRoute
