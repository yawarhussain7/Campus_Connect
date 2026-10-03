import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      default: "Computer Science",
    },

    semester: {
      type: String,
      default: "1",
    },

    // Course code as it appears in the assignments table, e.g. "CS305".
    course: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    // Deadline as a plain calendar day ("2025-05-05"). Storing a Date would shift
    // the day for anyone west of Greenwich when the client formats it.
    dueDate: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Submitted", "Overdue"],
      default: "Pending",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: String,
    originalName: String,
    fileSize: Number,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Assignment_Model = mongoose.model("Assignment", AssignmentSchema);

export default Assignment_Model;