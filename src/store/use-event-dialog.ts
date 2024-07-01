import { Event } from "@prisma/client";
import { create } from "zustand";

type EventDialogStore = {
  isOpen: boolean;
  event: Event | null;
  onOpen: (event: Event) => void;
  onClose: () => void;
};

export const useEventDialog = create<EventDialogStore>((set) => ({
  event: null,
  isOpen: true,
  onOpen: (event: Event) => set({ isOpen: true, event }),
  onClose: () => set({ isOpen: false, event: null }),
}));
