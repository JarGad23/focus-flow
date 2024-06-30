"use client";

import { getMonthEvents } from "@/actions/get-month-events";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { ErrorUI } from "@/components/error-ui";
import { EventAccordion } from "@/components/event-accordion";
import { LoadingUI } from "@/components/loading-ui";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeleteModal } from "@/store/use-delete-modal";
import { useSelectedDate } from "@/store/useSelectedDate";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Ghost, Plus } from "lucide-react";
import Link from "next/link";

const EventsPage = () => {
  const { onConfirm } = useDeleteModal();
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
        <ScrollArea className="relative w-full flex flex-col max-h-[500px] shadow-md">
          {events.map((event) => (
            <EventAccordion event={event} />
          ))}
        </ScrollArea>
      )}
      <div className="w-1/2 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-y-4">
        <h4 className="text-xl font-semibold">Month overview</h4>
        <div className="flex flex-col gap-y-1">
          {events.map((event, index) => (
            <div className="flex items-center justify-between">
              <p className="flex gap-x-1">
                {index + 1}.<span className="font-semibold">{event.title}</span>
              </p>
              <div className="flex items-center gap-x-1 font-semibold">
                {format(event.day, "dd MMMM yyyy")}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmationModal type="event" onConfirm={onConfirm} />
    </div>
  );
};

export default EventsPage;
