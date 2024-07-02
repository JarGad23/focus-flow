import { format } from "date-fns";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Edit, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteModal } from "@/store/use-delete-modal";
import { deleteEvent } from "@/actions/delete-event";

type Props = {
  id: string;
  day: Date;
  month: number;
  year: number;
  title: string;
  toggleEditing: () => void;
  onDialogClose: () => void;
};

export const EventDialogHeader = ({
  onDialogClose,
  toggleEditing,
  title,
  id,
  day,
  month,
  year,
}: Props) => {
  const { onOpen } = useDeleteModal();
  const queryClient = useQueryClient();

  const { mutate: onDelete } = useMutation({
    mutationKey: ["delete-event"],
    mutationFn: deleteEvent,
    onError: () => {
      toast.error("Failed to delete event");
    },
    onSuccess: () => {
      toast.success("Event deleted successfull");
      queryClient.invalidateQueries({
        queryKey: ["get-month-events", month, year],
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
        <span>{format(new Date(day), "EEEE dd MMMM yyyy")}</span>
      </div>
      <div className="flex flex-col gap-y-1 sm:flex-row gap-x-2 p-1">
        <Button
          variant="destructive"
          className="ml-auto flex items-center gap-x-2"
          onClick={() => onOpen(id, onConfirm, "event")}
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
