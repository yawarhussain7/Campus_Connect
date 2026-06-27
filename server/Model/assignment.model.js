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