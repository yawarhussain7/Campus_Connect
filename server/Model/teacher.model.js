import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },

    // COMSATS faculty id (FacultyDetails.aspx?Uid=...). It is the natural key, so
    // re-scraping refreshes a teacher instead of duplicating them. Sparse keeps
    // manually added teachers (without a uid) valid.
    uid: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    // "Professor", "HOD / Tenured Associate Professor", ...
    designation: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    campus: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      trim: true,
    },

    profileUrl: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      default: "COMSATS",
    },

    lastScrapedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }


)

const TeacherModel =  mongoose.model('TeacherModel',teacherSchema)
export default TeacherModel