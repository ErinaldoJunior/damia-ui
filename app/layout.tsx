import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CommandMenu } from "@/components/command-menu";
import { Icons } from "@/components/icons";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | A Library of UI Components and Blocks",
    default: "Damia Group UI Library",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="relative flex min-h-screen flex-col">
          <header className="fixed top-0 z-50 h-14 w-full border-border/40 bg-background/20 backdrop-blur-xl">
            <div className="px-7 flex h-14 max-w-screen-2xl items-center mx-auto">
              <Navbar />
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className="w-full flex-1 md:w-auto md:flex-none">
                  <CommandMenu />
                </div>
                <nav className="flex items-center">
                  <Link href={"#"} target="_blank" rel="noreferrer">
                    <div
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                        }),
                        "h-8 w-8 px-0"
                      )}
                    >
                      <Icons.gitHub className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </div>
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
