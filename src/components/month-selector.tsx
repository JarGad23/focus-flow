"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useSelectedDate } from "@/store/useSelectedDate";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { SelectValue } from "@radix-ui/react-select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS: string[] = [];
for (let year = 1990; year <= 2030; year++) {
  YEARS.push(year.toString());
}

export const MonthSelector = () => {
  const { month, year, monthName, onSelectMonth, onSelectYear } =
    useSelectedDate();

  const yearAndMonth = format(new Date(year, month), "MMMM yyyy");

  const handleMonthChange = (value: string) => {
    const month = MONTHS.indexOf(value);
    onSelectMonth(month);
  };

  const handleYearChange = (value: string) => {
    const year = parseInt(value);
    onSelectYear(year);
  };

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !yearAndMonth && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {yearAndMonth ? yearAndMonth : <span>Select a month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col items-center gap-y-2">
        <Select value={monthName} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-full focus:ring-offset-0 focus:ring-transparent outline-none">
            <div className="flex items-center gap-x-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue
                placeholder="Select a month"
                className={cn(
                  "w-full flex justify-start text-left font-normal",
                  !monthName && "text-mu-ted-foreground"
                )}
              />
            </div>
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-full focus:ring-offset-0 focus:ring-transparent outline-none">
            <div className="flex items-center gap-x-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue
                placeholder="Select a Year"
                className={cn(
                  "w-full flex justify-start text-left font-normal",
                  !year && "text-mu-ted-foreground"
                )}
              />
            </div>
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};
