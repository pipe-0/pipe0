"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

type Page = "product" | "blog" | "documentation" | "pricing";

const navigationItems: { href: string; label: string; page: Page }[] = [
  { href: "/blog", label: "Blog", page: "blog" },
  { href: "/docs", label: "Docs", page: "documentation" },
  { href: "/pricing", label: "Pricing", page: "pricing" },
];

/**
 * Products menu.
 *
 * Opens on hover like the references, but hover alone would strand keyboard
 * and touch users, so it also opens on focus and on click and closes on
 * Escape or focus leaving the group. Deliberately a plain list rather than a
 * mega-menu: there are two products, and a grid of cards for two items is
 * the kind of repetition that reads as filler.
 */
function ProductsMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Document-level, not on the wrapper: clicking a button does not focus it
     in Safari, so a wrapper-scoped Escape or blur handler never fires for a
     mouse user. This also covers touch, where mouseleave never happens. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground",
          active && "text-foreground",
        )}
      >
        Products
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-[380px] -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200 ease-out",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="rounded-[14px] border border-border bg-background p-1.5 shadow-[0_1px_2px_rgba(14,17,23,0.06),0_18px_44px_rgba(28,35,80,0.14)]">
          {products.map((product) => (
            <Link
              key={product.href}
              href={product.href}
              onClick={() => setOpen(false)}
              className="block rounded-[10px] px-3 py-2.5 transition-colors hover:bg-muted"
            >
              <span className="block text-[14px] font-medium text-foreground">
                {product.name}
              </span>
              <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground">
                {product.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header({ page }: { page: Page }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="landing sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-330 items-center justify-between px-5 sm:px-6">
        <LinkLogoSmall />

        {/* Desktop: everything grouped right with an even rhythm */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <ProductsMenu active={page === "product"} />
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
                <div className="px-6 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Products
                </div>
                {products.map((product) => (
                  <Link
                    key={product.href}
                    href={product.href}
                    className="text-lg text-foreground transition-colors hover:text-muted-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="px-6">{product.name}</div>
                  </Link>
                ))}
                <Separator className="my-1" />
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
