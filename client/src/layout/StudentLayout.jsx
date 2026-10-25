import { Outlet } from "react-router-dom";
import MobileBottomNav from "../Components/common/MobileBottomNav";

export default function StudentLayout() {
  return (
    <div className="min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] xl:pb-0">
      <Outlet />
      <MobileBottomNav />
    </div>
  );
}
