"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/useSidebar";

export const DashboardSidebar = () => {
  const { isOpen } = useSidebar();
  return (
    <div
      className={cn(
        "block h-full w-40 md:w-60 border-r border-gray-200",
        !isOpen && "hidden"
      )}
    >
      Sidebar
    </div>
  );
};
