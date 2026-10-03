import express from 'express'
import { projectUploadMiddleware } from '../middleware/projectUpload.middleware.js'
import { projectUpload, ShowProjects, downloadProject } from '../Controller/project.controller.js'
import { ProtectedRoute } from '../middleware/verifyToken.js'

const projectRoute = express.Router()

// Multer rejects the wrong file type before the controller runs, so the error is
// turned into the same JSON shape the other responses use.
const uploadFile = (req, res, next) => {
    projectUploadMiddleware.single('file')(req, res, (error) => {
        if (!error) return next()

        return res.status(400).json({
            success: false,
            message: error.message || 'File upload failed'
        })
    })
}

// Protected: the controller stores `uploadedBy: req.user.id`, which was always
// undefined while no token middleware ran on this route.
projectRoute.post('/projects/upload', ProtectedRoute, uploadFile, projectUpload)

projectRoute.get('/projects', ShowProjects)

projectRoute.get('/projects/download/:id', downloadProject)

export default projectRoute
