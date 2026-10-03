import fs from "fs";
import path from "path";
import {
    createProjectService,
    getAllProjectService,
    getProjectByIdService,
    getTotalProjectService
} from '../Service/project.service.js'

import { ProjectSchemaZod } from "../validation/project.validation.js";

// CREATE (multipart/form-data; the file itself is optional)
export const projectUpload = async (req, res) => {
    try {
        const validate = ProjectSchemaZod.safeParse(req.body);

        if (!validate.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data',
                errors: validate.error.flatten().fieldErrors,
            });
        }

        const file = req.file;

        // A project has to point somewhere: either the uploaded file or a repo.
        if (!file && !validate.data.repo) {
            return res.status(400).json({
                success: false,
                message: 'Attach a project file or add a repository link',
            });
        }

        const data = {
            ...validate.data,
            fileUrl: file ? `/uploads/projects/${file.filename}` : null,
            fileName: file?.filename,
            originalName: file?.originalname,
            fileSize: file?.size,
            uploadedBy: req.user?.id,
        };

        const project = await createProjectService(data);

        res.status(201).json({
            success: true,
            message: "Project uploaded successfully",
            data: project,
        });
    } catch (error) {
        console.error('Project upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload project',
        });
    }
};

// GET ALL
export const ShowProjects = async (req, res) => {
    try {
        const projects = await getAllProjectService();

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DOWNLOAD (kept under /projects so it cannot shadow the other download routes)
export const downloadProject = async (req, res) => {
    try {
        const project = await getProjectByIdService(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (!project.fileUrl) {
            return res.status(404).json({
                success: false,
                message: "This project has no file attached",
            });
        }

        const filePath = path.join(
            process.cwd(),
            project.fileUrl.replace(/^\//, "")
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server',
            });
        }

        return res.download(filePath, project.originalName);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const projectCountController = async(req,res)=>{
    try{
        const NoOfProject = await getTotalProjectService()
        if(!NoOfProject){
            res.status(404).json({
                message:'no project found'
            })
        }

        return res.status(200).json({
            message:'project data found successfully',
            success:true,
            data:NoOfProject
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}