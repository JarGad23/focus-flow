import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export const metadata = constructMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("w-full min-w-[375px] grainy-light", roboto.className)}
      >
        <main className="min-h-screen h-full">
          <QueryProvider>{children}</QueryProvider>
        </main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
