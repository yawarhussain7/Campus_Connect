import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
