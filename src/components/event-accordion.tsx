import { Event } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ElementRef, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
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

type Props = {
  event: Event;
};

type EventFormData = z.infer<typeof EventSchema>;

export const EventAccordion = ({ event }: Props) => {
  const accordionTriggerRef = useRef<ElementRef<"button">>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const isFormChangedAndValid =
    Object.keys(dirtyFields).length > 0 && form.formState.isValid;

  return (
    <Accordion type="multiple" className="bg-white mt-2">
      <AccordionItem value={event.title} className="px-4 rounded-md shadow-md">
        <AccordionTrigger
          ref={accordionTriggerRef}
          className="flex items-center"
        >
          <p className="w-full text-left">{event.title}</p>

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
