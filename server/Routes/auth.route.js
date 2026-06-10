import express from 'express'

const authRoute = express.Router()

authRoute.post('/signIn',(req,res)=>{
    res.send('Working on signIN')
})

authRoute.post('/signUp',(req,res)=>{
    res.send('working on signUP')
})

export default authRoute