import { success } from 'zod'
import { CreatePaperService, GetPastPaperService, GetPaperByIdService } from '../Service/paper.service.js'
import { PastPaperSchemaZod } from '../validation/paper.validatoin.js'
import fs from 'fs'
import path from 'path'



export const PaperUpload = async (req, res) => {
    try {
        
        // Convert string values to appropriate types for validation
        const bodyData = {
            ...req.body,
            year: req.body.year ? parseInt(req.body.year) : undefined,
            hasSolution: req.body.hasSolution === 'true' || req.body.hasSolution === true
        }
        
        const validate = PastPaperSchemaZod.safeParse(bodyData)
        if (!validate.success) {
            return res.status(400).json({
                message: 'invalid data',
                success: false,
                error: validate.error.flatten().fieldErrors
            })
        }

        const file = req.file;

        const data = {
            ...validate.data,
            fileUrl: file ? `/uploads/papers/${file.filename}` : null,
            fileName: file?.filename,
            originalName: file?.originalname,
            fileSize: file?.size,
            uploadedBy: req.user?.id,
        }

        const paper = await CreatePaperService(data)

        res.status(201).json({
            success: true,
            message: "Paper uploaded successfully",
            data: paper
        })
    } catch (error) {
        console.error('Paper upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload paper'
        })
    }
}

export const GetPaper = async (req, res) => {
    try {
        const papers = await GetPastPaperService()
        res.status(200).json({
            success: true,
            count: papers.length,
            data: papers
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


// donwload 
export const downloadPaper = async(req,res)=>{
    try{
        const paper = await GetPaperByIdService(req.params.id);

        if(!paper){
            return status(404).json({
                success:false,
                message:"Paper not found"
            });
        }

        const filePath = path.join(
            process.cwd(),paper.fileUrl.replace(/^\//,"")
        )

        if(!fs.existsSync(filePath)){
            return res.status(404).json({
                success:false,
                message:'File not found on server'
            })
        }

        return res.download(filePath,paper.originalName)

    }catch(error){
        res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}