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
import { BetaAnnouncementBanner } from "@/components/features/announcements/banners/beta-announcement-banner";

// Navigation items array for better maintainability
const navigationItems = [
  { href: "/", label: "Product" },
  { href: "/blog", label: "Blog" },
  { href: "/resources/documentation", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function Header({}: {
  page: "product" | "blog" | "documentation" | "pricing";
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <BetaAnnouncementBanner />
      <header className="sticky top-0 z-50 w-full lg:px-0 shadow-sm">
        <div className="container mx-auto px-4 md:px-0 flex items-center justify-between py-2 backdrop-blur-sm">
          <LinkLogo />

          {/* Desktop Navigation */}
          <nav className="hidden space-x-1 md:flex grow px-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm dark:text-gray-300 transition-colors hover:text-white"
              >
                <Button variant="ghost">{item.label}</Button>
              </Link>
            ))}
          </nav>

          <div className="gap-3 items-center hidden md:flex">
            <Button
              asChild
              variant="secondary"
              size="icon"
              className="h-8 w-8 px-0 border relative"
            >
              <Link
                href={appInfo.links.discord}
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Discord</title>
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
                <span className="sr-only">GitHub</span>

                <span className="badge-new absolute -top-0.5 -translate-y-1/2 -translate-x-1/2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="icon"
              className="h-8 w-8 px-0 border"
            >
              <Link
                href={appInfo.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>

            {/* <ModeSwitcher /> */}
            {/* Desktop Sign In */}
            <Link href={`${appInfo.links.loginUrl}`} rel="nofollow">
              <Button
                variant="secondary"
                className="hidden border md:inline-flex  hover:bg-stone/30"
              >
                Sign in
              </Button>
            </Link>
            <Link href={`${appInfo.links.signupUrl}`} rel="nofollow">
              <Button
                variant="default"
                className="hidden border md:inline-flex hover:bg-stone/30"
              >
                Sign up
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
      </header>
    </>
  );
}
