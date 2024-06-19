import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type Props = {
  type: string;
  date: Date;
};

export const CreateForm = ({ type, date }: Props) => {
  const router = useRouter();

  const handleTypeValueChange = (value: string) => {
    router.push(`?type=${value}`);
  };

  const form = useForm({});

  const onSubmit = () => {};

  return (
    <div className="w-full max-w-2xl flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <h3>Selected type: {type}</h3>
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
      {type === "task" || type === "event" ? (
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Write some code" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Complete one feature in major functionality in app"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : null}
    </div>
  );
};
