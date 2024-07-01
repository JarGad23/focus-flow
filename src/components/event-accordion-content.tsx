import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

type Props = {
  description: string | null;
  fullDate: Date;
  isAllDay: boolean;
};

export const EventAccordionContent = ({
  description,
  fullDate,
  isAllDay,
}: Props) => {
  return (
    <>
      {description ? (
        <p>{description}</p>
      ) : (
        <p className="text-muted-foreground">This event has no description</p>
      )}
      <div className="flex items-center gap-x-4 md:text-[15px]">
        <Calendar className="size-5" />
        <p className="font-semibold">{format(fullDate, "dd MMMM yyyy")}</p>
      </div>
      <div className="flex items-center gap-x-4 text-[15px]">
        <Clock className="flex-shrink-0 size-5" />
        <p>
          {isAllDay
            ? "This event is planned to take whole day."
            : "This event won't take whole day."}
        </p>
      </div>
    </>
  );
};
