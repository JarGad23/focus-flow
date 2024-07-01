"use client";

import { cn } from "@/lib/utils";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useSidebar } from "@/store/useSidebar";
import { useTimePeriod } from "@/store/useTimePeriod";
import { SidebarCalendar } from "./sidebar-calendar";
import { format } from "date-fns";
import { SidebarActions } from "./sidebar-actions";
import { SidebarTask } from "./sidebar-task";
import { SidebarEvent } from "./sidebar-event";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";

export const DashboardSidebar = () => {
  const { isOpen } = useSidebar();
  const { day, week, month, year } = useSelectedDate();
  const { timePeriod } = useTimePeriod();
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsVisible(false);
    }
  };

  return (
    <div
      className={cn(
        "w-44 md:w-60 border-r border-gray-200 bg-neutral-50 flex flex-col items-center px-4 py-6 gap-y-4 shadow-lg",
        {
          "animate-in fade-in-0": isOpen,
          "animate-out fade-out-0": !isOpen,
        }
      )}
      data-state={isOpen ? "open" : "closed"}
      style={{ display: isVisible ? "flex" : "none" }}
      onAnimationEnd={handleAnimationEnd}
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
              {format(week[0], "LLL dd")} - {format(week[1], "LLL dd, y")}
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
      <Link href="/dashboard" className="w-full">
        <Button
          className="w-full flex items-center gap-x-2"
          size="sm"
          variant="outline"
        >
          <Home className="size-4" />
          Dashboard
        </Button>
      </Link>
      <SidebarTask />
      <SidebarEvent />

      <SidebarActions />
    </div>
  );
};
