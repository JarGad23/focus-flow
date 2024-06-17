import { useSelectedDate } from "@/store/useSelectedDate";
import { useTimePeriod } from "@/store/useTimePeriod";
import { format } from "date-fns";
import { ElementRef, useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const WeekView = () => {
  const { week } = useSelectedDate();
  const { timeFormat } = useTimePeriod();
  const [currentTimePosition, setCurrentTimePosition] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const scrollContainerRef = useRef<ElementRef<"div">>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(
      e.pageX - scrollContainerRef.current.getBoundingClientRect().left
    );
    setScrollStart(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (!scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.getBoundingClientRect().left;
    const walk = x - startX;
    const scrollTarget = scrollStart - walk;

    scrollContainerRef.current.scrollTo({
      left: scrollTarget,
      behavior: "auto",
    });
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
  };

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
  const days = Array.from(
    { length: 7 },
    (_, i) => new Date(week[0].getTime() + i * 86400000)
  );

  return (
    <div className="flex relative">
      <div className="flex-none w-16 bg-gray-50 border-r mt-10">
        {hours.map((hour) => {
          const formattedHour =
            timeFormat === "24H"
              ? format(new Date(2022, 1, 1, hour), "HH:mm")
              : format(new Date(2022, 1, 1, hour), "h:mm a");
          return (
            <div
              key={hour}
              className="h-16 border-b flex items-center justify-center pr-2"
            >
              <span className="text-sm font-semibold">{formattedHour}</span>
            </div>
          );
        })}
      </div>
      <div
        className="relative flex-grow cursor-grab"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          flexDirection: "column-reverse",
        }}
      >
        <div className="flex flex-col-reverse" style={{ minWidth: "100%" }}>
          <div
            className="relative flex md:flex-nowrap select-none"
            style={{ minWidth: "100%" }}
          >
            {days.map((day, index) => (
              <div
                key={index}
                className="flex flex-col border-r flex-shrink-0 w-[calc(100%/1)] md:w-[calc(100%/3)] xl:w-[calc(100%/5)] 2xl:w-[calc(100%/7)]"
              >
                <div className="flex items-center justify-center bg-gray-100 border-b h-10">
                  <span className="text-lg font-semibold">
                    {format(day, "EEE d")}
                  </span>
                </div>
                <div className="flex-grow">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b flex-grow relative"
                    >
                      &nbsp;
                    </div>
                  ))}
                  {index === 0 && (
                    <div
                      style={{ top: `${currentTimePosition}px` }}
                      className="absolute left-0 min-w-full border-t-2 border-primary"
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
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
