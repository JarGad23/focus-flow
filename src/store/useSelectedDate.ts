import { create } from "zustand";
import { startOfWeek, endOfWeek, format } from "date-fns";

type selectedDateStoreType = {
  day: Date | undefined;
  week: [Date, Date];
  month: number;
  monthName: string;
  onSelectDay: (day: Date) => void;
  onSelectWeek: (weekStart: Date) => void;
  onSelectMonth: (month: number) => void;
};

export const useSelectedDate = create<selectedDateStoreType>((set) => ({
  day: new Date(),
  week: [
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  ],
  month: new Date().getMonth(),
  monthName: format(new Date(), "MMMM"),
  onSelectDay: (day: Date) => set({ day }),
  onSelectWeek: (weekStart: Date) =>
    set({
      week: [
        startOfWeek(weekStart, { weekStartsOn: 1 }),
        endOfWeek(weekStart, { weekStartsOn: 1 }),
      ],
    }),
  onSelectMonth: (month: number) => {
    const newDate = new Date();
    newDate.setMonth(month);
    set({
      month,
      monthName: format(newDate, "MMMM"),
    });
  },
}));
