import mongoose from "mongoose";

/**
 * Teacher reviews written by students (see api/review.js on the client and the
 * TeacherReview page that renders them).
 *
 * The display fields are denormalised on the row on purpose: the teacher
 * directory is populated by an on-demand COMSATS scrape, so a review has to keep
 * reading correctly (teacher name, designation, photo, campus) even when that
 * directory has never been synced. `teacherId`/`studentId` are set whenever the
 * matching directory entry / user is known, so the row can still be joined back.
 */
const reviewSchema = new mongoose.Schema(
  {
    // The student's display name — the "Student" column and its filter read this.
    student: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    teacher: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
      index: true,
    },

    // Set when the reviewed teacher exists in the directory.
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherModel",
    },

    // "Professor", "Lecturer", ... — the directory's designation when known.
    teacherRole: {
      type: String,
      trim: true,
      default: "",
    },

    teacherAvatar: {
      type: String,
      trim: true,
      default: "",
    },

    // Campus the course ran at (the directory's, or the one picked in the composer).
    campus: {
      type: String,
      trim: true,
      default: "",
    },

    // "CS305" when the student typed a code, otherwise empty.
    courseCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
      index: true,
    },

    courseName: {
      type: String,
      trim: true,
      default: "",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
    },

    // Term the course ran in, e.g. "Spring 2026".
    semester: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
