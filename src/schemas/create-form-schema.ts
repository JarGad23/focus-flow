import { z } from "zod";

export const StatusEnum = z.enum(["incompleted", "inProgress", "completed"]);
export const PriorityEnum = z.enum(["low", "medium", "high"]);

const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  day: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  status: StatusEnum.default("incompleted"),
  priority: PriorityEnum.default("medium"),
  tagId: z.string().optional(),
});

const EventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isAllDay: z.boolean().default(false),
  day: z.date(),
  month: z.number().int(),
  year: z.number().int(),
});

export { TaskSchema, EventSchema };
