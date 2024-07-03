"use client ";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { eachDayOfInterval, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useTimePeriod } from "@/store/useTimePeriod";
import { MonthSelector } from "@/components/month-selector";

export const SidebarCalendar = () => {
  const { day, onSelectDay, week, onSelectWeek } = useSelectedDate();
  const { timePeriod } = useTimePeriod();

  const daysOfWeek = eachDayOfInterval({
    start: week[0],
    end: week[1],
  });

  const handleDaySelect = (date: Date) => {
    if (timePeriod === "DAY") {
      onSelectDay(date);
    }
  };

  const handleWeekSelect = (days: Date[] | undefined) => {
    if (!days) return;

    const selectedDay = days[days.length - 1];
    onSelectWeek(selectedDay);
  };

  return (
    <>
      {timePeriod === "MONTH" ? (
        <MonthSelector />
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !day && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="flex-shrink-0 mr-2 size-3 md:size-4" />
              {timePeriod === "DAY" ? (
                <span className="truncate">
                  {day ? format(day, "PPP") : <span>Pick a date</span>}
                </span>
              ) : (
                <>
                  {week ? (
                    <span className="truncate">
                      {format(week[0], "LLL dd")} -{" "}
                      {format(week[1], "LLL dd, y")}
                    </span>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </>
              )}
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
                required
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
