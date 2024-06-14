import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/components/query-provider";
import { cn } from "@/lib/utils";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("w-full min-w-[375px]", roboto.className)}>
        <main className="min-h-screen h-auto grainy-light">
          <QueryProvider>{children}</QueryProvider>
        </main>
      </body>
    </html>
  );
}
