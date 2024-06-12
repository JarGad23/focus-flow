import { create } from "zustand";

type sidebarStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useSidebar = create<sidebarStore>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
