import { loginService,registerService } from "../Service/auth.service"


export const registerController = async (req,res)=>{
try{
    const result = await registerService(req.body)
    res.status(201).send({
        message:"User Registered Successfully",
        success:true,
        data:result
    })
}catch(error){
    console.error(error.message)
    res.status(500).send("Internal Server Error")
}
}

export const loginController = async(req,res)=>{
    try{
        const result = await loginService(req.body)
        res.status(200).send({
            message:"User Logged In Successfully",
            success:true,
            data:result
        })
    }catch(error){
        res.status(500).send({
            message:'Internal Server Error',
            success:false,
            error:error.message
        })
    }
}