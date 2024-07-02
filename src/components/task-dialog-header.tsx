import { format } from "date-fns";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Edit, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/actions/delete-task";
import { toast } from "sonner";
import { useDeleteModal } from "@/store/use-delete-modal";
import { useSelectedDate } from "@/store/useSelectedDate";

type Props = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  day: Date;
  toggleEditing: () => void;
  onDialogClose: () => void;
  timeFormat: "12H" | "24H";
};

export const TaskDialogHeader = ({
  onDialogClose,
  toggleEditing,
  timeFormat,
  title,
  startTime,
  endTime,
  day,
  id,
}: Props) => {
  const { week } = useSelectedDate();
  const { onOpen } = useDeleteModal();
  const queryClient = useQueryClient();

  const { mutate: onDelete } = useMutation({
    mutationKey: ["delete-task"],
    mutationFn: deleteTask,
    onError: () => {
      toast.error("Failed to delete task");
    },
    onSuccess: () => {
      toast.success("Task deleted successfull");
      queryClient.invalidateQueries({
        queryKey: ["get-day-tasks", day],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-week-tasks", week],
      });
      onDialogClose();
    },
  });

  const onConfirm = () => {
    onDelete(id);
  };

  return (
    <DialogHeader className="flex flex-row items-center justify-between">
      <div className="flex flex-col gap-y-1">
        <DialogTitle className="text-left">{title}</DialogTitle>
        <div className="flex items-center divide-x-2 text-sm md:text-base">
          <span className="pr-2">{format(day, "EEEE dd MMMM")}</span>
          <div className="flex items-center gap-x-1 pl-2">
            <span>{format(new Date(startTime), "HH:mm")}</span>
            <span>-</span>
            <span>
              {format(
                new Date(endTime),
                `${timeFormat === "12H" ? "HH:mm a" : "HH:mm"}`
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-1 sm:flex-row gap-x-2 p-1">
        <Button
          variant="destructive"
          className="ml-auto flex items-center gap-x-2"
          onClick={() => onOpen(id, onConfirm, "task")}
        >
          Delete
          <X className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center gap-x-2 mr-2 group-hover:underline"
          onClick={toggleEditing}
        >
          Edit
          <Edit className="size-5" />
        </Button>
      </div>
    </DialogHeader>
  );
};
