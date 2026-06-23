import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const SECRET = process.env.JWT_SECRET || 'replace_this_secret'

const GenereateJWT = (id,email)=>{

    const token = jwt.sign({id,email},SECRET,{expiresIn:'1d'})
    return token

}

export default GenereateJWT;