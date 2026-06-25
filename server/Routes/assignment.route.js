import express from 'express';
import { assignmentUpload,ShowAssignments, downloadAssignment } from '../Controller/assignment.controller.js';
import { assignmentUploadMiddleware } from '../middleware/assignUpload.middleware.js';

const assign_Route = express.Router();

assign_Route.post(
    '/upload',
    assignmentUploadMiddleware.single('file'),
    assignmentUpload
);
assign_Route.get('/assignments',ShowAssignments)
assign_Route.get('/download/:filename', downloadAssignment)

export default assign_Route;
