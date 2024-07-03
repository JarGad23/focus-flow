import { Event } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Edit, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormTitleDescriptionFields } from "./form-components/form-title-description-fields";
import { EventSchema } from "@/schemas/create-form-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { creationUpdateTaskEvent } from "@/actions/creation-update-task-event";
import { toast } from "sonner";
import { EventContent } from "./event-content";
import { FormAllDayCheckbox } from "./form-components/form-all-day-checkbox";
import { useDeleteModal } from "@/store/use-delete-modal";
import { deleteEvent } from "@/actions/delete-event";
import { cn } from "@/lib/utils";

type Props = {
  event: Event;
};

type EventFormData = z.infer<typeof EventSchema>;

export const EventAccordion = ({ event }: Props) => {
  const { onOpen } = useDeleteModal();
  const [isEditing, setIsEditing] = useState(false);
  const [isFormChangedAndValid, setIsFormChangedAndValid] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: update, isPending: pendingUpdate } = useMutation({
    mutationKey: ["update-event"],
    mutationFn: creationUpdateTaskEvent,
    onError: () => {
      toast.error("Failed to update event");
    },
    onSuccess: () => {
      toast.success("Event updated successfull");
      queryClient.invalidateQueries({
        queryKey: ["get-month-events", event.month, event.year],
      });
    },
  });

  const { mutate: onDelete, isPending: pendingDeletion } = useMutation({
    mutationKey: ["delete-event"],
    mutationFn: deleteEvent,
    onError: () => {
      toast.error("Failed to delete event");
    },
    onSuccess: () => {
      toast.success("Event deleted successfull");
      queryClient.invalidateQueries({
        queryKey: ["get-month-events", event.month, event.year],
      });
    },
  });

  const isPending = pendingDeletion || pendingUpdate ? true : false;

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

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = (data: EventFormData) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    update({
      data,
      type: "event",
      id: event.id,
      userTimeZone,
    });
  };

  const onConfirm = () => {
    onDelete(event.id);
  };

  return (
    <Accordion type="multiple" className="bg-white mt-2">
      <AccordionItem value={event.title} className="px-4 rounded-md shadow-md">
        <AccordionTrigger className="flex items-center group">
          <p className="w-full text-left group-hover:underline">
            {event.title}
          </p>
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
              className="w-full ml-auto flex items-center gap-x-2"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(event.id, onConfirm, "event");
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
          ) : (
            <EventContent
              description={event.description}
              fullDate={event.day}
              isAllDay={event.isAllDay}
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
