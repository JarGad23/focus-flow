"use client";

import { getDayTasks } from "@/actions/get-day-tasks";
import { getMonthEvents } from "@/actions/get-month-events";
import { ErrorUI } from "@/components/error-ui";
import { EventAccordion } from "@/components/event-accordion";
import { LoadingUI } from "@/components/loading-ui";
import { TaskAccordion } from "@/components/task-accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Ghost, Plus } from "lucide-react";
import Link from "next/link";

const EventsPage = () => {
  const { month, year } = useSelectedDate();
  const {
    data: events,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["get-month-events", month, year],
    queryFn: async () => getMonthEvents({ month, year }),
  });

  if (isLoading) {
    return <LoadingUI />;
  }

  if (isError || !events) {
    return <ErrorUI />;
  }

  return (
    <div className="w-full p-4 lg:p-8 max-w-7xl mx-auto mt-8 flex flex-col gap-y-4">
      <div className="w-full flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Events for for{" "}
            <span className="text-primary">
              {format(new Date(year, month), "MMMM yyyy")}
            </span>
          </h2>
        </div>
        <div className="flex items-center">
          <Link href="/dashboard/create?type=event">
            <Button className="w-full flex items-center gap-x-2">
              Create Event
              <Plus className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
      {events.length === 0 ? (
        <div className="w-full h-[500px] flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center gap-x-4">
            <Ghost className="size-6" />
            <p className="text-lg">
              Your event list looks empty, do you want to create one ?
            </p>
          </div>
          <Link href="/dashboard/create?type=event">
            <Button className="w-full flex items-center gap-x-2">
              Create Event
              <Plus className="size-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <ScrollArea className="w-full flex flex-col max-h-[500px] shadow-md">
          {events.map((event) => (
            <EventAccordion event={event} />
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default EventsPage;
