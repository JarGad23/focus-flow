"use client ";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { eachDayOfInterval, format, getMonth, setMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useTimePeriod } from "@/store/useTimePeriod";
import { MonthSelector } from "@/components/month-selector";

export const SidebarCalendar = () => {
  const { day, onSelectDay, week, onSelectWeek, month, onSelectMonth } =
    useSelectedDate();
  const { timePeriod } = useTimePeriod();

  const daysOfWeek = eachDayOfInterval({
    start: week[0],
    end: week[1],
  });

  console.log(month);

  const handleDaySelect = (date: Date) => {
    if (timePeriod === "DAY") {
      onSelectDay(date);
    }
  };

  const handleWeekSelect = (days: Date[]) => {
    const selectedDay = days[days.length - 1];
    onSelectWeek(selectedDay);
  };

  const handleMonthSelect = (month: Date) => {
    const selectedMonth = getMonth(month);
    onSelectMonth(selectedMonth);
  };

  return (
    <>
      {timePeriod === "MONTH" ? (
        <MonthSelector />
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !day && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {day ? format(day, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" sideOffset={10} align="start">
            {timePeriod === "WEEK" ? (
              <Calendar
                ISOWeek
                initialFocus
                mode="multiple"
                selected={daysOfWeek}
                onSelect={handleWeekSelect}
                captionLayout="dropdown-buttons"
                fromYear={1960}
                toYear={2030}
              />
            ) : timePeriod === "DAY" ? (
              <Calendar
                ISOWeek
                mode="single"
                selected={day}
                onSelect={handleDaySelect}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={1960}
                toYear={2030}
              />
            ) : null}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
