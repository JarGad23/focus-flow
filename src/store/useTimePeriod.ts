import { create } from "zustand";
import { useSelectedDate } from "./useSelectedDate";

export type timePeriodType = "DAY" | "WEEK" | "MONTH";
export type timeFormatType = "12H" | "24H";

type timePeriodStore = {
  timePeriod: timePeriodType;
  timeFormat: timeFormatType;
  onTimePeriodChange: (timePeriod: timePeriodType) => void;
  onTimeFormatChange: (timeFormat: timeFormatType) => void;
};

export const useTimePeriod = create<timePeriodStore>((set) => ({
  timePeriod: "DAY",
  timeFormat: "24H",
  onTimePeriodChange: (timePeriod: timePeriodType) => {
    set({ timePeriod });
    const { onSelectDay, onSelectWeek, onSelectMonth } =
      useSelectedDate.getState();

    const currentDate = new Date();
    switch (timePeriod) {
      case "DAY":
        onSelectDay(currentDate);
        break;
      case "WEEK":
        onSelectWeek(currentDate);
        break;
      case "MONTH":
        onSelectMonth(currentDate.getMonth());
        break;
    }
  },
  onTimeFormatChange: (timeFormat: timeFormatType) => set({ timeFormat }),
}));
