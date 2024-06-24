import { getUpcomingTask } from "@/actions/get-upcoming-task";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimePeriod } from "@/store/useTimePeriod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const SidebarTask = () => {
  const { timeFormat } = useTimePeriod();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["get-upcoming-task"],
    queryFn: async () => await getUpcomingTask(),
  });

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-y-2">
        <Skeleton className="w-20 h-4" />
        <div className="flex flex-col gap-y-3 border rounded-md p-2 md:p-4 text-sm shadow-md h-[136px]">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex flex-col items-center gap-y-4 py-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    );
  }

  const heading = data
    ? data?.isCurrent
      ? "Current Task:"
      : "Incoming Task:"
    : null;

  return (
    <div className="w-full flex flex-col gap-y-1">
      <h4 className="text-zinc-950">{heading}</h4>
      {!data || isError ? (
        <div className="flex items-center justify-center border rounded-md p-2 md:p-4 text-sm shadow-md">
          <p className="font-semibold">No upcoming tasks for today!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 border rounded-md p-2 md:p-4 text-sm shadow-md">
          <div className="flex items-center gap-x-2">
            <p>Start Time:</p>
            <span className="font-semibold">
              {timeFormat === "24H"
                ? format(new Date(data.startTime), "HH:mm")
                : format(new Date(data.startTime), "h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <p>End time:</p>
            <span className="font-semibold">
              {timeFormat === "24H"
                ? format(new Date(data.endTime), "HH:mm")
                : format(new Date(data.endTime), "h:mm a")}
            </span>
          </div>
          <div className=" text-center flex flex-col gap-y-1">
            <p>Title:</p>
            <span className="font-semibold">{data.title}</span>
          </div>
        </div>
      )}
    </div>
  );
};
