import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

type Props = {
  startDateOptions: string[];
  endDateOptions: string[];
  handleStartDateChange: (value: string) => void;
  handleEndDateChange: (value: string) => void;
  selectedStartDate: Date | null;
  timeFormat: string;
  disabled: boolean;
};

export const FormTimeSelectors = ({
  selectedStartDate,
  endDateOptions,
  handleEndDateChange,
  handleStartDateChange,
  timeFormat,
  startDateOptions,
  disabled,
}: Props) => {
  const { control } = useFormContext();

  return (
    <div className="w-full flex items-center gap-x-4">
      <FormField
        control={control}
        name="startTime"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Start Time</FormLabel>
            <FormControl>
              <Select
                value={
                  field.value
                    ? format(
                        field.value,
                        timeFormat === "24H" ? "HH:mm" : "hh:mm a"
                      )
                    : ""
                }
                onValueChange={(value) => {
                  handleStartDateChange(value);
                }}
                disabled={disabled}
              >
                <SelectTrigger className="max-w-80 focus:ring-offset-0 focus:ring-transparent outline-none">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {startDateOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="endTime"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>End Time</FormLabel>
            <FormControl>
              <Select
                value={
                  field.value
                    ? format(
                        field.value,
                        timeFormat === "24H" ? "HH:mm" : "hh:mm a"
                      )
                    : ""
                }
                onValueChange={(value) => {
                  handleEndDateChange(value);
                }}
                disabled={!selectedStartDate || disabled}
              >
                <SelectTrigger className="max-w-80 focus:ring-offset-0 focus:ring-transparent outline-none">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {endDateOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
