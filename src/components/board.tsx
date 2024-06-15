"use client";

import { useTimePeriod } from "@/store/useTimePeriod";
import { DayView } from "./day-view";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";

export const Board = () => {
  const { timePeriod } = useTimePeriod();

  const renderView = () => {
    switch (timePeriod) {
      case "DAY":
        return <DayView />;
      case "WEEK":
        return <WeekView />;
      case "MONTH":
        return <MonthView />;
      default:
        return <DayView />;
    }
  };

  return <div className="p-4">{renderView()}</div>;
};
