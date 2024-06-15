"use client";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useSidebar } from "@/store/useSidebar";
import { useTimePeriod } from "@/store/useTimePeriod";
import { format, startOfWeek, getMonth } from "date-fns";
import "react-day-picker/dist/style.css";

export const DashboardSidebar = () => {
  const { isOpen } = useSidebar();
  const { day, week, month, onSelectDay, onSelectWeek, onSelectMonth } =
    useSelectedDate();
  const { timePeriod } = useTimePeriod();

  const handleSelect = (selected: Date | undefined) => {
    if (selected) {
      switch (timePeriod) {
        case "DAY":
          onSelectDay(selected);
          break;
        case "WEEK":
          onSelectWeek(startOfWeek(selected, { weekStartsOn: 1 }));
          break;
        case "MONTH":
          onSelectMonth(getMonth(selected));
          break;
      }
    }
  };

  const modifiers = {
    selectedDay: day ? [day] : [],
    selectedWeek: week ? [{ from: week[0], to: week[1] }] : [],
    selectedMonth:
      month !== undefined ? [new Date(new Date().getFullYear(), month)] : [],
  };

  return (
    <div
      className={cn(
        "block w-40 md:w-60 border-r border-gray-200",
        !isOpen && "hidden"
      )}
    >
      <Calendar
        mode="single"
        selected={timePeriod === "DAY" ? day : undefined}
        onSelect={handleSelect}
        modifiers={modifiers}
        showOutsideDays
      />
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
            Selected month:{" "}
            {format(new Date(new Date().getFullYear(), month), "MMMM, yyyy")}
          </div>
        )}
      </div>
    </div>
  );
};
