import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRouter = ({children,userRole,allowedRole}) => {
  
  
    if(!userRole){
        return <Navigate to='/auth/SignIn'/>
    }else if(userRole !== allowedRole){
        return <Navigate to='/unauthorized'/> || <h1>Unauthorized User</h1>
    }
    
  return children
  
}

export default ProtectedRouter