import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PriorityEnum } from "@/schemas/create-form-schema";
import { useFormContext } from "react-hook-form";

export const FormPrioritySelector = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Priority</FormLabel>
          <FormControl>
            <div className="flex items-center gap-x-4 xl:gap-x-8">
              <div
                className={cn(
                  "size-8 rounded-sm",
                  field.value === "low"
                    ? "bg-green-500"
                    : field.value === "medium"
                    ? "bg-orange-400"
                    : "bg-rose-500"
                )}
              />
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full focus:ring-offset-0 focus:ring-transparent outline-none">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PriorityEnum.options.map((option) => (
                    <SelectItem value={option} key={option}>
                      <span className="capitalize">{option}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
