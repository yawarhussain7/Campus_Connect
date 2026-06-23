import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRouter from './ProtectedRouter'
import StudentLayout from '../layout/StudentLayout'

const StudentRoute = ({userRole}) => {
  return (
    <Routes>
      <Route element={<ProtectedRouter userRole={userRole} allowedRole="user" />}>
        <Route element={<StudentLayout />}>
          <Route path='dashboard' element={<h1>Student Dashboard</h1>} />
          <Route path="teachers-review" element={<h1>Teachers Review</h1>} />
          <Route path="past-papers" element={<h1>Past Papers</h1>} />
          <Route path='projects' element={<h1>Student Projects</h1>} />
          <Route path='assignments' element={<h1>Assignments</h1>} />
          <Route path="*" element={<h1>404 Not found</h1>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default StudentRoute
