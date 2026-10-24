import { CreatePaperService, GetPastPaperService, GetPaperByIdService,GetTotalPapaperService } from '../Service/paper.service.js'
import { PastPaperSchemaZod } from '../validation/paper.validatoin.js'
import { verifyEducationalContent } from '../Service/verifyEducationalContent.service.js'
import fs from 'fs'
import path from 'path'



export const PaperUpload = async (req, res) => {
    const file = req.file;
    let verifyingContent = false;

    try {
        
        // Convert string values to appropriate types for validation
        const bodyData = {
            ...req.body,
            year: req.body.year ? parseInt(req.body.year) : undefined,
            hasSolution: req.body.hasSolution === 'true' || req.body.hasSolution === true
        }
        
        const validate = PastPaperSchemaZod.safeParse(bodyData)
        if (!validate.success) {
            if (file?.path) await fs.promises.unlink(file.path).catch(() => {})
            return res.status(400).json({
                message: 'invalid data',
                success: false,
                error: validate.error.flatten().fieldErrors
            })
        }

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'A file is required for educational content verification.'
            })
        }

        verifyingContent = true;
        const verification = await verifyEducationalContent(
            await fs.promises.readFile(file.path),
            {
                mimeType: file.mimetype,
                subject: validate.data.subject,
                resourceType: 'past examination paper',
                metadata: {
                    exam: validate.data.exam,
                    semester: validate.data.semester,
                    year: validate.data.year,
                    department: validate.data.department
                }
            }
        )
        verifyingContent = false;

        if (verification.status !== 'approved') {
            await fs.promises.unlink(file.path).catch(() => {})
            return res.status(422).json({
                success: false,
                message: `Upload rejected: ${verification.reason || `the file could not be verified as educational material related to ${validate.data.subject}.`}`
            })
        }

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
        if (file?.path) await fs.promises.unlink(file.path).catch(() => {})
        console.error('Paper upload error:', error);
        res.status(verifyingContent ? 503 : 500).json({
            success: false,
            message: verifyingContent
                ? 'Educational content verification is unavailable. Please try again later.'
                : error.message || 'Failed to upload paper'
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
            return res.status(404).json({
                success:false,
                message:"Paper not found"
            });
        }

       
        if(!paper.fileUrl){
            return res.status(404).json({
                success:false,
                message:"This paper has no file attached"
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

export const getTotalPaperController = async(req,res)=>{
    try{
        const totalPaper = await GetTotalPapaperService()
        res.status(200).json({
            message:'total paper fetch successfully',
            success:true,
            data:totalPaper
        })
    }catch(error){
        res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}