import fs from "fs";
import path from "path";
import {
  createAssignmentService,
  getAllAssignmentService,
  getAssignmentByIdService,
  getTotalAssignment
} from '../Service/assignment.service.js'

import { assignmentSchemaZod } from "../validation/assign.validation.js";
import { verifyEducationalContent } from "../Service/verifyEducationalContent.service.js";

// CREATE
export const assignmentUpload = async (req, res) => {
  const file = req.file;
  let verifyingContent = false;

  try {
    const validate = assignmentSchemaZod.safeParse(req.body);

    if (!validate.success) {
      if (file?.path) await fs.promises.unlink(file.path).catch(() => {});
      return res.status(400).json({
        success: false,
        errors: validate.error.flatten().fieldErrors,
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "A file is required for educational content verification.",
      });
    }

    verifyingContent = true;
    const verification = await verifyEducationalContent(
      await fs.promises.readFile(file.path),
      {
        mimeType: file.mimetype,
        subject: validate.data.subject,
        resourceType: "assignment",
        metadata: {
          title: validate.data.title,
          description: validate.data.description,
          course: validate.data.course,
          semester: validate.data.semester,
          department: validate.data.department,
        },
      }
    );
    verifyingContent = false;

    if (verification.status !== "approved") {
      await fs.promises.unlink(file.path).catch(() => {});
      return res.status(422).json({
        success: false,
        message: `Upload rejected: ${verification.reason || `the file could not be verified as educational material related to ${validate.data.subject}.`}`,
      });
    }

    const data = {
      ...validate.data,
      fileUrl: file ? `/uploads/assignments/${file.filename}` : null,
      fileName: file?.filename,
      originalName: file?.originalname,
      fileSize: file?.size,
      uploadedBy: req.user?.id,
    };

    const assignment = await createAssignmentService(data);

    res.status(201).json({
      success: true,
      message: "Assignment uploaded successfully",
      data: assignment,
    });
  } catch (error) {
    if (file?.path) await fs.promises.unlink(file.path).catch(() => {});
    res.status(verifyingContent ? 503 : 500).json({
      success: false,
      message: verifyingContent
        ? "Educational content verification is unavailable. Please try again later."
        : error.message,
    });
  }
};

// GET ALL
export const ShowAssignments = async (req, res) => {
  try {
    const assignments = await getAllAssignmentService();

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DOWNLOAD (SECURE FIX)
export const downloadAssignment = async (req, res) => {
  try {
    const assignment = await getAssignmentByIdService(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const filePath = path.join(
      process.cwd(),
      assignment.fileUrl.replace(/^\//, "")
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    return res.download(filePath, assignment.originalName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getTotalAssignmentController = async(req,res)=>{
  try{
      const counter = await getTotalAssignment()
      return res.status(200).json({
        message:'assignment fetch successfully',
        success:true,
        data:counter
      })
  }catch(error){
     res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}