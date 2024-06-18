import { format } from "date-fns";

type Props = {
  fullDate: Date;
  dayOfMonth: string;
  monthAbbreviation: string;
  isFirstDayOfMonth: boolean;
};

export const MonthDayCard = ({
  fullDate,
  dayOfMonth,
  monthAbbreviation,
  isFirstDayOfMonth,
}: Props) => {
  return (
    <div className="flex flex-col items-center p-10">
      <span>
        {dayOfMonth} {isFirstDayOfMonth ? monthAbbreviation : ""}
      </span>
      {/* Add your day content here */}
    </div>
  );
};
