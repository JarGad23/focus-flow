"use server";

import { db } from "@/db";
import { validateUser } from "./validate-user";

export const deleteEvent = async (eventId: string) => {
  const user = await validateUser();

  const eventToDelete = await db.event.delete({
    where: {
      id: eventId,
      userId: user.id,
    },
  });

  if (!eventToDelete) {
    throw new Error("Event to delete not found");
  }

  return eventToDelete;
};
