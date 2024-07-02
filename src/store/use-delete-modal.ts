import { create } from "zustand";

type DeleteModalState = {
  isOpen: boolean;
  type: "task" | "event" | null;
  idToDelete: string;
  onConfirm: () => void;
  onOpen: (
    idToDelete: string,
    onConfirm: () => void,
    type: "task" | "event"
  ) => void;
  onClose: () => void;
};

export const useDeleteModal = create<DeleteModalState>((set) => ({
  type: null,
  isOpen: false,
  idToDelete: "",
  onConfirm: () => {},
  onOpen: (idToDelete: string, onConfirm: () => void, type) =>
    set({ isOpen: true, idToDelete, onConfirm, type }),
  onClose: () =>
    set({ isOpen: false, idToDelete: "", onConfirm: () => {}, type: null }),
}));
