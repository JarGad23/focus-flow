import { DashboardNavbar } from "./_components/dashboard-navbar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <DashboardNavbar />
      <div className="flex flex-1 overflow-y-auto">
        <DashboardSidebar />
        <div className="w-full flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
