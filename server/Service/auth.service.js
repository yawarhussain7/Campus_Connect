import User from '../Model/auth.model.js'
import bcrypt from 'bcrypt'
import GenereateJWT from '../utils/GenerateJWT.js'
import crypto from 'crypto'
import {sendEmail} from '../utils/sendEmail.js'
import resetPasswordEmail from '../utils/resetPassword.js'
import { sendEmailVerification } from './emailVerification.service.js'

const registerService = async({name,email,password,gender})=>{
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
            password:hashedPassword,
            gender: gender === 'male' || gender === 'female' ? gender : null
        })

        try {
            await sendEmailVerification(newUser._id)
        } catch (mailError) {
            console.error('Verification email not sent:', mailError.message)
        }

        const token = GenereateJWT(newUser._id,newUser.email)
        return {
           user:{
             _id:newUser._id,
            name:newUser.name,
            email:newUser.email,
            role:newUser.role,
            // Lets the client show the "verify your email" notice immediately.
            isEmailVerified:newUser.isEmailVerified,
            // Drives the male/female default portrait on the client.
            gender:newUser.gender
           },
           token
        }

    }catch(error){
        console.error(error)
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

       
        if(user.isblock){
            const error = new Error('Your account has been blocked. Contact an administrator to restore access.')
            error.status = 403
            // Surfaced by the controller and rendered by both front-ends.
            error.code = 'ACCOUNT_BLOCKED'
            throw error
        }

        if(!user.isEmailVerified && user.role !== 'admin'){
            const error = new Error('Your email is not verified yet. Enter the code we sent to your inbox to activate your account.')
            error.status = 403
            // Consumed by the client to route to the verification screen.
            error.code = 'EMAIL_NOT_VERIFIED'
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
                role:user.role,
                // Drives the "verify your email" notice on the client.
                isEmailVerified:user.isEmailVerified,
                // Drives the male/female default portrait on the client.
                gender:user.gender,
                // Lets the admin console show the saved profile picture the
                // moment it signs in, before Settings has fetched the profile.
                avatar:user.avatar
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

      
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

        user.resetPasswordToken = hashedToken
        user.resetPasswordTokenExpire = Date.now() + RESET_TOKEN_TTL

        await user.save()

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