import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";

export const MonthView = () => {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  const daysInMonth = eachDayOfInterval({ start, end });

  return (
    <div className="grid grid-cols-7 gap-2">
      {daysInMonth.map((day) => (
        <div key={day.toISOString()} className="border p-2">
          {format(day, "d")}
        </div>
      ))}
    </div>
  );
};
