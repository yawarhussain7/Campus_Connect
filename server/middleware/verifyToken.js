import jwt from 'jsonwebtoken'
export const ProtectedRoute =(req,res,next)=>{
    try{
        const token = req.cookies?.token;

        if(!token){
            return res.status(401).send({
                message:'Unauthorized user ',
                success:false
            })
        }

         const decode = jwt.verify(token,process.env.JWT_SECRET);
         req.user = decode;
         next()

    }catch(error){
        // An expired or tampered token is an auth failure (401), not a server
        // fault. Returning 500 here kept the client logged in on a dead session.
        const expired = error.name === 'TokenExpiredError'

        res.status(401).send({
            message: expired ? 'Session expired, please sign in again' : 'Invalid token, please sign in again',
            success:false
        })
    }
}