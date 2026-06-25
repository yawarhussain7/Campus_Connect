import User from '../Model/auth.model.js'
import bcrypt from 'bcrypt'
import GenereateJWT from '../utils/GenerateJWT.js'

const registerService = async({name,email,password})=>{
    try{
        const existUser = await User.findOne({email})
        if(existUser) throw new Error('User already exists');

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

        throw new Error(error.message)
    }
}

const loginService = async({email,password})=>{
    try{
        if(email ==='' || password === ''){
            throw new Error('email and password requried for login') 
        }
        const user = await User.findOne({email}).select('+password')
        if(!user) throw new Error('Invalid Credentials');

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) throw new Error('Invalid Credentials');

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
        throw new Error(error.message)
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

export {registerService,loginService,getUser}