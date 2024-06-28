import { cn } from "@/lib/utils";
import { Priority, Status } from "@prisma/client";
import { format } from "date-fns";
import { Calendar, FileWarning, TrendingUp } from "lucide-react";

type Props = {
  description: string | null;
  timeFormat: string;
  startTime: Date;
  endTime: Date;
  priority: string;
  status: string;
};

export const TaskAccordionContent = ({
  description,
  endTime,
  startTime,
  status,
  timeFormat,
  priority,
}: Props) => {
  return (
    <>
      {description ? (
        <p>{description}</p>
      ) : (
        <p className="text-muted-foreground">This task has no description</p>
      )}
      <div className="flex items-center gap-x-4 text-[15px]">
        <Calendar className="size-5" />
        <div className="flex items-center gap-x-1 font-semibold">
          {timeFormat === "24H"
            ? format(new Date(startTime), "HH:mm")
            : format(new Date(startTime), "h:mm a")}
          <span>-</span>
          {timeFormat === "24H"
            ? format(new Date(endTime), "HH:mm")
            : format(new Date(endTime), "h:mm a")}
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <FileWarning className="size-5" />
        <p className="capitalize text-[15px] font-semibold">
          Priority:{" "}
          <span
            className={cn(
              priority === Priority.high && "text-rose-500",
              priority === Priority.low && "text-green-500",
              priority === Priority.medium && "text-blue-500"
            )}
          >
            {priority}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <TrendingUp className="size-5" />
        <p className="capitalize text-[15px] font-semibold">
          Status:{" "}
          <span
            className={cn(
              status === Status.incompleted && "text-rose-500",
              status === Status.completed && "text-green-500",
              status === Status.inProgress && "text-blue-500"
            )}
          >
            {status}
          </span>
        </p>
      </div>
    </>
  );
};
