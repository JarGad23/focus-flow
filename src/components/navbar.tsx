import Link from "next/link";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NavbarLinks } from "./navbar-links";

export const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="sticky z-50 h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition">
      <MaxWidthWrapper>
        <div className="w-full max-w-7xl h-full flex items-center justify-between">
          <Link href="/" className="text-lg sm:text-xl">
            <span className="font-semibold text-primary">F</span>ocus
            <span className="font-semibold text-primary">F</span>low
          </Link>
          <NavbarLinks isUser={!!user} />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
