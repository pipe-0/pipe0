"use client";

import { Github, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LinkLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { appInfo } from "@/lib/const";

// Navigation items array for better maintainability
const navigationItems = [
  { href: "/", label: "Product" },
  { href: "/blog", label: "Blog" },
  { href: "/resources/documentation", label: "Documentation" },
  { href: "/pricing", label: "Pricing" },
];

export function Header({
  page,
}: {
  page: "product" | "blog" | "documentation" | "pricing";
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 px-6 backdrop-blur-sm lg:px-0">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <LinkLogo />

        {/* Desktop Navigation */}
        <nav className="hidden space-x-1 md:flex grow px-12">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              <Button
                variant={
                  item.label.toLowerCase() === page ? "secondary" : "ghost"
                }
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="gap-3 items-center hidden md:flex">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 px-0">
            <Link href={appInfo.links.github} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          {/* <ModeSwitcher /> */}
          {/* Desktop Sign In */}
          <Link href={`${appInfo.links.appUrl}/login`}>
            <Button
              size="sm"
              variant="outline"
              className="hidden border-gray-500 md:inline-flex"
            >
              Sign in
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open mobile menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg text-foreground transition-colors hover:text-muted-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="px-6">{item.label}</div>
                </Link>
              ))}
              <Separator className="my-2" />
              <div className="mt-4 space-y-4 px-6">
                <Link href={`${appInfo.links.appUrl}/login`}>
                  <Button className="w-full">Login</Button>
                </Link>
                <Link href={`${appInfo.links.appUrl}/signup`}>
                  <Button variant="outline" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
