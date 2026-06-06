import Navbar from '../Components/common/Navbar'
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      {/* Page content changes here */}
      <div className="p-4">
        <Outlet />
      </div>

    </div>
  );
}