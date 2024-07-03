import "react-day-picker";

declare module "react-day-picker" {
  export type SelectMultipleEventHandler = (
    days: Date[],
    selectedDay: Date,
    activeModifiers: ActiveModifiers,
    e: MouseEvent
  ) => void;
}
