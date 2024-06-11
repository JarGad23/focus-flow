"use client";

import { NotebookPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { LoginModal } from "./login-modal";

type Props = {
  isUser: boolean;
};

export const NavbarActionsButton = ({ isUser }: Props) => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const onClick = () => {
    if (isUser) {
      router.push("/dashboard/create");
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
      <Button onClick={onClick}>
        Start planning <NotebookPen className="h-4 w-4 ml-2" />
      </Button>
    </>
  );
};
