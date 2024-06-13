import { useTimePeriod } from "@/store/useTimePeriod";
import { format, startOfWeek, addDays } from "date-fns";

export const WeekView = () => {
  const { timeFormat } = useTimePeriod();

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="overflow-x-scroll">
      <div className="flex min-w-max">
        <div className="flex flex-col">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-24 border-r flex items-center justify-center bg-gray-100"
            >
              {timeFormat === "24H"
                ? hour
                : format(new Date(2022, 1, 1, hour), "h a")}
            </div>
          ))}
        </div>
        <div className="flex flex-grow">
          {daysOfWeek.map((day) => (
            <div
              key={day.toISOString()}
              className="flex flex-col border p-2 w-full"
            >
              <div className="font-bold text-center mb-2">
                {format(day, "EEE")}
              </div>
              {hours.map((hour) => (
                <div key={hour} className="h-24 border-b relative flex-grow">
                  &nbsp;
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
