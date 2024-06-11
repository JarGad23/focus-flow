import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "./ui/dialog";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const LoginModal = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="absolute top-[50%] -translate-y-[50%] z-[999]">
        <h1>Login</h1>
      </DialogContent>
    </Dialog>
  );
};
