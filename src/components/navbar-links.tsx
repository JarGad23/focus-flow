import { cn } from "@/lib/utils";
import Link from "next/link";
import { NavbarActionButton } from "./navbar-action-button";
import { buttonVariants } from "./ui/button";

type Props = {
  isUser: boolean;
};

export const NavbarLinks = ({ isUser }: Props) => {
  return (
    <div className="flex items-center gap-x-1 md:gap-x-2">
      {isUser ? (
        <div className="flex items-center gap-x-1 md:gap-x-2">
          <Link
            href="/api/auth/logout"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Logout
          </Link>

          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-x-2">
          <Link
            href="/api/auth/login"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Login
          </Link>
          <Link
            href="/api/auth/register"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Sing up
          </Link>
        </div>
      )}
      <NavbarActionButton isUser={!!isUser} />
    </div>
  );
};
