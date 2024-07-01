import { useTimePeriod } from "@/store/useTimePeriod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { getDayTasks } from "@/actions/get-day-tasks";
import { useSelectedDate } from "@/store/useSelectedDate";
import { LoadingUI } from "./loading-ui";
import { ErrorUI } from "./error-ui";
import { calculateTaskPosition, cn, getOverlappingTasks } from "@/lib/utils";
import { Priority } from "@prisma/client";
import { TaskDialog } from "./task-dialog";

export const DayView = () => {
  const { timeFormat } = useTimePeriod();
  const { day } = useSelectedDate();
  const [currentTimePosition, setCurrentTimePosition] = useState(0);

  const {
    data: tasks,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["get-day-tasks", day],
    queryFn: async () => getDayTasks({ date: day }),
  });

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

  if (isLoading) {
    return <LoadingUI />;
  }

  if (isError) {
    return <ErrorUI />;
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const overlappingTasksGroups = getOverlappingTasks(tasks || []);

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
        {overlappingTasksGroups.map((group, groupIndex) => {
          const numTasks = group.length;
          const taskWidth = 100 / numTasks;

          return group.map((task, taskIndex) => {
            const { startPosition, taskHeight } = calculateTaskPosition(task);

            return (
              <TaskDialog key={task.id} task={task}>
                <div
                  key={task.id}
                  className={cn(
                    "absolute bg-blue-500 p-2 rounded-lg shadow-md flex items-center gap-x-2 cursor-pointer hover:z-[9999] hover:ring-2 ring-neutral-900 hover:!w-full transition",
                    task.priority === Priority.high && "bg-rose-500",
                    task.priority === Priority.low && "bg-green-500"
                  )}
                  style={{
                    top: `${startPosition}px`,
                    left: `${taskIndex * taskWidth}%`,
                    width: `${taskWidth}%`,
                    height: `${taskHeight}px`,
                  }}
                >
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm">
                    {timeFormat === "24H"
                      ? `${format(
                          new Date(task.startTime),
                          "HH:mm"
                        )} - ${format(new Date(task.endTime), "HH:mm")}`
                      : `${format(
                          new Date(task.startTime),
                          "h:mm a"
                        )} - ${format(new Date(task.endTime), "h:mm a")}`}
                  </div>
                </div>
              </TaskDialog>
            );
          });
        })}
        <div
          style={{ top: `${currentTimePosition}px` }}
          className="absolute left-0 w-full border-t-2 border-primary"
        >
          <div className="relative">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute -left-[6px] -translate-y-1/2 size-3 rounded-full bg-blue-950" />
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
