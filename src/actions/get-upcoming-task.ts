"use server";

import { db } from "@/db";
import { validateUser } from "./validate-user";

export const getUpcomingTask = async () => {
  const user = await validateUser();

  const now = new Date();

  const currentTask = await db.task.findFirst({
    where: {
      userId: user.id,
      startTime: {
        lte: now,
      },
      endTime: {
        gte: now,
      },
    },
    select: {
      title: true,
      startTime: true,
      endTime: true,
    },
  });

  if (currentTask) {
    return {
      ...currentTask,
      isCurrent: true,
    };
  }

  const upcomingTask = await db.task.findFirst({
    where: {
      userId: user.id,
      startTime: {
        gte: now,
      },
    },
    select: {
      title: true,
      startTime: true,
      endTime: true,
    },
  });

  if (!upcomingTask) {
    return null;
  }

  return {
    ...upcomingTask,
    isCurrent: false,
  };
};
