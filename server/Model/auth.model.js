import mongoose from 'mongoose'
import { boolean } from 'zod'
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter username'],
        trim:true,
        minlength:[3,'Username must be at least 3 characters long'],
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        trim:true,
        unique:true,
        lowercase: true,
         match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    isEmailVerified:{
    type:Boolean,
    default:false
    },

    emailVerificationToken:{
        type:String,
        default:null,
        trim:true,
        select:false
    },

    emailVerificationTokenExpire:{
        type:Date,
        default:null,
        select:false
    },

    resetPasswordToken:{
        type:String,
        default:null,
        trim:true
    },
    resetPasswordTokenExpire:{
        type:Date,
        default:null
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        trim:true,
        minlength:[6,'Password must be at least 6 characters long'],
        select:false
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    // Profile picture. Stores the `/uploads/avatars/<file>` path the static
    // route serves, and stays null until the student uploads one.
    avatar:{
        type:String,
        default:null
    },
    gender:{
        type:String,
        enum:['male','female'],
        default:null
    },
    
    isblock:{
        type:Boolean,
        default:false
    },
    blockStatus:{
        type:String,
        default:'No block'
    }

},{
    timestamps:true
})

const User = mongoose.model('User',UserSchema)

export default User