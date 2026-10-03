import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()
// routes
import authRoute from './Routes/auth.route.js'
import assignRoute from './Routes/assignment.route.js'
import profileRoute from './Routes/profile.route.js'
import notificationRoute from './Routes/notification.route.js'
import dashboartRoute from './Routes/dashboard.route.js'
import paperRoute from './Routes/paper.route.js'
import projectRoute from './Routes/project.route.js'
import reviewRoute from './Routes/review.route.js'
import cuiteacherRoute from './Routes/cuiteacher.routes.js'
import Adminrouter from './Routes/admin.route.js'

import connectDB from './config/dbconfig.js'

const PORT = process.env.PORT || 8080
const app= express()
//middlewares
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials:true
}))
app.use(cookieParser())

// Multer writes into these folders (paths are relative to the process cwd) and
// Express serves them statically, so they have to exist on a fresh clone.
for (const folder of ['uploads/assignments', 'uploads/papers', 'uploads/projects', 'uploads/avatars']) {
    fs.mkdirSync(folder, { recursive: true })
}

app.use('/uploads', express.static('uploads'))

connectDB()

app.use('/auth',authRoute)
app.use('/student',assignRoute)
app.use('/student',profileRoute)
app.use('/student',notificationRoute)
app.use('/student',dashboartRoute)
app.use('/student',paperRoute)
app.use('/student',projectRoute)
app.use('/student',reviewRoute)
app.use('/admin',Adminrouter)
// The COMSATS faculty directory the teacher-review pickers are built from.
app.use('/cui-teachers',cuiteacherRoute)

app.get('/',(req,res)=>{
    res.send('Hello World')
})

// Unknown routes answer with JSON instead of Express' default HTML page.
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    })
})

// Central error handler. Controllers call next(error) (see the dashboard
// controller), which without this middleware fell through to Express' default
// HTML error page when the client is expecting JSON.
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error)

    if (res.headersSent) {
        return next(error)
    }

    const status = error.status || error.statusCode || 500

    res.status(status).json({
        success: false,
        message: error.message || 'Internal Server Error'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`)
})
