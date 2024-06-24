"use server";

import { db } from "@/db";
import { validateUser } from "./validate-user";

export const getTasks = async () => {
  const user = await validateUser();

  const tasks = await db.task.findMany({
    where: {
      userId: user.id,
    },
  });

  return tasks;
};
