import { Event } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ElementRef, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Edit, X } from "lucide-react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { FormTitleDescriptionFields } from "./form-components/form-title-description-fields";
import { EventSchema } from "@/schemas/create-form-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { creationUpdateTaskEvent } from "@/actions/creation-update-task-event";
import { toast } from "sonner";
import { EventAccordionContent } from "./event-accordion-content";
import { FormAllDayCheckbox } from "./form-components/form-all-day-checkbox";
import { useDeleteModal } from "@/store/use-delete-modal";
import { deleteEvent } from "@/actions/delete-event";

type Props = {
  event: Event;
};

type EventFormData = z.infer<typeof EventSchema>;

export const EventAccordion = ({ event }: Props) => {
  const { onOpen } = useDeleteModal();
  const accordionTriggerRef = useRef<ElementRef<"button">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: update, isPending: pendingUpdate } = useMutation({
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

  const { dirtyFields } = useFormState({ control: form.control });

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isEditing) {
      accordionTriggerRef.current?.click();
    }

    setIsEditing((prev) => !prev);
  };

  const onSubmit = (data: EventFormData) => {
    update({
      data,
      type: "event",
      id: event.id,
    });
  };

  const onConfirm = () => {
    onDelete(event.id);
  };

  const isFormChangedAndValid =
    Object.keys(dirtyFields).length > 0 && form.formState.isValid;

  return (
    <Accordion type="multiple" className="bg-white mt-2">
      <AccordionItem value={event.title} className="px-4 rounded-md shadow-md">
        <AccordionTrigger
          ref={accordionTriggerRef}
          className="flex items-center group"
        >
          <p className="w-full text-left group-hover:underline">
            {event.title}
          </p>

          <div className="flex gap-x-2">
            <Button
              variant="destructive"
              className="ml-auto flex items-center gap-x-2"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(event.id, onConfirm);
              }}
            >
              Delete
              <X className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-x-2 mr-2 group-hover:underline"
              onClick={onClick}
            >
              Edit
              <Edit className="size-5" />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-y-2">
          {isEditing ? (
            <FormProvider {...form}>
              <form
                className="px-2 w-full space-y-4 max-w-6xl mx-auto"
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
            <EventAccordionContent
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
