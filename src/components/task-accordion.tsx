import { Status, Task } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn, generateTimeBlocks } from "@/lib/utils";
import { Edit, X } from "lucide-react";
import { useTimePeriod } from "@/store/useTimePeriod";
import {
  addMinutes,
  endOfDay,
  format,
  parse,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TaskSchema } from "@/schemas/create-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { FormTitleDescriptionFields } from "./form-components/form-title-description-fields";
import { FormTimeSelectors } from "./form-components/form-time-selectors";
import { FormPrioritySelector } from "./form-components/form-priority-selector";
import { FormStatusSelector } from "./form-components/form-status-selector";
import { creationUpdateTaskEvent } from "@/actions/creation-update-task-event";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskContent } from "./task-content";
import { toast } from "sonner";
import { deleteTask } from "@/actions/delete-task";
import { useDeleteModal } from "@/store/use-delete-modal";
import { Checkbox } from "./ui/checkbox";

type Props = {
  task: Task;
};

type TaskFormData = z.infer<typeof TaskSchema>;

export const TaskAccordion = ({ task }: Props) => {
  const { timeFormat } = useTimePeriod();
  const { onOpen } = useDeleteModal();

  const queryClient = useQueryClient();

  const { mutate: update, isPending: pendingUpdate } = useMutation({
    mutationKey: ["update-task"],
    mutationFn: creationUpdateTaskEvent,
    onError: () => {
      toast.error("Failed to update task");
    },
    onSuccess: () => {
      toast.success("Task updated successfull");
      queryClient.invalidateQueries({ queryKey: ["get-day-tasks", task.day] });
    },
  });

  const { mutate: onDelete, isPending: pendingDeletion } = useMutation({
    mutationKey: ["delete-task"],
    mutationFn: deleteTask,
    onError: () => {
      toast.error("Failed to delete task");
    },
    onSuccess: () => {
      toast.success("Task deleted successfull");
      queryClient.invalidateQueries({
        queryKey: ["get-day-tasks", task.day],
      });
    },
  });

  const isPending = pendingDeletion || pendingUpdate ? true : false;

  const [isEditing, setIsEditing] = useState(false);
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

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = (data: TaskFormData) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    update({
      data,
      type: "task",
      id: task.id,
      userTimeZone,
    });
  };

  const onConfirm = () => {
    onDelete(task.id);
  };

  const onCheckedChange = () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    update({
      data: {
        ...task,
        description: task.description || undefined,
        tagId: task.tagId || undefined,
        status:
          task.status === Status.completed
            ? Status.incompleted
            : Status.completed,
      },
      type: "task",
      id: task.id,
      userTimeZone,
    });
  };

  return (
    <Accordion type="multiple" className="bg-white mt-2">
      <AccordionItem value={task.title} className="px-4 rounded-md shadow-md">
        <AccordionTrigger className="flex items-center gap-x-2 group">
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={onCheckedChange}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className={cn(
              "w-full text-left group-hover:underline",
              task.status === Status.completed &&
                "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </div>
        </AccordionTrigger>
        <AccordionContent className="relative flex flex-col gap-y-2 pt-12 md:pt-0">
          <div
            className={cn(
              "absolute top-0 md:right-0 flex md:flex-col lg:flex-row gap-y-1 gap-x-2",
              isEditing && "md:flex-row"
            )}
          >
            <Button
              variant="destructive"
              className="ml-auto flex items-center gap-x-2"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(task.id, onConfirm, "task");
              }}
            >
              Delete
              <X className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-x-2 mr-2 group-hover:underline"
              onClick={onClick}
            >
              Edit
              <Edit className="size-5" />
            </Button>
          </div>
          {isEditing ? (
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
          ) : (
            <TaskContent
              description={task.description}
              endTime={task.endTime}
              startTime={task.startTime}
              priority={task.priority}
              status={task.status}
              timeFormat={timeFormat}
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
