import { Task } from "@prisma/client";
import { create } from "zustand";

type TaskDialogStore = {
  isOpen: boolean;
  task: Task | null;
  onOpen: (task: Task) => void;
  onClose: () => void;
};

export const useTaskDialog = create<TaskDialogStore>((set) => ({
  task: null,
  isOpen: true,
  onOpen: (task: Task) => set({ isOpen: true, task }),
  onClose: () => set({ isOpen: false, task: null }),
}));
