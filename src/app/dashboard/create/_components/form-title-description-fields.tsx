import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  type: string;
  disabled: boolean;
};

export const FormTitleDescriptionFields = ({ type, disabled }: Props) => {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Write some code"
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormDescription>
              Describe details about your {type === "task" ? "task" : "event"}.
              This field is optional
            </FormDescription>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder="Complete one feature in major functionality in app"
                disabled={disabled}
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
