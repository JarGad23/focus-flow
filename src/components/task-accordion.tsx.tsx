import { Priority, Status, Task } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "@/lib/utils";
import { Calendar, Edit, FileWarning, TrendingUp } from "lucide-react";
import { useTimePeriod } from "@/store/useTimePeriod";
import { format } from "date-fns";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TaskSchema } from "@/schemas/create-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";

type Props = {
  task: Task;
};

type TaskFormData = z.infer<typeof TaskSchema>;

export const TaskAccordion = ({ task }: Props) => {
  const { timeFormat } = useTimePeriod();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      ...task,
    } as Partial<TaskFormData>,
  });

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isEditing) {
      e.preventDefault();
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <Accordion type="multiple" className="bg-white my-2">
      <AccordionItem value={task.title} className="px-4 rounded-md shadow-md">
        <AccordionTrigger className="flex justify-between items-center">
          <div
            className={cn(
              "w-full text-left",
              task.status === Status.completed &&
                "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-x-2 mr-2"
            onClick={onClick}
          >
            Edit
            <Edit className="size-5" />
          </Button>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-y-2">
          {isEditing ? (
            <FormProvider {...form}>
              <form>
                {/* Description Field */}
                {/* Time fields */}
                {/* Priority Fields */}
                {/* Status Fields */}
              </form>
            </FormProvider>
          ) : (
            <>
              {task.description ? (
                <p>{task.description}</p>
              ) : (
                <p className="text-muted-foreground">
                  This task has no description
                </p>
              )}
              <div className="flex items-center gap-x-4 text-[15px]">
                <Calendar className="size-5" />
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
              <div className="flex items-center gap-x-4">
                <FileWarning className="size-5" />
                <p className="capitalize text-[15px] font-semibold">
                  Priority:{" "}
                  <span
                    className={cn(
                      task.priority === Priority.high && "text-rose-500",
                      task.priority === Priority.low && "text-green-500",
                      task.priority === Priority.medium && "text-blue-500"
                    )}
                  >
                    {task.priority}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-x-4">
                <TrendingUp className="size-5" />
                <p className="capitalize text-[15px] font-semibold">
                  Status:{" "}
                  <span
                    className={cn(
                      task.status === Status.incompleted && "text-rose-500",
                      task.status === Status.completed && "text-green-500",
                      task.status === Status.inProgress && "text-blue-500"
                    )}
                  >
                    {task.status}
                  </span>
                </p>
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
