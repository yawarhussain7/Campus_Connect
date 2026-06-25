import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const ProtectedRouter = () => {
  const { user, loading } = useAppContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to='/auth/signIn' replace />
  }

  return <Outlet />
}

export default ProtectedRouter