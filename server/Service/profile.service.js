import User from "../Model/auth.model.js";

export const GetUser = async(userId)=>{
    try{
        const user = await User.findById(userId).select('-password')
        if(!user) throw new Error('User not found')
        return user
    }catch(error){
        console.error(error)
        throw new Error(error.message)
    }
}

export const UpdateUser = async(userId, updateData)=>{
    try{
        const user = await User.findByIdAndUpdate(userId, updateData, {new: true}).select('-password')
        if(!user) throw new Error('User not found')
        return user
    }catch(error){
        console.error(error)
        throw new Error(error.message)
    }
}