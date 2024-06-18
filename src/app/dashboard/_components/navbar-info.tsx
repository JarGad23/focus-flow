"use client";

import { Logo } from "@/components/logo";
import { useTimePeriod } from "@/store/useTimePeriod";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { format } from "date-fns";
import { useSidebar } from "@/store/useSidebar";
import { Button } from "@/components/ui/button";
import { useSelectedDate } from "@/store/useSelectedDate";

export const NavbarInfo = () => {
  const { timePeriod } = useTimePeriod();
  const { day, week, month, year } = useSelectedDate();
  const { isOpen, onClose, onOpen } = useSidebar();

  const handleSidebarOpen = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <div className="flex items-center gap-x-2 lg:gap-x-4">
      <Button variant="ghost" onClick={handleSidebarOpen}>
        {isOpen ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeftOpen className="h-5 w-5" />
        )}
      </Button>
      <Logo />
      <span className="lg:text-lg font-medium tracking-tight">
        {timePeriod === "DAY" ? (
          format(day, "dd MMM yyyy")
        ) : timePeriod === "WEEK" ? (
          <>
            <span className="lg:hidden">
              {format(week[0], "LLL dd")} - {format(week[1], "LLL dd")}
            </span>
            <span className="hidden lg:block">
              {format(week[0], "LLL dd")} - {format(week[1], "LLL dd, y")}
            </span>
          </>
        ) : (
          format(new Date(year, month), "MMMM yyyy")
        )}
      </span>
    </div>
  );
};
