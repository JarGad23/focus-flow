import { create } from "zustand";
import { startOfWeek, endOfWeek, format, getMonth, getYear } from "date-fns";

type selectedDateStoreType = {
  day: Date;
  week: [Date, Date];
  month: number;
  monthName: string;
  year: number;
  onSelectDay: (day: Date) => void;
  onSelectWeek: (weekStart: Date) => void;
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
};

const resetTime = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date;
};

export const useSelectedDate = create<selectedDateStoreType>((set) => ({
  day: resetTime(new Date()),
  week: [
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  ],
  month: getMonth(new Date()),
  year: getYear(new Date()),
  monthName: format(new Date(), "MMMM"),
  onSelectDay: (day: Date) => set({ day: resetTime(day) }),
  onSelectWeek: (date: Date) =>
    set({
      week: [
        startOfWeek(date, { weekStartsOn: 1 }),
        endOfWeek(date, { weekStartsOn: 1 }),
      ],
    }),
  onSelectMonth: (month: number) => {
    const newDate = resetTime(new Date());
    newDate.setMonth(month);
    set({
      month,
      monthName: format(newDate, "MMMM"),
    });
  },
  onSelectYear: (year: number) => set({ year }),
}));
