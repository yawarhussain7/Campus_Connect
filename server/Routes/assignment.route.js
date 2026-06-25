import express from 'express';
import { assignmentUpload } from '../Controller/assignment.controller.js';
import { assignmentUploadMiddleware } from '../middleware/assignUpload.middleware.js';

const assign_Route = express.Router();

assign_Route.post(
    '/upload',
    assignmentUploadMiddleware.single('file'),
    assignmentUpload
);

export default assign_Route;