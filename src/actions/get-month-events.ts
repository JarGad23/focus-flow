"use server";

import { db } from "@/db";
import { validateUser } from "./validate-user";

type Props = {
  month: number;
  year: number;
};

export const getMonthEvents = async ({ month, year }: Props) => {
  const user = await validateUser();

  const events = await db.event.findMany({
    where: {
      userId: user.id,
      AND: {
        month: month,
        year: year,
      },
    },
    orderBy: {
      day: "asc",
    },
  });

  return events;
};
