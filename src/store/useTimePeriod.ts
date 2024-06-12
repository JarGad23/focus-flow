import { create } from "zustand";

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
  onTimePeriodChange: (timePeriod: timePeriodType) => set({ timePeriod }),
  onTimeFormatChange: (timeFormat: timeFormatType) => set({ timeFormat }),
}));
