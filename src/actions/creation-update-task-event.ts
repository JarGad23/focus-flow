"use server";

import { z } from "zod";
import { db } from "@/db";
import { EventSchema, TaskSchema } from "@/schemas/create-form-schema";
import { FormDataType } from "@/app/dashboard/create/_components/create-form";
import { validateUser } from "./validate-user";

type creationUpdateTaskEventProps = {
  data: FormDataType;
  type: "task" | "event";
  id?: string;
};

type TaskType = z.infer<typeof TaskSchema>;
type EventType = z.infer<typeof EventSchema>;

const isUserOwner = async (
  userId: string,
  id: string,
  type: "task" | "event"
) => {
  if (type === "task") {
    return await db.task.findFirst({
      where: {
        id,
        userId,
      },
    });
  } else {
    return await db.event.findFirst({
      where: {
        id,
        userId,
      },
    });
  }
};

export const creationUpdateTaskEvent = async ({
  data,
  type,
  id,
}: creationUpdateTaskEventProps) => {
  const user = await validateUser();

  let validatedFields: TaskType | EventType;

  if (type === "task") {
    const validationResult = TaskSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error("Invalid data for task");
    }
    validatedFields = validationResult.data;
  } else if (type === "event") {
    const validationResult = EventSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error("Invalid data for event");
    }
    validatedFields = validationResult.data;
  } else {
    throw new Error("Invalid type");
  }

  if (!id) {
    if (type === "task") {
      await db.task.create({
        data: {
          ...(validatedFields as TaskType),
          userId: user.id,
        },
      });
    } else if (type === "event") {
      await db.event.create({
        data: {
          ...(validatedFields as EventType),
          userId: user.id,
        },
      });
    }
  } else {
    const isOwner = await isUserOwner(user.id, id, type);
    if (isOwner) {
      if (type === "task") {
        await db.task.update({
          where: { id },
          data: validatedFields as TaskType,
        });
      } else if (type === "event") {
        await db.event.update({
          where: { id },
          data: validatedFields as EventType,
        });
      }
    } else {
      throw new Error("Unauthorized");
    }
  }
};
