"use server";

import { db } from "@/db";
import { validateUser } from "./validate-user";

type Props = {
  week: [Date, Date];
};

export const getWeekTasks = async ({ week }: Props) => {
  const user = await validateUser();

  const tasks = await db.task.findMany({
    where: {
      userId: user.id,
      day: {
        gte: week[0],
        lte: week[1],
      },
    },
  });

  return tasks;
};
