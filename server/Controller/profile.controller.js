import { GetUser, UpdateUser } from "../Service/profile.service.js"

export const getProfileController = async(req,res)=>{
    try{
        const userId = req.user.id
        const user = await GetUser(userId)
        res.status(200).send({
            message:"Profile fetched successfully",
            success:true,
            data:user
        })
    }catch(error){
        console.error(error.message)
        res.status(500).send({
            message:'Internal Server Error',
            success:false,
            error:error.message
        })
    }
}

export const updateProfileController = async(req,res)=>{
    try{
        const userId = req.user.id
        const {name, email} = req.body
        const updateData = {}
        if(name) updateData.name = name
        if(email) updateData.email = email

        const user = await UpdateUser(userId, updateData)
        res.status(200).send({
            message:"Profile updated successfully",
            success:true,
            data:user
        })
    }catch(error){
        console.error(error.message)
        res.status(500).send({
            message:'Internal Server Error',
            success:false,
            error:error.message
        })
    }
}