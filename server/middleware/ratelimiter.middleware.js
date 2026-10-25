import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000, // 15 minutes
    limit:100, 
    standardHeaders:"draft-8",
    legacyHeaders:false,
    messaeg:{
        success:false,
        message:"Too many requests from this IP, please try again after 15 minutes"
    }
})