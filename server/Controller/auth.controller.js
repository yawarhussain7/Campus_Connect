import { loginService,registerService,forgetPasswordService,resetPasswordService } from "../Service/auth.service.js"
import { verifyEmailService, resendVerificationByEmail } from '../Service/emailVerification.service.js'

export const registerController = async (req,res)=>{
try{
    const {name,email,password,gender} = req.body

    if(!name || !email || !password){
        return res.status(400).send({
            message:"Please enter required data",
            success:false
        })
    }
    const result = await registerService({name,email,password,gender})

    // No session is issued here: sign-in stays locked until the emailed
    // verification link (or code) is entered, so the response only carries
    // what the verification screen needs.
    res.status(201).send({
        message:"Account created. Check your inbox for the verification link.",
        success:true,
        data:{
            email:result.user.email
        }
    })
}catch(error){
    console.error(error.message)
    // The service marks client-side failures (duplicate email, ...) with a
    // `status`; only a genuinely unexpected error stays a 500.
    res.status(error.status || 500).send({
        message:error.message || 'Could not register the user',
        success:false
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
        // Bad credentials are a 401 from the service, not a 500. The client
        // surfaces `message`, which is why the previous "Internal Server Error"
        // toast showed up on every wrong password. `code` lets the client tell
        // "not verified yet" apart from a real failure and route accordingly.
        res.status(error.status || 500).send({
            message:error.message || 'Internal Server Error',
            success:false,
            code:error.code
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
            message:'Invalid password or email',
            success:false,
            error:error.message
        })
    }
}

export const forgotPasswordController = async(req,res)=>{
    try{
        const {email}=req.body
        if(!email){
            return res.status(400).json({
                success:false,
                message:'Email is required'
            })
        }

        const result  = await forgetPasswordService(email)
        return res.status(200).json({
            success:true,
            message:result.message
        })
    }catch(error){
        return res.status(error.status || 500).json({
            success:false,
            message:error.message
        })
    }
}

export const resetPasswordController = async(req,res)=>{
    try{
        const {token}=req.params;
        const {newpassword}=req.body

        if(!newpassword){
            return res.status(400).json({
                success:false,
                message:'New password is required'
            })
        }

        if(newpassword.length < 6){
            return res.status(400).json({
                success:false,
                message:'Password must be at least 6 characters long'
            })
        }

        const result = await resetPasswordService(token,newpassword)

        return res.status(200).json({
            message:result.message,
            success:true
        })
    }catch(error){
        return res.status(error.status || 500).json({
            success:false,
            message:error.message
        })
    }
}

// Re-sends the verification link by email. Used right after signup and from
// the verification screen — no session exists there, because login is locked
// until the address is verified.
export const sendVerification = async (req, res) => {
  try {
    const result = await resendVerificationByEmail(req.body?.email)

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    // Service marks client-side failures (missing email) with a `status`;
    // an SMTP failure stays a 500.
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Unable to send verification email",
    });
  }
};

// Consumes the one-time token carried by the emailed link (?token=...).
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const result = await verifyEmailService(token);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Email verification failed",
    });
  }
};