import express from 'express'
import {PaperUploadMiddleware} from '../middleware/PaperUpload.middleware.js'
import {PaperUpload,GetPaper,downloadPaper} from '../Controller/paper.controller.js'

const paperRoute  = express.Router()
paperRoute.post("/past-papers/upload",PaperUploadMiddleware.single('file'),PaperUpload)

paperRoute.get('/past-papers',GetPaper)

paperRoute.get('/download/:id/',downloadPaper)

export default paperRoute
