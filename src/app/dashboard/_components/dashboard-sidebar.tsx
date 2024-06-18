"use client";

import { cn } from "@/lib/utils";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useSidebar } from "@/store/useSidebar";
import { useTimePeriod } from "@/store/useTimePeriod";
import { SidebarCalendar } from "./sidebar-calendar";
import { format } from "date-fns";
import { SidebarActions } from "./sidebar-actions";

export const DashboardSidebar = () => {
  const { isOpen } = useSidebar();
  const { day, week, month, year } = useSelectedDate();
  const { timePeriod, timeFormat } = useTimePeriod();

  return (
    <div
      className={cn(
        "w-44 md:w-60 border-r border-gray-200 bg-neutral-50 flex flex-col items-center px-4 py-6 gap-y-4 shadow-lg",
        !isOpen && "hidden"
      )}
    >
      <SidebarCalendar />
      <div className="p-2">
        {timePeriod === "DAY" && day && (
          <h4>
            Selected day:{" "}
            <span className="font-semibold text-md text-primary">
              {format(day, "MMMM do, yyyy")}
            </span>
          </h4>
        )}
        {timePeriod === "WEEK" && week && (
          <h4>
            Selected week:{" "}
            <span className="font-semibold text-md text-primary">
              {format(week[0], "LLL dd, y")} - {format(week[1], "LLL dd, y")}
            </span>
          </h4>
        )}
        {timePeriod === "MONTH" && month !== undefined && (
          <h4>
            Selected month:{" "}
            <span className="font-semibold text-md text-primary">
              {format(new Date(year, month), "MMMM yyyy")}
            </span>
          </h4>
        )}
      </div>
      {/* TODO: Fill that with fetched event data */}
      <div className="w-full flex flex-col gap-y-1">
        <h4 className="text-zinc-950">Incoming Task:</h4>
        <div className="flex flex-col gap-y-2 border rounded-md p-2 md:p-4 text-sm shadow-md">
          <div className="flex items-center gap-x-2">
            <p>Complete:</p>
            <span className="font-semibold">
              {timeFormat === "24H"
                ? format(new Date(2022, 1, 1), "HH:mm")
                : format(new Date(2022, 1, 1), "h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <p>Time left:</p>
            <span className="font-semibold">
              {timeFormat === "24H"
                ? format(new Date(2022, 1, 1), "HH:mm")
                : format(new Date(2022, 1, 1), "h:mm a")}
            </span>
          </div>
          <div className=" text-center flex flex-col gap-y-1">
            <p>Title:</p>
            <span className="font-semibold">
              Create new feature in that project.
            </span>
          </div>
        </div>
      </div>
      {/* TODO: Fill with next event data */}
      <div className="w-full flex flex-col gap-y-1">
        <h4 className="text-zinc-950">Incoming Event:</h4>
        <div className="w-full flex flex-col gap-y-2 border rounded-md p-2 md:p-4 text-sm shadow-md">
          <div className="flex items-center gap-x-2">
            <p>Date:</p>
            <span className="font-semibold">
              {timeFormat === "24H"
                ? format(new Date(2022, 1, 1), "HH:mm")
                : format(new Date(2022, 1, 1), "h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <p>Days left:</p>
            <span className="font-semibold">
              {timeFormat === "24H"
                ? format(new Date(2022, 1, 1), "HH:mm")
                : format(new Date(2022, 1, 1), "h:mm a")}
            </span>
          </div>
          <div className=" text-center flex flex-col gap-y-1">
            <p>Title:</p>
            <span className="font-semibold">New event in my village</span>
          </div>
        </div>
      </div>
      <SidebarActions />
    </div>
  );
};
