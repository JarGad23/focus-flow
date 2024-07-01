import { Task } from "@prisma/client";
import { TaskSchema } from "@/schemas/create-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { FormTitleDescriptionFields } from "./form-components/form-title-description-fields";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { creationUpdateTaskEvent } from "@/actions/creation-update-task-event";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  addMinutes,
  endOfDay,
  format,
  parse,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { generateTimeBlocks } from "@/lib/utils";
import { FormTimeSelectors } from "./form-components/form-time-selectors";
import { FormPrioritySelector } from "./form-components/form-priority-selector";
import { Button } from "./ui/button";
import { FormStatusSelector } from "./form-components/form-status-selector";
import { useSelectedDate } from "@/store/useSelectedDate";

type Props = {
  task: Task;
  timeFormat: "12H" | "24H";
  onDialogClose: () => void;
};

type TaskFormData = z.infer<typeof TaskSchema>;

export const TaskDialogForm = ({ task, timeFormat, onDialogClose }: Props) => {
  const { week } = useSelectedDate();
  const queryClient = useQueryClient();

  const { mutate: update, isPending: isPending } = useMutation({
    mutationKey: ["update-task"],
    mutationFn: creationUpdateTaskEvent,
    onError: () => {
      toast.error("Failed to update task");
    },
    onSuccess: () => {
      toast.success("Task updated successfull");
      queryClient.invalidateQueries({
        queryKey: ["get-day-tasks", task.day],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-week-tasks", week],
      });
      onDialogClose();
    },
  });

  const [startDateOptions, setStartDateOptions] = useState<string[]>([]);
  const [endDateOptions, setEndDateOptions] = useState<string[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [isFormChangedAndValid, setIsFormChangedAndValid] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      day: task.day,
      description: task.description || undefined,
      title: task.title,
      endTime: task.endTime,
      startTime: task.startTime,
      priority: task.priority,
      status: task.status,
    },
  });

  const watchedFields: TaskFormData = form.watch();

  useEffect(() => {
    const isChanged = Object.keys(watchedFields).some(
      (key) =>
        watchedFields[key as keyof TaskFormData]?.toString() !==
        task[key as keyof TaskFormData]?.toString()
    );

    setIsFormChangedAndValid(isChanged && form.formState.isValid);
  }, [watchedFields, form.formState.isValid, task]);

  useEffect(() => {
    const startOfTheDay = startOfDay(task.day);
    const endOfTheDay = setMinutes(setHours(endOfDay(task.day), 23), 45);

    const startOptions = generateTimeBlocks(
      startOfTheDay,
      endOfTheDay,
      timeFormat
    );
    const endOptions = generateTimeBlocks(
      startOfTheDay,
      endOfTheDay,
      timeFormat
    );

    setStartDateOptions(startOptions);
    setEndDateOptions(endOptions);

    form.setValue("startTime", task.startTime);
    form.setValue("endTime", task.endTime);
  }, [timeFormat, form, task]);

  const handleStartDateChange = (value: string) => {
    const dateFormat = "yyyy-MM-dd";
    const timeFormatString = timeFormat === "24H" ? "HH:mm" : "hh:mm a";
    const dateTimeFormat = `${dateFormat}${timeFormatString}`;

    const dateStr = format(task.day, dateFormat);
    const dateTimeStr = `${dateStr}${value}`;

    const startTime = parse(dateTimeStr, dateTimeFormat, new Date());

    setSelectedStartDate(startTime);

    const endOptions = generateTimeBlocks(
      addMinutes(startTime, 15),
      endOfDay(task.day),
      timeFormat
    );
    setEndDateOptions(endOptions);

    form.setValue("startTime", startTime);
  };

  const handleEndDateChange = (value: string) => {
    const dateFormat = "yyyy-MM-dd";
    const timeFormatString = timeFormat === "24H" ? "HH:mm" : "hh:mm a";
    const dateTimeFormat = `${dateFormat}${timeFormatString}`;

    const dateStr = format(task.day, dateFormat);
    const dateTimeStr = `${dateStr}${value}`;

    const endTime = parse(dateTimeStr, dateTimeFormat, new Date());
    form.setValue("endTime", endTime);
  };

  const onSubmit = (data: TaskFormData) => {
    update({
      data,
      type: "task",
      id: task.id,
    });
  };

  return (
    <FormProvider {...form}>
      <form
        className="px-2 pt-2 md:pt-6 w-full space-y-4 max-w-6xl mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormTitleDescriptionFields type="task" disabled={isPending} />
        <FormTimeSelectors
          endDateOptions={endDateOptions}
          handleEndDateChange={handleEndDateChange}
          handleStartDateChange={handleStartDateChange}
          startDateOptions={startDateOptions}
          selectedStartDate={selectedStartDate}
          timeFormat={timeFormat}
          disabled={isPending}
        />
        <FormPrioritySelector disabled={isPending} />
        <FormStatusSelector disabled={isPending} />
        <div className="w-full flex justify-end">
          <Button
            className="w-full lg:w-40"
            type="submit"
            disabled={isPending || !isFormChangedAndValid}
          >
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
