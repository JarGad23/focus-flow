import { EventSchema, TaskSchema } from "@/schemas/create-form-schema";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { ZodSchema, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTimePeriod } from "@/store/useTimePeriod";
import { useEffect, useState } from "react";
import {
  addMinutes,
  endOfDay,
  format,
  getMonth,
  getYear,
  isToday,
  parse,
  startOfDay,
} from "date-fns";
import { generateTimeBlocks, getNext15MinuteBlock } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormTypeSelector } from "./form-type-selector";
import { FormTimeSelectors } from "./form-time-selectors";
import { FormPrioritySelector } from "./form-priority-selector";
import { FormStatusSelector } from "./form-status-selector";
import { FormTitleDescriptionFields } from "./form-title-description-fields";
import { FormAllDayCheckbox } from "./form-all-day-checkbox";

type Props = {
  type: string;
  date: Date;
};

type TaskFormData = z.infer<typeof TaskSchema>;
type EventFormData = z.infer<typeof EventSchema>;
type FormData = TaskFormData | EventFormData;

export const CreateForm = ({ type, date }: Props) => {
  const router = useRouter();
  const { timeFormat } = useTimePeriod();

  const [schema, setSchema] = useState<ZodSchema>(TaskSchema);

  useEffect(() => {
    if (type === "task") {
      setSchema(TaskSchema);
    } else if (type === "event") {
      setSchema(EventSchema);
    }
  }, [type]);

  const handleTypeValueChange = (value: string) => {
    router.push(`?type=${value}`);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      day: date,
      month: getMonth(date),
      year: getYear(date),
      priority: "medium",
      status: "incompleted",
    } as Partial<FormData>,
  });

  const [startDateOptions, setStartDateOptions] = useState<string[]>([]);
  const [endDateOptions, setEndDateOptions] = useState<string[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    const startOfSelectedDay = isToday(date)
      ? getNext15MinuteBlock(now)
      : startOfDay(date);
    const endOfSelectedDay = endOfDay(date);

    const startOptions = generateTimeBlocks(
      startOfSelectedDay,
      endOfSelectedDay,
      timeFormat
    );
    setStartDateOptions(startOptions);
    setEndDateOptions([]);
    setSelectedStartDate(null);
    form.reset({ day: date, startTime: undefined, endTime: undefined });
  }, [date, timeFormat, form]);

  useEffect(() => {
    if (type === "event") {
      form.setValue("month", date.getMonth());
      form.setValue("year", date.getFullYear());
    }
  }, [date, form, type]);

  useEffect(() => {
    const resetValues: Partial<FormData> = {
      day: date,
      month: getMonth(date),
      year: getYear(date),
      title: "",
      description: "",
      priority: "medium",
      status: "incompleted",
      startTime: undefined,
      endTime: undefined,
    };

    if (type === "event") {
      (resetValues as Partial<EventFormData>).isAllDay = false;
    }
    form.reset(resetValues);
  }, [date, form, type]);

  const handleStartDateChange = (value: string) => {
    const dateFormat = "yyyy-MM-dd";
    const timeFormatString = timeFormat === "24H" ? "HH:mm" : "hh:mm a";
    const dateTimeFormat = `${dateFormat}${timeFormatString}`;

    const dateStr = format(date, dateFormat);
    const dateTimeStr = `${dateStr}${value}`;

    const startTime = parse(dateTimeStr, dateTimeFormat, new Date());

    setSelectedStartDate(startTime);

    const endOptions = generateTimeBlocks(
      addMinutes(startTime, 15),
      endOfDay(date),
      timeFormat
    );
    setEndDateOptions(endOptions);
    form.setValue("startTime", startTime);
  };

  const handleEndDateChange = (value: string) => {
    const dateFormat = "yyyy-MM-dd";
    const timeFormatString = timeFormat === "24H" ? "HH:mm" : "hh:mm a";
    const dateTimeFormat = `${dateFormat}${timeFormatString}`;

    const dateStr = format(date, dateFormat);
    const dateTimeStr = `${dateStr}${value}`;

    const endTime = parse(dateTimeStr, dateTimeFormat, new Date());

    form.setValue("endTime", endTime);
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-y-6">
      <FormTypeSelector
        type={type}
        handleTypeValueChange={handleTypeValueChange}
      />
      {type === "task" || type === "event" ? (
        <FormProvider {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormTitleDescriptionFields type={type} />
            {type === "task" ? (
              <div className="space-y-6">
                <FormTimeSelectors
                  endDateOptions={endDateOptions}
                  handleEndDateChange={handleEndDateChange}
                  handleStartDateChange={handleStartDateChange}
                  selectedStartDate={selectedStartDate}
                  startDateOptions={startDateOptions}
                  timeFormat={timeFormat}
                />
                <FormPrioritySelector />
                <FormStatusSelector />
              </div>
            ) : (
              <FormAllDayCheckbox />
            )}
            <div className="w-full flex justify-end">
              <Button className="w-full lg:w-40" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      ) : null}
    </div>
  );
};
