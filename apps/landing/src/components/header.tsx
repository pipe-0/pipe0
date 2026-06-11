"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LinkLogoSmall } from "@/components/logo";
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
import { cn } from "@/lib/utils";

type Page = "product" | "blog" | "documentation" | "pricing";

const navigationItems: { href: string; label: string; page: Page }[] = [
  { href: "/", label: "Product", page: "product" },
  { href: "/blog", label: "Blog", page: "blog" },
  { href: "/docs", label: "Docs", page: "documentation" },
  { href: "/pricing", label: "Pricing", page: "pricing" },
];

export function Header({ page }: { page: Page }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="landing sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-330 items-center justify-between px-5 sm:px-6">
        <LinkLogoSmall />

        {/* Desktop: everything grouped right with an even rhythm */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground",
                item.page === page && "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`${appInfo.links.loginUrl}`}
            rel="nofollow"
            className="transition-colors hover:text-foreground"
          >
            Login
          </Link>
          <Link href={`${appInfo.links.signupUrl}`} rel="nofollow">
            <Button variant="cta" size="sm" className="h-9 px-4">
              Sign up
            </Button>
          </Link>
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open mobile menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="landing w-[80%] sm:w-[350px]">
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
                <div className="mt-4 space-y-3 px-6">
                  <Link
                    href={`${appInfo.links.loginUrl}`}
                    rel="nofollow"
                    className="block"
                  >
                    <Button variant="ctaOutline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href={`${appInfo.links.signupUrl}`}
                    rel="nofollow"
                    className="block"
                  >
                    <Button variant="cta" className="w-full">
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
  );
}
