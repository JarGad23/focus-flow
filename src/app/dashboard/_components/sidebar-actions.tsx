import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarCheck,
  CalendarSearch,
  ClipboardList,
  FileCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export const SidebarActions = () => {
  const router = useRouter();

  const onClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="w-full flex flex-col gap-y-2 mt-8">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="focus:ring-offset-0 focus:ring-transparent outline-none"
        >
          <Button variant="outline">Create</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="right">
          <DropdownMenuLabel>Create</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full">
            <Button
              className="w-full flex items-center justify-start"
              variant="ghost"
              onClick={() => onClick("/dashboard/create?type=task")}
            >
              <FileCheck className="size-4 mr-2" />
              Task
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              className="w-full flex items-center justify-start"
              variant="ghost"
              onClick={() => onClick("/dashboard/create?type=event")}
            >
              <CalendarCheck className="size-4 mr-2" />
              Event
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="focus:ring-offset-0 focus:ring-transparent outline-none"
        >
          <Button variant="outline">Review</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="right">
          <DropdownMenuLabel>Review</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              className="w-full flex items-center justify-start"
              variant="ghost"
              onClick={() => onClick("/dashboard/tasks")}
            >
              <ClipboardList className="size-4 mr-2" />
              Today Tasks
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              className="w-full flex items-center justify-start"
              variant="ghost"
              onClick={() => onClick("/dashboard/events")}
            >
              <CalendarSearch className="size-4 mr-2" />
              Events
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
