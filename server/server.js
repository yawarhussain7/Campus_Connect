import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

import authRoute from './Routes/auth.route.js'
import connectDB from './config/dbconfig.js'

const PORT = process.env.PORT || 8080
const app= express()

app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())

connectDB()

app.use('/auth',authRoute)
app.get('/',(req,res)=>{
    res.send('Hello World')
})

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`)
})
