// models/Project.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 120,
      index: true,
    },

    desc: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    // Course code as it appears in the table, e.g. "CS305".
    course: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },

    // Who the project is assigned to, shown as "Assigned To" in the admin
    // console. Optional: student uploads do not set it.
    student: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
      index: true,
    },

    // Deadline as a plain calendar day ("2025-05-05"). Storing a Date here would
    // shift the day for anyone west of Greenwich when the client formats it.
    dueDate: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Submitted", "Overdue"],
      default: "Submitted",
    },

    // Repository / demo link, if the student submitted one.
    repo: {
      type: String,
      trim: true,
      default: "",
    },

    semester: {
      type: String,
      enum: [
        "Semester 1",
        "Semester 2",
        "Semester 3",
        "Semester 4",
        "Semester 5",
        "Semester 6",
        "Semester 7",
        "Semester 8",
      ],
      default: "Semester 1",
    },

    department: {
      type: String,
      trim: true,
      default: "Computer Science",
    },

    // File upload fields (the project archive / report, when one is attached)
    fileUrl: {
      type: String,
      default: null,
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

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
