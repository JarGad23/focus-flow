import { Status, Task } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn, generateTimeBlocks } from "@/lib/utils";
import { Edit } from "lucide-react";
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
import { ElementRef, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
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
import { TaskAccordionContent } from "./task-accordion-content";
import { toast } from "sonner";

type Props = {
  task: Task;
};

type TaskFormData = z.infer<typeof TaskSchema>;

export const TaskAccordion = ({ task }: Props) => {
  const { timeFormat } = useTimePeriod();
  const accordionTriggerRef = useRef<ElementRef<"button">>(null);

  const queryClient = useQueryClient();

  const { mutate: update, isPending } = useMutation({
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

  const [isEditing, setIsEditing] = useState(false);
  const [startDateOptions, setStartDateOptions] = useState<string[]>([]);
  const [endDateOptions, setEndDateOptions] = useState<string[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);

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

  const { dirtyFields } = useFormState({ control: form.control });

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
    e.stopPropagation();

    if (isEditing) {
      accordionTriggerRef.current?.click();
    }

    setIsEditing((prev) => !prev);
  };

  const onSubmit = (data: TaskFormData) => {
    update({
      data,
      type: "task",
      id: task.id,
    });
  };

  const isFormChangedAndValid =
    Object.keys(dirtyFields).length > 0 && form.formState.isValid;

  return (
    <Accordion type="multiple" className="bg-white mt-2">
      <AccordionItem value={task.title} className="px-4 rounded-md shadow-md">
        <AccordionTrigger
          ref={accordionTriggerRef}
          className="flex justify-between items-center"
        >
          <div
            className={cn(
              "w-full text-left",
              task.status === Status.completed &&
                "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-x-2 mr-2"
            onClick={onClick}
          >
            Edit
            <Edit className="size-5" />
          </Button>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-y-2">
          {isEditing ? (
            <FormProvider {...form}>
              <form
                className="px-2 w-full space-y-4 max-w-6xl mx-auto"
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
            <TaskAccordionContent
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
