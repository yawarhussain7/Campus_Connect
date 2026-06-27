// models/PastPaper.js
import mongoose from "mongoose";

const PastPaperSchema = new mongoose.Schema(
  {
    //  Your form fields (exactly matching)
    subjectTitle: {
      type: String,
      required: [true, "Subject title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
      index: true,
    },

    courseInstructor: {
      type: String,
      required: [true, "Course instructor is required"],
      trim: true,
    },

    semester: {
      type: String,
      required: true,
      enum: ["Semester 1", "Semester 2", "Summer", "Winter"],
      default: "Semester 1",
    },

    examType: {
      type: String,
      required: [true, "Exam type is required"],
      enum: ["Midterm", "Final", "Quiz", "Assignment", "Other"],
      default: "Midterm",
    },

    academicYear: {
      type: Number,
      required: [true, "Academic year is required"],
      min: 2000,
      max: new Date().getFullYear() + 1,
    },

    includesSolutions: {
      type: Boolean,
      default: false,
    },

    //  File upload fields
    fileUrl: {
      type: String,
      required: true,
    },

    fileOriginalName: {
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

//  ES Module export
const PastPaper = mongoose.model("PastPaper", PastPaperSchema);
export default PastPaper;