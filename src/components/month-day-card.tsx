import { Event } from "@prisma/client";

type Props = {
  fullDate: Date;
  dayOfMonth: string;
  monthAbbreviation: string;
  isFirstDayOfMonth: boolean;
  events: Event[];
};

export const MonthDayCard = ({
  fullDate,
  dayOfMonth,
  monthAbbreviation,
  isFirstDayOfMonth,
  events,
}: Props) => {
  return (
    <div className="w-full absolute top-[10px] flex flex-col items-center p-1 gap-y-1">
      <span>
        {dayOfMonth} {isFirstDayOfMonth ? monthAbbreviation : ""}
      </span>
      {events.map((event) => (
        <div className="w-full rounded-md p-1 bg-primary text-neutral-100">
          <span className="text-sm">{event.title}</span>
        </div>
      ))}
    </div>
  );
};
