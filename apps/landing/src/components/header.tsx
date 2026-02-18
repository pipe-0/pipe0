"use client";

import { Menu } from "lucide-react";
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
import { BetaAnnouncementBanner } from "@/components/features/announcements/banners/beta-announcement-banner";

// Navigation items array for better maintainability
const navigationItems = [
  { href: "/", label: "Product" },
  { href: "/blog", label: "Blog" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function Header({}: {
  page: "product" | "blog" | "documentation" | "pricing";
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <BetaAnnouncementBanner />
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 md:px-6 lg:px-0 flex h-14 items-center">
          <LinkLogo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 px-6 grow">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {/* Desktop Sign In */}
            <Link href={`${appInfo.links.loginUrl}`} rel="nofollow">
              <Button variant="outline" className="md:inline-flex">
                Login
              </Button>
            </Link>
            <Link href={`${appInfo.links.signupUrl}`} rel="nofollow">
              <Button variant="default" className="md:inline-flex">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden grow flex justify-end">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Toggle menu">
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
                  <div className="mt-4 px-6">
                    <Link
                      href={`${appInfo.links.loginUrl}`}
                      rel="nofollow"
                      className="block mb-3"
                    >
                      <Button className="w-full">Login</Button>
                    </Link>
                    <Link
                      href={`${appInfo.links.signupUrl}`}
                      rel="nofollow"
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
