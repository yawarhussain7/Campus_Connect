import express from "express";
import {
  assignmentUpload,
  ShowAssignments,
  downloadAssignment,
} from "../Controller/assignment.controller.js";

import { assignmentUploadMiddleware } from "../middleware/assignUpload.middleware.js";
import { ProtectedRoute } from "../middleware/verifyToken.js";

const router = express.Router();

// Multer rejects a disallowed file type or an oversize file before the
// controller runs, so the error is turned into the same JSON shape the rest of
// the API uses.
const uploadFile = (req, res, next) => {
  assignmentUploadMiddleware.single("file")(req, res, (error) => {
    if (!error) return next();

    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed",
    });
  });
};

// Protected: the controller stores `uploadedBy: req.user.id`, which was always
// undefined while no token middleware ran on this route.
router.post("/upload", ProtectedRoute, uploadFile, assignmentUpload);

router.get("/assignments", ShowAssignments);

// FIXED: use ID instead of filename
router.get("/download/:id", downloadAssignment);

export default router;