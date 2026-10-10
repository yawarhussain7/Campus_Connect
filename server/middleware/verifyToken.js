import jwt from 'jsonwebtoken'
import User from '../Model/auth.model.js'

/**
 * Guards the student routes: the JWT cookie is verified, then the account is
 * re-read from the database so an admin's block lands immediately — a session
 * minted before the block stops working on the very next request instead of
 * living out the 1-day token lifetime.
 *
 * 401 = no/invalid session, 403 = signed in but blocked (carries
 * `code: ACCOUNT_BLOCKED`, which both front-ends render / sign out on).
 */
export const ProtectedRoute = async (req,res,next) => {
    try{
        const token = req.cookies?.token;

        if(!token){
            return res.status(401).send({
                message:'Unauthorized user ',
                success:false
            })
        }

        let decode

        try{
            decode = jwt.verify(token,process.env.JWT_SECRET)
        }catch(error){
            // An expired or tampered token is an auth failure (401), not a server
            // fault. Returning 500 here kept the client logged in on a dead session.
            const expired = error.name === 'TokenExpiredError'

            return res.status(401).send({
                message: expired ? 'Session expired, please sign in again' : 'Invalid token, please sign in again',
                success:false
            })
        }

        const user = await User.findById(decode.id).select('isblock')

        // The account was deleted after this token was issued: the session is
        // as good as forged, so treat it like an invalid token.
        if(!user){
            return res.status(401).send({
                message:'Invalid token, please sign in again',
                success:false
            })
        }

        if(user.isblock){
            return res.status(403).send({
                message:'Your account has been blocked. Contact an administrator to restore access.',
                success:false,
                code:'ACCOUNT_BLOCKED'
            })
        }

        req.user = decode
        next()
    }catch(error){
        // Database failures are server faults, not auth failures — anything
        // else here (outside the jwt.verify inner try) belongs to Express.
        next(error)
    }
}