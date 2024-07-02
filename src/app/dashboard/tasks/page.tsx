"use client";

import { getDayTasks } from "@/actions/get-day-tasks";
import { ErrorUI } from "@/components/error-ui";
import { LoadingUI } from "@/components/loading-ui";
import { TaskAccordion } from "@/components/task-accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useTimePeriod } from "@/store/useTimePeriod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Ghost, Plus } from "lucide-react";
import Link from "next/link";

const TasksPage = () => {
  const { timeFormat } = useTimePeriod();
  const { day } = useSelectedDate();

  const {
    data: tasks,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["get-day-tasks", day],
    queryFn: async () => getDayTasks({ date: day }),
  });

  if (isLoading) {
    return <LoadingUI />;
  }

  if (isError || !tasks) {
    return <ErrorUI />;
  }

  const completedTasks = tasks.filter((task) => task.status === "completed");
  const inProgressTasks = tasks.filter((task) => task.status === "inProgress");
  const incompletedTasks = tasks.filter(
    (task) => task.status === "incompleted"
  );

  const sortedTasksArray = [...tasks];
  sortedTasksArray.sort(
    (a, b) => a.startTime.getHours() - b.startTime.getHours()
  );

  const completedPercentage = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="w-full p-4 lg:p-8 max-w-7xl mx-auto mt-8 flex flex-col gap-y-4">
      <div className="w-full flex flex-col gap-y-2 md:flex-row justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">
            Tasks for{" "}
            <span className="text-primary">{format(day, "dd MMM yyyy")}</span>
          </h2>
        </div>
        <div className="flex items-center">
          <Link href="/dashboard/create?type=task">
            <Button className="w-full flex items-center gap-x-2">
              Create Task
              <Plus className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
      {tasks.length === 0 ? (
        <div className="w-full h-[500px] flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center gap-x-4">
            <Ghost className="size-6" />
            <p className="text-lg">
              Your task list looks empty, do you want to create one ?
            </p>
          </div>
          <Link href="/dashboard/create?type=task">
            <Button className="w-full flex items-center gap-x-2">
              Create Task
              <Plus className="size-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <ScrollArea className="w-full flex flex-col max-h-[500px] shadow-md">
          {tasks.map((task) => (
            <TaskAccordion task={task} />
          ))}
        </ScrollArea>
      )}
      <div className="w-full flex flex-col gap-y-4 lg:flex-row md:gap-x-8">
        <div className="w-full bg-white shadow-lg rounded-lg p-4 flex flex-col gap-y-4">
          <h4 className="text-xl font-semibold">Day overview</h4>
          <div className="flex flex-col gap-y-1 text-sm sm:text-base">
            {sortedTasksArray.map((task, index) => (
              <div className="flex items-center justify-between">
                <p className="flex gap-x-1">
                  {index + 1}.<span className="truncate">{task.title}</span>
                </p>
                <div className="flex items-center gap-x-1 font-semibold">
                  {timeFormat === "24H"
                    ? format(new Date(task.startTime), "HH:mm")
                    : format(new Date(task.startTime), "h:mm a")}
                  <span>-</span>
                  {timeFormat === "24H"
                    ? format(new Date(task.endTime), "HH:mm")
                    : format(new Date(task.endTime), "h:mm a")}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full bg-white shadow-lg rounded-lg p-4 flex flex-col gap-y-4">
          <h4 className="text-xl font-semibold">Task complition</h4>
          <p className="flex justify-between items-center">
            Task Completed
            <span className="font-semibold">{completedTasks.length} </span>
          </p>
          <p className="flex justify-between items-center">
            Task In Progress
            <span className="font-semibold">{inProgressTasks.length} </span>
          </p>
          <p className="flex justify-between items-center">
            Task Incompleted
            <span className="font-semibold">{incompletedTasks.length} </span>
          </p>
          <Progress className="w-full" value={completedPercentage} />
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
