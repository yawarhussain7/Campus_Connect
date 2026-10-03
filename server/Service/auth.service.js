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
            email:newUser.email
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
                email:user.email
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

export const forgetPasswordService = async(email)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error("User not found")
    }

    const resetToken = crypto.randomBytes(32).toString('hex')

    // hashed token before save into database
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    user.resetPasswordToken = hashedToken
    user.resetPasswordTokenExpire = Date.now() + 15 *60*1000;

    await user.save()

    const resultURL = `http://localhost:5173/reset-password/${resetToken}`


    const generateHTML = await resetPasswordEmail(user.name,resultURL)
    await sendEmail(user.email,"Reset your CampusConnector Password",html)

    return {
        resultURL
    }

}

const resetPassworService  = async(token,newPassword)=>{
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken:hashedToken,
        resetPasswordTokenExpire:{
            $gt:Date.now()
        }
    })

    if(!user){
        throw new Error("Invalid or expired reset token")
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)

    user.password = hashedPassword

    user.resetPasswordToken = null,
    user.resetPasswordTokenExpire = null

    return{
        message:'Password reset successfully'
    }
}

export {registerService,loginService,getUser,forgetPasswordService,resetPassworService}