"use client";

import { cn } from "@/lib/utils";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useSidebar } from "@/store/useSidebar";
import { useTimePeriod } from "@/store/useTimePeriod";
import { SidebarCalendar } from "./sidebar-calendar";
import { format } from "date-fns";

export const DashboardSidebar = () => {
  const { isOpen } = useSidebar();
  const { day, week, month, year } = useSelectedDate();
  const { timePeriod } = useTimePeriod();

  return (
    <div
      className={cn(
        "w-40 md:w-60 border-r border-gray-200 bg-neutral-50 flex flex-col items-center px-4 py-6",
        !isOpen && "hidden"
      )}
    >
      <SidebarCalendar />
      <div className="p-4">
        {timePeriod === "DAY" && day && (
          <div>Selected day: {format(day, "MMMM do, yyyy")}</div>
        )}
        {timePeriod === "WEEK" && week && (
          <div>
            Selected week: {format(week[0], "MMMM do")} -{" "}
            {format(week[1], "MMMM do")}
          </div>
        )}
        {timePeriod === "MONTH" && month !== undefined && (
          <div>
            Selected month: {format(new Date(year, month), "MMMM yyyy")}
          </div>
        )}
      </div>
    </div>
  );
};
