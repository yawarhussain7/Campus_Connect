import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRouter from './ProtectedRouter'
import StudentLayout from '../layout/StudentLayout'
import StudentDashboard from '../Pages/students/StudentDashboard'
import Projects from '../Pages/students/Projects'
import PastPapers from '../Pages/students/PastPapers'
import PastPaperUpload from '../Pages/students/PastPaperUpload'
import TeacherReview from '../Pages/students/TeacherReview'
import Assignments from '../Pages/students/Assignments'
import AssignmentUpload from '../Pages/students/AssignmentUpload'
import Settings from '../Pages/students/Settings'

const StudentRoute = () => {
  return (
    <Routes>
      <Route element={<ProtectedRouter />}>
        <Route element={<StudentLayout />}>
          <Route path='dashboard' element={<StudentDashboard/>} />
          <Route path="teachers-review" element={<TeacherReview/>} />
          <Route path="past-papers" element={<PastPapers/>} />
          <Route path="past-paper/upload" element={<PastPaperUpload/>} />
          <Route path='projects' element={<Projects/>} />
          <Route path='assignments' element={<Assignments/>} />
          <Route path='assignment/upload' element={<AssignmentUpload/>} />
          <Route path='settings' element={<Settings/>} />
          <Route path="*" element={<h1>404 Not found</h1>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default StudentRoute
