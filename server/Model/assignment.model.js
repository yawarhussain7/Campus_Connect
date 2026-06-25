import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    title:{
        type:String,
        maxlength:100,
        minlength:3,
        required:true,
        trim:true
    },

    description:{
        type:String,
        required:true,
        trim:true,
        minlength:10
    },
    subject:{
        type:String,
        trim:true,
        required:true,
        minlength:3
    },
    instructor:{
        type:String,
        trim:true,
        minlength:3,
        required:true
    },
    department:{
        type:String,
        default: 'Computer Science',
        trim:true,
        minlength:2
    },
    semester:{
        type:String,
        trim:true,
        default:null
    },
    fileUrl:{
        type:String,
        default:null
    },
},{
    timestamps:true
}

)
const  Assignment_Model = new mongoose.model('Assignments',AssignmentSchema)
export default Assignment_Model