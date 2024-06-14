"use client";
import { Menu } from "lucide-react";
import { NavbarActionsContent } from "./navbar-actions-content";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export const NavbarActions = () => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isMounted, setIsMounted] = useState(false);
  const matches = useMediaQuery("(min-width: 768px)");
  const isPro = false;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (matches) {
      closeRef.current?.click();
    }
  }, [matches, closeRef]);

  if (!isMounted) return null;

  return (
    <div>
      <div className="w-full hidden md:block">
        <NavbarActionsContent isPro={isPro} />
      </div>
      <div className="w-full block md:hidden">
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col justify-between">
            <NavbarActionsContent
              isPro={isPro}
              className="flex-col gap-y-4 mt-8 flex-1"
            />
            <div className="w-full flex justify-center">
              <Logo />
            </div>
            <SheetClose ref={closeRef} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
