import express from "express";
import {
  assignmentUpload,
  ShowAssignments,
  downloadAssignment,
} from "../Controller/assignment.controller.js";

import { assignmentUploadMiddleware } from "../middleware/assignUpload.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  assignmentUploadMiddleware.single("file"),
  assignmentUpload
);

router.get("/assignments", ShowAssignments);

// FIXED: use ID instead of filename
router.get("/download/:id", downloadAssignment);

export default router;