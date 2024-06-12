import { DashboardNavbar } from "./_components/dashboard-navbar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full h-full flex flex-col">
      <DashboardNavbar />
      <div className="h-full flex">
        <DashboardSidebar />
        <div className="w-full flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
