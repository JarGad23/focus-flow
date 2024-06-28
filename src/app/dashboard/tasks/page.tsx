"use client";

import { getDayTasks } from "@/actions/get-day-tasks";
import { ErrorUI } from "@/components/error-ui";
import { LoadingUI } from "@/components/loading-ui";
import { TaskAccordion } from "@/components/task-accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Ghost, Plus } from "lucide-react";
import Link from "next/link";

const TasksPage = () => {
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

  return (
    <div className="w-full p-4 lg:p-8 max-w-7xl mx-auto mt-8 flex flex-col gap-y-4">
      <div className="w-full flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
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
    </div>
  );
};

export default TasksPage;
