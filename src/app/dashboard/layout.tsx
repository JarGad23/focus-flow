import { ModalProvider } from "@/components/modal-provider";
import { DashboardNavbar } from "./_components/dashboard-navbar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email) {
    return redirect("/api/auth/login");
  }
  return (
    <>
      <div className="relative w-full min-h-screen flex flex-col">
        <DashboardNavbar />
        <div className="flex flex-1 overflow-y-auto">
          <DashboardSidebar />
          <div className="w-full flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
      <ModalProvider />
    </>
  );
};

export default DashboardLayout;
