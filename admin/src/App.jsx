import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./components/layout/AppShell";

import Assignments from "./pages/Assignments";
import Overview from "./pages/Overview";
import PastPapers from "./pages/PastPapers";
import Projects from "./pages/Projects";
import TeacherReviews from "./pages/TeacherReviews";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/overview" element={<Overview />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/past-papers" element={<PastPapers />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/teacher-reviews" element={<TeacherReviews />} />
        <Route path="/settings" element={<Settings/>} />
      </Route>

      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
};

export default App;