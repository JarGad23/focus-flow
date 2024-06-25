"use server";

import { db } from "@/db";
import { validateUser } from "./validate-user";

type Props = {
  date: Date;
};

export const getDayTasks = async ({ date }: Props) => {
  const user = await validateUser();

  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const endOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  const tasks = await db.task.findMany({
    where: {
      userId: user.id,
      day: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  return tasks;
};
