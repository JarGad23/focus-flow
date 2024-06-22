import { useFormContext } from "react-hook-form";
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
import { StatusEnum } from "@/schemas/create-form-schema";

export const FormStatusSelector = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full focus:ring-offset-0 focus:ring-transparent outline-none">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {StatusEnum.options.map((option) => (
                  <SelectItem value={option} key={option}>
                    <span className="capitalize">
                      {option === "inProgress" ? "In progress" : option}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
