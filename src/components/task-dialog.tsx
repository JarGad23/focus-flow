"use client";

import { Task } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Edit, X } from "lucide-react";

type Props = {
  task: Task;
  children: React.ReactNode;
};

export const TaskDialog = ({ task, children }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[90%] lg:max-w-5xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{task.title}</DialogTitle>
          <div className="flex gap-x-2">
            <Button
              variant="destructive"
              className="ml-auto flex items-center gap-x-2"
              onClick={() => {}}
            >
              Delete
              <X className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-x-2 mr-2 group-hover:underline"
              onClick={() => {}}
            >
              Edit
              <Edit className="size-5" />
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
