import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "./ui/button";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const LoginModal = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999]">
        <DialogHeader>
          <DialogTitle className="mx-auto mb-4 text-4xl font-bold">
            <span className="text-primary">F</span>ocus
            <span className="text-primary">F</span>low
          </DialogTitle>
          <p className="text-xl text-center tracking-tight text-gray-900">
            Login to continue
          </p>
          <DialogDescription className="text-base text-center py-2 space-y-1">
            <p>Please login or create an account to complete your purchase.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <LoginLink className={buttonVariants({ variant: "outline" })}>
            Login
          </LoginLink>
          <RegisterLink className={buttonVariants({ variant: "default" })}>
            Sign up
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};
