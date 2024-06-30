import { create } from "zustand";

type DeleteModalState = {
  isOpen: boolean;
  idToDelete: string;
  onConfirm: () => void;
  onOpen: (idToDelete: string, onConfirm: () => void) => void;
  onClose: () => void;
};

export const useDeleteModal = create<DeleteModalState>((set) => ({
  isOpen: false,
  idToDelete: "",
  onConfirm: () => {},
  onOpen: (idToDelete: string, onConfirm: () => void) =>
    set({ isOpen: true, idToDelete, onConfirm }),
  onClose: () => set({ isOpen: false, idToDelete: "", onConfirm: () => {} }),
}));
