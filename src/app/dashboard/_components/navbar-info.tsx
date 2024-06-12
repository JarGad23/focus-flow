"use client";

import { Logo } from "@/components/logo";
import { useTimePeriod } from "@/store/useTimePeriod";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { format } from "date-fns";
import { useSidebar } from "@/store/useSidebar";
import { Button } from "@/components/ui/button";

export const NavbarInfo = () => {
  const { timePeriod } = useTimePeriod();
  const { isOpen, onClose, onOpen } = useSidebar();

  const handleSidebarOpen = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <div className="flex items-center gap-x-4">
      <Button variant="ghost" onClick={handleSidebarOpen}>
        {isOpen ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeftOpen className="h-5 w-5" />
        )}
      </Button>
      <Logo />
      <span className="text-lg font-medium tracking-tight">
        {timePeriod === "DAY"
          ? format(new Date(), "dd MMM yyyy")
          : format(new Date(), "MMMM yyyy")}
      </span>
    </div>
  );
};
