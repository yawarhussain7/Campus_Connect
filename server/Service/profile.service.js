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
        // runValidators keeps updates honest to the same schema rules as
        // sign-up (name length, email format), instead of writing anything.
        const user = await User.findByIdAndUpdate(userId, updateData, {new: true, runValidators: true}).select('-password')
        if(!user) throw new Error('User not found')
        return user
    }catch(error){
        console.error(error)
        throw new Error(error.message)
    }
}