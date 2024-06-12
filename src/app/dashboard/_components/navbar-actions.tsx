"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const NavbarActions = () => {
  return (
    <div>
      <div className="w-full hidden md:flex items-center gap-x-2">Actions</div>
      <Button className="block md:hidden" variant="ghost">
        <Menu className="w-5 h-5" />
      </Button>
    </div>
  );
};
