import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()
// routes
import authRoute from './Routes/auth.route.js'
import assignRoute from './Routes/assignment.route.js'
import profileRoute from './Routes/profile.route.js'
import notificationRoute from './Routes/notification.route.js'
import dashboartRoute from './Routes/dashboard.route.js'

import connectDB from './config/dbconfig.js'

//middleware
import {assignmentUploadMiddleware} from './middleware/assignUpload.middleware.js'

const PORT = process.env.PORT || 8080
const app= express()
//middlewares
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials:true
}))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))

connectDB()

app.use('/auth',authRoute)
app.use('/assignment',assignRoute)
app.use('/profile',profileRoute)
app.use('/notifications',notificationRoute)
app.use('/dashboard',dashboartRoute)

app.get('/',(req,res)=>{
    res.send('Hello World')
})

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`)
})
