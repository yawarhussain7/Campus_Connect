import { loginService,registerService } from "../Service/auth.service.js"


export const registerController = async (req,res)=>{
try{
    const {name,email,password} = req.body

    if(!name || !email || !password){
        return res.status(400).send({
            message:"Please enter required data",
            success:false
        })
    }
    const result = await registerService({name,email,password})

    res.cookie('token',result.token,{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
        maxAge: 1 * 24 * 60 * 60 * 1000,
    })
    res.status(201).send({
        message:"User Registered Successfully",
        success:true,
        data:result.user,
        token:result.token
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

export const loginController = async(req,res)=>{
    try{
        if(!req.body || Object.keys(req.body).length === 0){
            return res.status(400).send({
                message:"Please enter required data",
                success:false
            })
        }
        const {email,password} = req.body
        const result = await loginService({email,password})
        
        res.cookie('token',result.token,{
            httpOnly:true,
            secure:false,
            sameSite:'lax',
            maxAge: 1 * 24 * 60 * 60 * 1000,

        })

    res.status(200).send({
        message:"User Logged In Successfully",
        success:true,
        data:result.user,
        token:result.token
    })
    }catch(error){
        res.status(500).send({
            message:'Internal Server Error',
            success:false,
            error:error.message
        })
    }
}

export const logoutController = async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:false,
            sameSite:'lax'
        })
        res.status(200).send({
            message:"Logged out successfully",
            success:true
        })
    }catch(error){
        res.status(500).send({
            message:'Internal Server Error',
            success:false,
            error:error.message
        })
    }
}
