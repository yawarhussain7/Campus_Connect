import jwt from 'jsonwebtoken'
export const ProtectedRoute =(req,res,next)=>{
    try{
        const token = req.cookies.token;

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
        res.status(500).send({
            message:error.message,
            success:false
        })
    }
}