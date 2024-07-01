import { useEventDialog } from "@/store/use-event-dialog";
import { Event } from "@prisma/client";

type Props = {
  dayOfMonth: string;
  monthAbbreviation: string;
  isFirstDayOfMonth: boolean;
  events: Event[];
};

export const MonthDayCard = ({
  dayOfMonth,
  monthAbbreviation,
  isFirstDayOfMonth,
  events,
}: Props) => {
  const { onOpen } = useEventDialog();

  return (
    <div className="w-full absolute top-[10px] flex flex-col items-center p-1 gap-y-1">
      <span>
        {dayOfMonth} {isFirstDayOfMonth ? monthAbbreviation : ""}
      </span>
      {events.map((event) => (
        <div
          className="w-full rounded-md p-1 bg-primary text-neutral-100 hover:ring-2 ring-neutral-900 transition"
          onClick={() => onOpen(event)}
        >
          <span className="text-sm">{event.title}</span>
        </div>
      ))}
    </div>
  );
};
