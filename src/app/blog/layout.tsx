import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import type React from "react"; // Import React

const inter = Inter({ subsets: ["latin"] });

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("min-h-screen flex flex-col antialiased", inter.className)}
    >
      <Header />
      <div className="grow pt-16">{children}</div>
    </div>
  );
}
