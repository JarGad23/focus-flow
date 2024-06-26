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
import { useQuery } from "@tanstack/react-query";
import { getWeekTasks } from "@/actions/get-week-tasks";
import { LoadingUI } from "./loading-ui";
import { ErrorUI } from "./error-ui";
import {
  calculateTaskPosition,
  calculateTaskPositionAndWidth,
  cn,
  getOverlappingTasks,
} from "@/lib/utils";
import { Priority } from "@prisma/client";

export const WeekView = () => {
  const { week } = useSelectedDate();
  const { timeFormat } = useTimePeriod();
  const [currentTimePosition, setCurrentTimePosition] = useState(0);

  const {
    data: tasks,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["get-week-tasks", week],
    queryFn: async () => getWeekTasks({ week }),
  });

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

  if (isLoading) {
    return <LoadingUI />;
  }

  if (isError) {
    return <ErrorUI />;
  }

  const tasksByDay = days.map(
    (day) =>
      tasks?.filter(
        (task) => new Date(task.startTime).toDateString() === day.toDateString()
      ) || []
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
            {days.map((day, index) => {
              const dayTasks = tasksByDay[index];
              const overlappingTasksGroups = getOverlappingTasks(dayTasks);

              return (
                <div
                  key={index}
                  className="flex flex-col border-r flex-shrink-0 w-[calc(100%/1)] md:w-[calc(100%/3)] xl:w-[calc(100%/5)] 2xl:w-[calc(100%/7)]"
                >
                  <div className="flex items-center justify-center bg-gray-100 border-b h-10">
                    <span className="text-lg font-semibold">
                      {format(day, "EEE d")}
                    </span>
                  </div>
                  <div className="flex-grow relative">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="h-16 border-b flex-grow relative"
                      >
                        &nbsp;
                      </div>
                    ))}
                    {overlappingTasksGroups.map((group, groupIndex) => {
                      const numTasks = group.length;

                      return group.map((task, taskIndex) => {
                        const { startPosition, taskHeight, left, width } =
                          calculateTaskPositionAndWidth(
                            task,
                            taskIndex,
                            numTasks
                          );

                        return (
                          <div
                            key={task.id}
                            className={cn(
                              "absolute bg-blue-500 p-2 rounded-lg shadow-md text-[12px] line-clamp-1 truncate leading-[12px]",
                              taskHeight === 16 &&
                                "flex flex-row items-center gap-x-2 leading-normal",
                              task.priority === Priority.high && "bg-rose-500",
                              task.priority === Priority.low && "bg-green-500"
                            )}
                            style={{
                              top: `${startPosition}px`,
                              height: `${taskHeight}px`,
                              left: `${left}%`,
                              width: `${width}%`,
                            }}
                          >
                            <div className="font-semibold">{task.title}</div>
                            <div className="text-[10px]">
                              {timeFormat === "24H"
                                ? `${format(
                                    new Date(task.startTime),
                                    "HH:mm"
                                  )} - ${format(
                                    new Date(task.endTime),
                                    "HH:mm"
                                  )}`
                                : `${format(
                                    new Date(task.startTime),
                                    "h:mm a"
                                  )} - ${format(
                                    new Date(task.endTime),
                                    "h:mm a"
                                  )}`}
                            </div>
                          </div>
                        );
                      });
                    })}

                    <div
                      style={{
                        top: `${currentTimePosition}px`,
                        width: "calc(100% + 8px)",
                        left: "-8px",
                      }}
                      className="absolute border-t-2 border-primary"
                    >
                      <div className="relative">
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {index === 0 && (
                                <div className="absolute -translate-y-1/2 size-3 rounded-full bg-blue-950" />
                              )}
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
