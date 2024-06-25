import { getUpcomingEvent } from "@/actions/get-upcoming-event";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const SidebarEvent = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["get-upcoming-event"],
    queryFn: async () => await getUpcomingEvent(),
  });

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-y-2">
        <Skeleton className="w-20 h-4" />
        <div className="flex flex-col gap-y-3 border rounded-md p-2 md:p-4 text-sm shadow-md h-24">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    );
  }

  const heading = data
    ? data?.isCurrent
      ? "Current Event:"
      : "Incoming Event:"
    : null;

  return (
    <div className="w-full flex flex-col gap-y-1">
      <h4 className="text-zinc-950">{heading}</h4>
      {!data || isError ? (
        <div className="flex items-center justify-center border rounded-md p-2 md:p-4 text-sm shadow-md">
          <p className="font-semibold">No upcoming events in your calendar!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 border rounded-md p-2 md:p-4 text-sm shadow-md">
          <div className="flex items-center gap-x-2">
            <p>Title:</p>
            <span className="font-semibold">{data.title}</span>
          </div>
          <div className="flex items-center gap-x-2">
            <p>Date:</p>
            <span className="font-semibold">
              {format(data.day, "dd LLL, y")}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            {data.isCurrent ? (
              <p>
                {data.isAllDay
                  ? "This event was planned to took a whole day"
                  : "This event won't take entire day"}
              </p>
            ) : (
              <div className="flex items-center gap-x-2">
                <p>Days left:</p>
                <span className="font-semibold">
                  {data.daysLeft === 1
                    ? `${data.daysLeft} day`
                    : `${data.daysLeft} days`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
