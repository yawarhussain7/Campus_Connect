import mongoose from 'mongoose'
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
    password:{
        type:String,
        required:[true,'Password is required'],
        trim:true,
        minlength:[6,'Password must be at least 6 characters long'],
        select:false
    },
    
},{
    timestamps:true
})

const User = mongoose.model('User',UserSchema)

export default User