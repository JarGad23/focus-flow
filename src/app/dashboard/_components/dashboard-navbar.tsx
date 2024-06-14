import { NavbarActions } from "./navbar-actions";
import { NavbarInfo } from "./navbar-info";

export const DashboardNavbar = () => {
  return (
    <nav className="sticky z-50 h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition  flex items-center justify-between px-2 md:px-6 ">
      <NavbarInfo />
      <NavbarActions />
    </nav>
  );
};
