import jwt from 'jsonwebtoken'
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

        const sessionCookie = {
            httpOnly:true,
            secure:false,
            sameSite:'lax',
            maxAge: 1 * 24 * 60 * 60 * 1000,

        }

        res.cookie('token',result.token,sessionCookie)

        // The admin console (localhost:5174) and the student app
        // (localhost:5173) share one cookie jar — cookies ignore ports, so a
        // student signing in on the client used to overwrite the admin's only
        // session cookie. The console then received a 403 on its next load and
        // signed itself out. Admins therefore also get a dedicated cookie that
        // only /admin reads, so the two apps can sign in and out independently.
        if(result.user?.role === 'admin'){
            res.cookie('admin_token',result.token,sessionCookie)
        }

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
        const clearOptions = {
            httpOnly:true,
            secure:false,
            sameSite:'lax'
        }

        res.clearCookie('token',clearOptions)

        // Admins hold a second, dedicated `admin_token` (set at sign-in) so a
        // student session from the shared localhost cookie jar cannot clobber
        // the console session. It is only cleared when it belongs to the same
        // account as the `token` being signed out — a student signing out of
        // the client must never end a different (admin) session in this
        // browser, while an admin signing out ends their session everywhere.
        const token = req.cookies?.token
        const adminToken = req.cookies?.admin_token

        if(token && adminToken){
            try{
                const decode = jwt.verify(token, process.env.JWT_SECRET)
                const adminDecode = jwt.verify(adminToken, process.env.JWT_SECRET)

                if(decode?.id && decode.id === adminDecode.id){
                    res.clearCookie('admin_token',clearOptions)
                }
            }catch{
                // An unreadable cookie must not fail the sign-out itself.
            }
        }

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