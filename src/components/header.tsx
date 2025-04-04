"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { LinkLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// Navigation items array for better maintainability
const navigationItems = [
  { href: "/", label: "Product" },
  { href: "/blog", label: "Blog" },
  { href: "/resources/documentation", label: "Documentation" },
  { href: "/pricing", label: "Pricing" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 px-6 backdrop-blur-sm lg:px-0">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <LinkLogo />

        {/* Desktop Navigation */}
        <nav className="hidden space-x-8 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-gray-300 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Sign In */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="hidden border-2 border-gray-500 md:inline-flex"
            >
              Sign in
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Sign in</h4>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Enter your username" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <Button className="w-full">Sign in</Button>
              <Separator />
              <Button variant="outline" className="w-full">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <title>Google</title>
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                Sign in with Google
              </Button>
            </div>
          </PopoverContent>
        </Popover>

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
                <Button className="w-full" onClick={() => setIsOpen(false)}>
                  Sign in
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="mr-2 h-4 w-4"
                  >
                    <title>Google</title>
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
