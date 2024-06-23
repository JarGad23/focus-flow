import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  disabled: boolean;
};

export const FormAllDayCheckbox = ({ disabled }: Props) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="isAllDay"
      render={({ field }) => (
        <FormItem className="flex items-end gap-x-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormLabel>Will this event take whole day ?</FormLabel>
        </FormItem>
      )}
    />
  );
};
