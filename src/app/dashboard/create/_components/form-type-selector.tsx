import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  type: string;
  handleTypeValueChange: (value: string) => void;
};

export const FormTypeSelector = ({ type, handleTypeValueChange }: Props) => {
  return (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-xl font-semibold">
        {type !== "" ? (
          <>
            Selected type: <span className="text-primary">{type}</span>
          </>
        ) : (
          <>Select creation type:</>
        )}
      </h3>
      <Select value={type} onValueChange={handleTypeValueChange}>
        <SelectTrigger className="max-w-80 focus:ring-offset-0 focus:ring-transparent outline-none">
          <SelectValue placeholder="Task/Event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="task">Task</SelectItem>
          <SelectItem value="event">Event</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
