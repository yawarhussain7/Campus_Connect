import { Route, Routes } from 'react-router-dom'
import ProtectedRouter from './ProtectedRouter'
import StudentLayout from '../layout/StudentLayout'
import StudentDashboard from '../Pages/students/StudentDashboard'
import Projects from '../Pages/students/Projects'
import ProjectUpload from '../Pages/students/ProjectUpload'
import PastPapers from '../Pages/students/PastPapers'
import PastPaperUpload from '../Pages/students/PastPaperUpload'
import TeacherReview from '../Pages/students/TeacherReview'
import Assignments from '../Pages/students/Assignments'
import AssignmentUpload from '../Pages/students/AssignmentUpload'
import Settings from '../Pages/students/Settings'
import About from '../Pages/students/About'
import ComingSoon from '../Pages/students/ComingSoon'

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
          <Route path='project/upload' element={<ProjectUpload/>} />
          <Route path='assignments' element={<Assignments/>} />
          <Route path='assignment/upload' element={<AssignmentUpload/>} />
          <Route path='settings' element={<Settings/>} />

          {/* Sidebar destinations that are still being built */}
          <Route
            path="messages"
            element={
              <ComingSoon
                title="Messages"
                description="Direct messages, instructor threads and project collaboration chat will live here."
              />
            }
          />
          <Route
            path="calendar"
            element={
              <ComingSoon
                title="Academic Calendar"
                description="Deadlines, quizzes, exams and class schedules for the running semester will live here."
              />
            }
          />
          <Route
            path="resources"
            element={
              <ComingSoon
                title="Resources"
                description="Study guides, formula sheets, lecture notes and skill tracks curated for you."
              />
            }
          />
          <Route path="about" element={<About />} />

          <Route path="*" element={<h1>404 Not found</h1>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default StudentRoute
