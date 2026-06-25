import { assignmentService } from '../Service/assignment.service.js';
import { assignmentSchemaZod } from '../validation/assign.validation.js';

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