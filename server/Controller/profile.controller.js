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
        const {name, email, gender} = req.body
        const updateData = {}
        if(name) updateData.name = name
        if(email) updateData.email = email
        // Drives the male/female default portrait; anything outside the two
        // known values is ignored rather than rejected, so a stale client
        // cannot lock the student out of saving the rest of the form. An
        // explicit empty value clears the stored choice ("Prefer not to say").
        if(gender === 'male' || gender === 'female') updateData.gender = gender
        else if(gender === '' || gender === null) updateData.gender = null

        // A freshly uploaded picture is stored the same way the other uploads
        // are: a `/uploads/...` path that the static route serves back.
        if(req.file) updateData.avatar = `/uploads/avatars/${req.file.filename}`

        const user = await UpdateUser(userId, updateData)
        res.status(200).send({
            message:"Profile updated successfully",
            success:true,
            data:user
        })
    }catch(error){
        // A taken email is a client mistake (409), not a server fault — the
        // same clash the admin user service maps to 409.
        if(error?.code === 11000){
            return res.status(409).send({
                message:'An account with that email already exists',
                success:false
            })
        }

        // Schema rejections (e.g. a too-short name) are bad input (400).
        if(error?.name === 'ValidationError'){
            return res.status(400).send({
                message:error.message,
                success:false
            })
        }

        console.error(error.message)
        res.status(500).send({
            message:'Internal Server Error',
            success:false,
            error:error.message
        })
    }
}