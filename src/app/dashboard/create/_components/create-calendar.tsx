import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
};

export const CreateCalendar = ({ date, setDate }: Props) => {
  return (
    <div className="flex justify-between lg:flex-col lg:justify-start lg:gap-y-8">
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <h2 className="text-xl lg:text-3xl">Create</h2>
          <Plus className="h-6 w-6 lg:h-8 lg:w-8 text-primary bg-neutral-100 rounded-full shadow-md p-1" />
        </div>
        <p className="text-muted-foreground text-sm">
          Fill the form with information about task/event you want to create.
        </p>
      </div>
      <div className="flex flex-col lg:hidden">
        <div className="bg-neutral-800 p-[10px] shadow-lg rounded-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              <CalendarIcon className="text-neutral-200" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="lg:hidden">
              <Calendar
                ISOWeek
                mode="single"
                selected={date}
                onSelect={setDate}
                captionLayout="dropdown-buttons"
                fromYear={1960}
                toYear={2030}
                required
                disabled={(date) => date < new Date()}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* TODO: Implement samll screen dropdown calendar and dropdown AI Helper on pro */}
      </div>
      <div className="hidden lg:flex flex-col gap-y-2">
        <h3 className="text-lg">
          Selected date:{" "}
          <span className="text-primary font-semibold">
            {format(date, "dd MMM yyyy")}
          </span>
        </h3>
        <Calendar
          ISOWeek
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown-buttons"
          fromYear={1960}
          toYear={2030}
          className="bg-neutral-100/50 rounded-lg shadow-lg p-8 w-fit border"
          required
          disabled={(date) => date < new Date()}
        />
      </div>
    </div>
  );
};
