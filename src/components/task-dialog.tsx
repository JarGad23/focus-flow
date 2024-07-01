"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { TaskContent } from "./task-content";
import { useTimePeriod } from "@/store/useTimePeriod";
import { TaskDialogHeader } from "./task-dialog-header";
import { ConfirmationModal } from "./confirmation-modal";
import { useDeleteModal } from "@/store/use-delete-modal";
import { TaskDialogForm } from "./task-dialog-form";
import { useTaskDialog } from "@/store/use-task-dialog";

export const TaskDialog = () => {
  const { isOpen, onClose, task } = useTaskDialog();
  const { timeFormat } = useTimePeriod();
  const { onConfirm } = useDeleteModal();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onDialogClose = () => {
    onClose();
    setIsEditing(false);
  };

  if (!task) return;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] lg:max-w-5xl rounded-md">
        <TaskDialogHeader
          id={task.id}
          day={task.day}
          endTime={task.endTime}
          startTime={task.startTime}
          timeFormat={timeFormat}
          title={task.title}
          toggleEditing={toggleEditing}
          onDialogClose={onDialogClose}
        />
        {isEditing ? (
          <TaskDialogForm
            timeFormat={timeFormat}
            task={task}
            onDialogClose={onDialogClose}
          />
        ) : (
          <div className="space-y-2">
            <TaskContent
              description={task.description}
              startTime={task.startTime}
              endTime={task.endTime}
              priority={task.priority}
              status={task.status}
              timeFormat={timeFormat}
            />
          </div>
        )}
        <ConfirmationModal type="task" onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  );
};
