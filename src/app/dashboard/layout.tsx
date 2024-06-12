import { DashboardNavbar } from "./_components/dashboard-navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full h-full flex flex-col">
      <DashboardNavbar />
      <div className="h-full flex">
        <div className="h-full w-40 md:w-60 border-r border-gray-200">
          Sidebar
        </div>
        <div className="w-full flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
