"use client";

import { useEffect, useState } from "react";
import { ConfirmationModal } from "./confirmation-modal";
import { TaskDialog } from "./task-dialog";
import { EventDialog } from "./event-dialog";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <>
      <TaskDialog />
      <EventDialog />
      <ConfirmationModal />
    </>
  );
};
