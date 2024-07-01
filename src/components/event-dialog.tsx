"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { ConfirmationModal } from "./confirmation-modal";
import { useDeleteModal } from "@/store/use-delete-modal";
import { useEventDialog } from "@/store/use-event-dialog";
import { EventDialogHeader } from "./event-dialog-header";
import { EventDialogForm } from "./event-dialog-form";
import { EventContent } from "./event-content";

export const EventDialog = () => {
  const { isOpen, onClose, event } = useEventDialog();
  const { onConfirm } = useDeleteModal();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onDialogClose = () => {
    onClose();
    setIsEditing(false);
  };

  if (!event) return;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] lg:max-w-5xl rounded-md">
        <EventDialogHeader
          id={event.id}
          month={event.month}
          year={event.year}
          title={event.title}
          day={event.day}
          onDialogClose={onDialogClose}
          toggleEditing={toggleEditing}
        />
        {isEditing ? (
          <EventDialogForm event={event} onDialogClose={onDialogClose} />
        ) : (
          <div className="space-y-2">
            <EventContent
              description={event.description}
              fullDate={event.day}
              isAllDay={event.isAllDay}
            />
          </div>
        )}
        <ConfirmationModal type="task" onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  );
};
