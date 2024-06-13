import { useTimePeriod } from "@/store/useTimePeriod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const DayView = () => {
  const { timeFormat } = useTimePeriod();
  const [currentTimePosition, setCurrentTimePosition] = useState(0);

  useEffect(() => {
    const updateCurrentTimePosition = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const position = (currentHour + currentMinute / 60) * 64;
      setCurrentTimePosition(position);
    };

    updateCurrentTimePosition();
    const intervalId = setInterval(updateCurrentTimePosition, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex">
      <div className="flex flex-col">
        {hours.map((hour) => {
          const formattedHour =
            timeFormat === "24H"
              ? format(new Date(2022, 1, 1, hour), "HH:mm")
              : format(new Date(2022, 1, 1, hour), "h:mm a");

          return (
            <div
              key={hour}
              className="h-16 border-r border-b flex items-center justify-center pr-2"
            >
              <span className="text-sm font-semibold">{formattedHour}</span>
            </div>
          );
        })}
      </div>
      <div className="flex-grow flex flex-col relative">
        {hours.map((hour) => (
          <div key={hour} className="h-16 border-b flex-grow relative">
            &nbsp;
          </div>
        ))}
        <div
          style={{ top: `${currentTimePosition}px` }}
          className="absolute left-0 w-full border-t-2 border-primary"
        >
          <div className="relative">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute left-0 -translate-y-1/2 size-3 rounded-full bg-blue-950" />
                </TooltipTrigger>
                <TooltipContent sideOffset={12}>
                  Current time:{" "}
                  <span className="font-semibold">
                    {timeFormat === "24H"
                      ? format(new Date(), "HH:mm")
                      : format(new Date(), "h:mm a")}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
