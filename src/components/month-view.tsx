import { useSelectedDate } from "@/store/useSelectedDate";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addDays,
  startOfWeek,
  isSameMonth,
  endOfWeek,
} from "date-fns";
import { MonthDayCard } from "./month-day-card";
import { ElementRef, useRef, useState } from "react";

export const MonthView = () => {
  const { month, year } = useSelectedDate();

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

  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const startWeek = startOfWeek(start, { weekStartsOn: 1 });
  const endWeek = endOfWeek(end, { weekStartsOn: 1 });

  const weeksArray = [];
  let currentWeekStart = startWeek;

  while (currentWeekStart <= endWeek) {
    const week = eachDayOfInterval({
      start: currentWeekStart,
      end: addDays(currentWeekStart, 6),
    }).map((day) => ({
      dayOfMonth: format(day, "d"),
      fullDate: day,
      isCurrentMonth: isSameMonth(day, start),
      monthAbbreviation: format(day, "MMM"),
    }));

    weeksArray.push(week);
    currentWeekStart = addDays(currentWeekStart, 7);
  }

  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  }).map((day) => format(day, "EEE"));

  return (
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
      }}
    >
      <div className="flex flex-col">
        <div className="flex flex-nowrap">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="border p-4 flex-shrink-0 bg-neutral-100 w-[calc(100%/2)] md:w-[calc(100%/3)] lg:w-[calc(100%/5)] 2xl:w-[calc(100%/7)]"
            >
              <div className="text-center font-bold">{day}</div>
            </div>
          ))}
        </div>
        {weeksArray.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-nowrap">
            {week.map(
              (
                { dayOfMonth, fullDate, isCurrentMonth, monthAbbreviation },
                dayIndex
              ) => (
                <div
                  key={dayIndex}
                  className={`border p-4 flex-shrink-0  w-[calc(100%/2)] md:w-[calc(100%/3)] lg:w-[calc(100%/5)] 2xl:w-[calc(100%/7)] ${
                    isCurrentMonth ? "" : "bg-gray-200"
                  }`}
                >
                  <MonthDayCard
                    dayOfMonth={dayOfMonth}
                    fullDate={fullDate}
                    monthAbbreviation={monthAbbreviation}
                    isFirstDayOfMonth={isCurrentMonth && dayOfMonth === "1"}
                  />
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// className =
//   "border p-4 flex-shrink-0 w-[calc(100%/2)] md:w-[calc(100%/3)] lg:w-[calc(100%/5)] 2xl:w-[calc(100%/7)]";
