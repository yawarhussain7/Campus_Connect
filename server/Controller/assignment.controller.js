import fs from "fs";
import path from "path";
import {
  createAssignmentService,
  getAllAssignmentService,
  getAssignmentByIdService,
} from '../Service/assignment.service.js'

import { assignmentSchemaZod } from "../validation/assign.validation.js";

// CREATE
export const assignmentUpload = async (req, res) => {
  try {
    const validate = assignmentSchemaZod.safeParse(req.body);

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        errors: validate.error.flatten().fieldErrors,
      });
    }

    const file = req.file;

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
    res.status(500).json({ success: false, message: error.message });
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