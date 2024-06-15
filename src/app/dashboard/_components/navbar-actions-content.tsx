"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useSelectedDate } from "@/store/useSelectedDate";
import {
  timeFormatType,
  timePeriodType,
  useTimePeriod,
} from "@/store/useTimePeriod";
import Link from "next/link";

type Props = {
  isPro: boolean;
  className?: string;
};

export const NavbarActionsContent = ({ isPro, className }: Props) => {
  const { onTimeFormatChange, timeFormat, timePeriod, onTimePeriodChange } =
    useTimePeriod();
  const { onSelectDay, onSelectMonth, onSelectWeek } = useSelectedDate();

  const handleTimePeriodChange = (value: timePeriodType) => {
    onTimePeriodChange(value);
    const currentDate = new Date();
    switch (value) {
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
  };

  return (
    <div className={cn("w-full flex items-center gap-x-2", className)}>
      <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
        <SelectTrigger className="w-full md:w-[100px] focus:ring-offset-0 focus:ring-transparent outline-none">
          <SelectValue placeholder="Time Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DAY">Day</SelectItem>
          <SelectItem value="WEEK">Week</SelectItem>
          <SelectItem value="MONTH">Month</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={timeFormat}
        onValueChange={(value: timeFormatType) => onTimeFormatChange(value)}
      >
        <SelectTrigger className="w-full md:w-[100px] focus:ring-offset-0 focus:ring-transparent outline-none">
          <SelectValue placeholder="Time Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24H">24 hour</SelectItem>
          <SelectItem value="12H">12 hour</SelectItem>
        </SelectContent>
      </Select>
      <Button className="w-full md:w-fit">Become Pro!</Button>
      <Link
        href="/api/auth/logout"
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "w-full md:w-fit",
          })
        )}
      >
        Logout
      </Link>
    </div>
  );
};
