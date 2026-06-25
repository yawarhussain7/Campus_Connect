import { assignmentService,getAllAssignment } from '../Service/assignment.service.js';
import { assignmentSchemaZod } from '../validation/assign.validation.js';
import path from 'path';
import fs from 'fs';

export const assignmentUpload = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Request body is empty'
            });
        }

        // Zod Validation
        const validationResult = assignmentSchemaZod.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationResult.error.flatten().fieldErrors
            });
        }

        const assignmentData = {
            ...validationResult.data,
            fileUrl: req.file ? `/uploads/assignments/${req.file.filename}` : validationResult.data.fileUrl
        };

        const assignment = await assignmentService(assignmentData);

        return res.status(201).json({
            success: true,
            message: 'Assignment uploaded successfully',
            data: assignment
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

export const ShowAssignments = async(req,res)=>{
    try{
        const assignments = await getAllAssignment()
        res.status(200).send({
            message:'assignments fetch successfully',
            success:true,
        assignments
        })
    }catch(error){
        res.status(500).send({
            message:'assignment fetch failed',
            success:false,
            error: error.message
        })
    }
}

export const downloadAssignment = async (req, res) => {
    try {
        const { filename } = req.params;
        
        console.log('Download request received for filename:', filename);
        console.log('Current working directory:', process.cwd());
        
        const filePath = path.join(process.cwd(), 'uploads', 'assignments', filename);
        
        console.log('Attempting to download file from:', filePath);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error('File not found at:', filePath);
            return res.status(404).json({
                success: false,
                message: 'File not found',
                path: filePath
            });
        }
        
        // Get file stats
        const stats = fs.statSync(filePath);
        console.log('File stats:', { size: stats.size, isFile: stats.isFile() });
        
        // Set headers for file download
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', stats.size);
        
        // Create read stream and pipe to response
        const readStream = fs.createReadStream(filePath);
        
        readStream.on('error', (error) => {
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error streaming file',
                    error: error.message
                });
            }
        });
        
        readStream.pipe(res);
        
    } catch (error) {
        console.error('Download error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Error downloading file',
                error: error.message
            });
        }
    }
};
