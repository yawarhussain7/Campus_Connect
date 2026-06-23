import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRouter = ({userRole,allowedRole}) => {
  
    if(!userRole){
        return <Navigate to='/auth/SignIn'/>
    }else if(userRole !== allowedRole){
        return <Navigate to='/unauthorized'/>
    }
    
  return <Outlet />
  
}

export default ProtectedRouter
