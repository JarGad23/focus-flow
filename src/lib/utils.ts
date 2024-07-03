import { format, addMinutes, set } from "date-fns";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task } from "@prisma/client";
import { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNext15MinuteBlock = (date: Date): Date => {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  return set(date, { minutes: roundedMinutes, seconds: 0, milliseconds: 0 });
};

export const generateTimeBlocks = (
  start: Date,
  end: Date,
  timeFormat: "12H" | "24H"
): string[] => {
  const blocks = [];
  let current = start;
  while (current <= end) {
    blocks.push(format(current, timeFormat === "24H" ? "HH:mm" : "hh:mm a"));
    current = addMinutes(current, 15);
  }
  return Array.from(new Set(blocks));
};

export const getOverlappingTasks = (tasks: Task[]): Task[][] => {
  const groupedTasks: Task[][] = [];

  tasks.forEach((task) => {
    let placed = false;

    for (const group of groupedTasks) {
      if (
        group.some(
          (t) =>
            new Date(t.startTime) < new Date(task.endTime) &&
            new Date(task.startTime) < new Date(t.endTime)
        )
      ) {
        group.push(task);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groupedTasks.push([task]);
    }
  });

  return groupedTasks;
};

export const calculateTaskPosition = (task: Task) => {
  const startHour = new Date(task.startTime).getHours();
  const startMinute = new Date(task.startTime).getMinutes();
  const endHour = new Date(task.endTime).getHours();
  const endMinute = new Date(task.endTime).getMinutes();

  const startPosition = startHour * 64 + (startMinute / 15) * 16;
  const endPosition = endHour * 64 + (endMinute / 15) * 16;
  const taskHeight = endPosition - startPosition;

  return { startPosition, taskHeight };
};

export const calculateTaskPositionAndWidth = (
  task: Task,
  taskIndex: number,
  groupSize: number
) => {
  const startHour = new Date(task.startTime).getHours();
  const startMinute = new Date(task.startTime).getMinutes();
  const endHour = new Date(task.endTime).getHours();
  const endMinute = new Date(task.endTime).getMinutes();

  const startPosition = startHour * 64 + (startMinute / 15) * 16;
  const endPosition = endHour * 64 + (endMinute / 15) * 16;
  const taskHeight = endPosition - startPosition;

  const overlap = 0.5;
  const width = 100 / groupSize + (groupSize - 1) * overlap;
  const left = taskIndex * (100 / groupSize - overlap);

  return { startPosition, taskHeight, left, width };
};

export function constructMetadata({
  title = "FocusFlow - High Quality Management Application",
  description = "Plan your days, weeks and month with super user-friendly interface",
  image = "/logo.svg",
  icons = "/favicon.ico",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@JarekGad",
    },
    icons,
  };
}
