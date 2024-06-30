"use server";

import { db } from "@/db";
import { validateUser } from "./validate-user";

export const deleteTask = async (taskId: string) => {
  const user = await validateUser();

  const taskToDelete = await db.task.delete({
    where: {
      id: taskId,
      userId: user.id,
    },
  });

  if (!taskToDelete) {
    throw new Error("Task to delete not found");
  }

  return taskToDelete;
};
