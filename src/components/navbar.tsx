import Link from "next/link";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { NavbarActionsButton } from "./navbar-action-button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="sticky z-50 h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition">
      <MaxWidthWrapper>
        <div className="w-full max-w-7xl h-full flex items-center justify-between">
          <Link href="/" className="text-xl">
            <span className="font-semibold text-primary">F</span>ocus
            <span className="font-semibold text-primary">F</span>low
          </Link>
          <div className="flex items-center gap-x-2">
            {user ? (
              <div className="flex items-center gap-x-2">
                <Link
                  href="/api/auth/logout"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  Logout
                </Link>
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ variant: "ghost" }))}
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
            <NavbarActionsButton isUser={!!user} />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
