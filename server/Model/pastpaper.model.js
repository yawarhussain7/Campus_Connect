// models/PastPaper.js
import mongoose from "mongoose";

const PastPaperSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
      index: true,
    },

    instructor: {
      type: String,
      required: [true, "Instructor is required"],
      trim: true,
    },

    semester: {
      type: String,
      required: true,
      enum: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"],
      default: "Semester 1",
    },
 year: {
      type: Number,
      required: [true, "Year is required"],
      min: 2000,
      max: new Date().getFullYear() + 1,
    },
    exam: {
      type: String,
      required: [true, "Exam type is required"],
      enum: ["Mid", "Final"],
      default: "Mid",
    },

   

    hasSolution: {
      type: Boolean,
      default: false,
    },

    batch: {
      type: String,
      required: [true, "Batch is required"],
      trim: true,
    },

    //  File upload fields
    fileUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      trim: true,
    },

    originalName: {
      type: String,
      trim: true,
    },

    fileSize: {
      type: Number,
      min: 0,
    },

    //  Extra useful fields
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    department: {
      type: String,
      default: "Computer Science",
    }


  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


const PastPaper = mongoose.model("PastPaper", PastPaperSchema);
export default PastPaper;