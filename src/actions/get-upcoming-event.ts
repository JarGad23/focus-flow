"use server";

import { db } from "@/db";
import { validateUser } from "./validate-user";

export const getUpcomingEvent = async () => {
  const user = await validateUser();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const currentEvent = await db.event.findFirst({
    where: {
      userId: user.id,
      day: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    select: {
      day: true,
      title: true,
      isAllDay: true,
    },
  });

  if (currentEvent) {
    return {
      ...currentEvent,
      daysLeft: 0,
      isCurrent: true,
    };
  }

  const upcomingEvent = await db.event.findFirst({
    where: {
      userId: user.id,
      day: {
        gt: now,
      },
    },
    select: {
      title: true,
      day: true,
      isAllDay: true,
    },
  });

  if (!upcomingEvent) {
    return null;
  }

  const eventDate = new Date(upcomingEvent.day);
  const timeDiff = eventDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return {
    ...upcomingEvent,
    isCurrent: false,
    daysLeft,
  };
};
