import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  EventSchema,
  PriorityEnum,
  StatusEnum,
  TaskSchema,
} from "@/schemas/create-form-schema";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTimePeriod } from "@/store/useTimePeriod";
import { useEffect, useState } from "react";
import {
  addMinutes,
  endOfDay,
  format,
  isToday,
  parse,
  startOfDay,
} from "date-fns";
import { cn, generateTimeBlocks, getNext15MinuteBlock } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  type: string;
  date: Date;
};

type FormData = z.infer<typeof TaskSchema> | z.infer<typeof EventSchema>;

export const CreateForm = ({ type, date }: Props) => {
  const router = useRouter();
  const { timeFormat } = useTimePeriod();

  const handleTypeValueChange = (value: string) => {
    router.push(`?type=${value}`);
  };

  const schema =
    type === "task" ? TaskSchema : type === "event" ? EventSchema : null;

  const form = useForm<FormData>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: {
      day: date,
      priority: "medium",
      status: "incompleted",
    },
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

  const handlEndDateChange = (value: string) => {
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
      <div className="flex flex-col gap-y-2">
        <h3 className="text-xl font-semibold">
          {type !== "" ? (
            <>
              Selected type: <span className="text-primary">{type}</span>
            </>
          ) : (
            <>Select creation type:</>
          )}
        </h3>
        <Select value={type} onValueChange={handleTypeValueChange}>
          <SelectTrigger className="max-w-80 focus:ring-offset-0 focus:ring-transparent outline-none">
            <SelectValue placeholder="Task/Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="event">Event</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {type === "task" || type === "event" ? (
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Write some code" {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormDescription>
                    Describe details about your{" "}
                    {type === "task" ? "task" : "event"}. This field is optional
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Complete one feature in major functionality in app"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {type === "task" ? (
              <div className="space-y-6">
                <div className="w-full flex items-center gap-x-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                              handlEndDateChange(value);
                            }}
                            disabled={!selectedStartDate}
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
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-x-4 xl:gap-x-8">
                          <div
                            className={cn(
                              "size-8 rounded-sm",
                              field.value === "low"
                                ? "bg-green-500"
                                : field.value === "medium"
                                ? "bg-orange-400"
                                : "bg-rose-500"
                            )}
                          />
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full focus:ring-offset-0 focus:ring-transparent outline-none">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {PriorityEnum.options.map((option) => (
                                <SelectItem value={option} key={option}>
                                  <span className="capitalize">{option}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full focus:ring-offset-0 focus:ring-transparent outline-none">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {StatusEnum.options.map((option) => (
                              <SelectItem value={option} key={option}>
                                <span className="capitalize">
                                  {option === "inProgress"
                                    ? "In progress"
                                    : option}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div></div>
            )}
            <div className="w-full flex justify-end">
              <Button className="w-full lg:w-40" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      ) : null}
    </div>
  );
};
