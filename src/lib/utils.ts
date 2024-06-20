import { format, addMinutes, set } from "date-fns";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
