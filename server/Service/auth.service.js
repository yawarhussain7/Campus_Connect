import User from '../Model/auth.model.js'
import bcrypt from 'bcrypt'
import GenereateJWT from '../utils/GenerateJWT.js'
import crypto from 'crypto'
import {sendEmail} from '../utils/sendEmail.js'
import resetPasswordEmail from '../utils/resetPassword.js'

const registerService = async({name,email,password})=>{
    try{
        const existUser = await User.findOne({email})
        if(existUser){
            const error = new Error('User already exists')
            error.status = 409
            throw error
        }

        // Only the hash is stored, so a leaked database cannot be used to reset
        // anyone's password directly.
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            name,
            email,
            password:hashedPassword
        })

        const token = GenereateJWT(newUser._id,newUser.email)
        return {
           user:{
             _id:newUser._id,
            name:newUser.name,
            email:newUser.email,
            // Carried to the client so the admin console can tell an admin
            // session apart from a student one after signing in.
            role:newUser.role
           },
           token
        }

    }catch(error){
        console.error(error)

        // Rethrown untouched so the `status` set above survives: wrapping it in
        // a fresh Error() dropped the status and every failure became a 500.
        throw error
    }
}

const loginService = async({email,password})=>{
    try{
        if(!email || !password){
            const error = new Error('email and password requried for login')
            error.status = 400
            throw error
        }
        const user = await User.findOne({email}).select('+password')
        if(!user){
            const error = new Error('Invalid Credentials')
            error.status = 401
            throw error
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            const error = new Error('Invalid Credentials')
            error.status = 401
            throw error
        }

        const token = GenereateJWT(user._id,user.email)

        return {
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                // The admin console signs in through this endpoint and checks
                // the role before granting access to /admin data.
                role:user.role
            },
            token
        };
    }catch(error){
        console.error(error)
        throw error
    }
}

const getUser = async (userId)=>{
    try{
        const user = await User.findById(userId).select('-password')
        return user
    }catch(error){
        throw new Error(error.message)
    }
}

// How long a reset link stays valid (15 minutes), in milliseconds.
const RESET_TOKEN_TTL = 15 * 60 * 1000

const forgetPasswordService = async(email)=>{
    try{
        const user = await User.findOne({email})

        if(!user){
            const error = new Error("No account found with that email")
            error.status = 404
            throw error
        }

        const resetToken = crypto.randomBytes(32).toString('hex')

        // Only the hash is stored, so a leaked database cannot be used to reset
        // anyone's password directly.
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

        user.resetPasswordToken = hashedToken
        user.resetPasswordTokenExpire = Date.now() + RESET_TOKEN_TTL

        await user.save()

        // The client route that renders the "choose a new password" form. It is
        // configurable so a deployment can point the link at the right host, and
        // falls back to the local student app so a missing CLIENT_URL can never
        // produce a broken "undefined/..." link. A trailing slash is trimmed so
        // the URL never ends up as ".../ /reset-password".
        const clientURL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '')
        const resultURL = `${clientURL}/reset-password/${resetToken}`

        const html = resetPasswordEmail(user.name, resultURL)

        // sendEmail expects a single options object.
        await sendEmail({
            email: user.email,
            subject: "Reset your CampusConnector Password",
            html
        })

        
        return {
            message: 'Password reset link sent to your email'
        }
    }catch(error){
        console.error(error)
        throw error
    }
}

const resetPasswordService = async(token,newPassword)=>{
    try{
        if(!token){
            const error = new Error("Reset token is required")
            error.status = 400
            throw error
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const user = await User.findOne({
            resetPasswordToken:hashedToken,
            resetPasswordTokenExpire:{
                $gt:new Date()
            }
        })

        if(!user){
            const error = new Error("Invalid or expired reset token")
            error.status = 400
            throw error
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)

        user.password = hashedPassword

        // Burn the token so the link cannot be reused, then persist the new
        // password. The previous version forgot to save, so nothing changed.
        user.resetPasswordToken = null
        user.resetPasswordTokenExpire = null

        await user.save()

        return{
            message:'Password reset successfully'
        }
    }catch(error){
        console.error(error)
        throw error
    }
}

export {registerService,loginService,getUser,forgetPasswordService,resetPasswordService}