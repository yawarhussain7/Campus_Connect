import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

import authRoute from './Routes/auth.route.js'

const PORT = process.env.PORT || 8080
const app= express()

app.use('/auth',authRoute)
app.get('/',(req,res)=>{
    res.send('Hello World')
})

app.listen(PORT,
    console.log(`Server is running on port: http://localhost:${PORT}`)
)