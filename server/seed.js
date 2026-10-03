import User from './Model/auth.model.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const createAdmin = async()=>{
   try{

    await mongoose.connect(process.env.MONGO_URI)

    console.info('Database is connected')


     const email= 'yawarhussain793@gmail.com'
    const password= 'yawar793'

    const existingAdmin =  await User.findOne({email:'yawarhussain793@gmail.com'})

    if(existingAdmin){
        throw new Error('Admin is already created')
    }
    
    const hashed_password  = await bcrypt.hash(password,10)
    const admin = await User.create({
        name:'Yawar Hussain',
        email,
        password,

        role:'admin'
    })

    console.log("Admin created successfully")
    console.log({
        id:admin._id,
        name:admin.name,
        email:admin.email,
        role:admin.role
    })

    process.exit(0)
   }catch(error){
    console.log('Error creating admin: '+error)
    process.exit(0)
   }

    
}

createAdmin()