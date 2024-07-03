import { creationUpdateTaskEvent } from "@/actions/creation-update-task-event";
import { EventSchema } from "@/schemas/create-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormTitleDescriptionFields } from "./form-components/form-title-description-fields";
import { FormAllDayCheckbox } from "./form-components/form-all-day-checkbox";
import { Button } from "./ui/button";

type Props = {
  event: Event;
  onDialogClose: () => void;
};

type EventFormData = z.infer<typeof EventSchema>;

export const EventDialogForm = ({ event, onDialogClose }: Props) => {
  const [isFormChangedAndValid, setIsFormChangedAndValid] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: update, isPending } = useMutation({
    mutationKey: ["update-event"],
    mutationFn: creationUpdateTaskEvent,
    onError: () => {
      toast.error("Failed to update task");
    },
    onSuccess: () => {
      toast.success("Task updated successfull");
      queryClient.invalidateQueries({
        queryKey: ["get-month-events", event.month, event.year],
      });
      onDialogClose();
    },
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      day: event.day,
      isAllDay: event.isAllDay,
      title: event.title,
      description: event.description || undefined,
      month: event.month,
      year: event.year,
    },
  });

  const watchedFields: EventFormData = form.watch();

  useEffect(() => {
    const isChanged = Object.keys(watchedFields).some(
      (key) =>
        watchedFields[key as keyof EventFormData]?.toString() !==
        event[key as keyof EventFormData]?.toString()
    );

    setIsFormChangedAndValid(isChanged && form.formState.isValid);
  }, [watchedFields, form.formState.isValid, event]);

  const onSubmit = (data: EventFormData) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    update({
      data,
      type: "event",
      id: event.id,
      userTimeZone,
    });
  };
  return (
    <FormProvider {...form}>
      <form
        className="px-2 pt-2 md:pt-6 w-full space-y-4 max-w-6xl mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormTitleDescriptionFields type="event" disabled={isPending} />
        <FormAllDayCheckbox disabled={isPending} />
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
