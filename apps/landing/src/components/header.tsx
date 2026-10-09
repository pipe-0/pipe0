"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Brackets, buttonSkin, dotsStyle, frame } from "@/components/grid";
import Image from "next/image";
import { LinkLogoSmall } from "@/components/logo";
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

type Page = "product" | "api" | "mcp" | "documentation" | "pricing";

/* The API lives in the Products menu; a second top-level entry for it read
   as a duplicate. */
const navigationItems: { href: string; label: string; page: Page }[] = [
  { href: "/docs", label: "Docs", page: "documentation" },
  { href: "/pricing", label: "Pricing", page: "pricing" },
];

/**
 * Products menu.
 *
 * Opens on hover like the references, but hover alone would strand keyboard
 * and touch users, so it also opens on focus and on click and closes on
 * Escape or focus leaving the group.
 */
function ProductsMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  /* Which product's drawing the menu shows; follows hover and focus. */
  const [shown, setShown] = useState(0);
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

      {/* A small mega-menu: the hovered product's Blender drawing on a
          dotted stage on the left, the products on the right. Anchored to
          the trigger's left edge so it never runs off the page. */}
      <div
        className={cn(
          "absolute left-0 top-full z-50 w-[560px] -translate-x-3 pt-3 transition-[opacity,transform] duration-200 ease-out",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="grid grid-cols-[200px_minmax(0,1fr)] overflow-hidden rounded-[12px] border border-[var(--rule-strong)] bg-background font-normal shadow-[0_1px_2px_rgba(14,17,23,0.06),0_18px_44px_rgba(28,35,80,0.14)]">
          <div
            aria-hidden
            style={dotsStyle}
            className="relative border-r border-[var(--rule)]"
          >
            <Brackets />
            {products.map((product, i) => (
              <Image
                key={product.href}
                src={product.illustration}
                alt=""
                width={1600}
                height={1200}
                sizes="200px"
                className={cn(
                  "absolute inset-0 m-auto h-auto w-[86%] transition-opacity duration-300",
                  i === shown ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
          <div className="p-1.5">
            {products.map((product, i) => (
              <Link
                key={product.href}
                href={product.href}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setShown(i)}
                onFocus={() => setShown(i)}
                className="group/item flex items-start justify-between gap-4 rounded-[8px] px-4 py-3.5 transition-colors hover:bg-[var(--well)] focus-visible:bg-[var(--well)] focus-visible:outline-none"
              >
                <span>
                  <span className="block text-[15px] font-medium text-foreground">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-muted-foreground">
                    {product.description}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="pt-0.5 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover/item:translate-x-0.5 group-hover/item:opacity-100"
                >
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header({ page }: { page: Page }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="landing sticky top-0 z-50 w-full border-b border-[var(--rule)] bg-background/85 backdrop-blur-lg">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-330 items-center justify-between px-3 sm:px-5",
          frame,
        )}
      >
        {/* Logo and nav as one group on the left; actions on the right. No
            dividers inside the bar — the rails and the rule beneath it
            already frame it, and boxes inside a box read as clutter. */}
        <div className="flex items-center gap-6">
          <span className="px-2">
            <LinkLogoSmall />
          </span>
          {/* Dark, semibold labels with a soft pill on hover. */}
          <nav className="hidden items-center gap-1 text-[14.5px] font-semibold text-foreground md:flex [&>*]:rounded-[8px] [&>*]:px-3 [&>*]:py-1.5 [&>*]:transition-colors [&>*:hover]:bg-[var(--well)]">
            <ProductsMenu active={page === "api" || page === "mcp"} />
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(item.page === page && "bg-[var(--well)]")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={`${appInfo.links.loginUrl}`}
            rel="nofollow"
            className="rounded-[8px] px-3 py-1.5 text-[14.5px] font-semibold text-foreground transition-colors hover:bg-[var(--well)]"
          >
            Log in
          </Link>
          <Link
            href={`${appInfo.links.signupUrl}`}
            rel="nofollow"
            className={cn(
              "inline-flex h-9 items-center rounded-[8px] border px-4 text-[14.5px] font-medium",
              buttonSkin.primary,
            )}
          >
            Start free
          </Link>
        </div>

        {/* Mobile */}
        {/* Mobile: the primary action and the menu, both at the logo's
            36px height so the bar balances. */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={`${appInfo.links.signupUrl}`}
            rel="nofollow"
            className={cn(
              "inline-flex h-9 items-center rounded-[8px] border px-3.5 text-[14.5px] font-medium",
              buttonSkin.primary,
            )}
          >
            Start free
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Toggle menu"
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-[8px] border",
                  buttonSkin.secondary,
                )}
              >
                <Menu className="size-[18px]" strokeWidth={2} />
                <span className="sr-only">Open mobile menu</span>
              </button>
            </SheetTrigger>
            {/* Mobile menu: the products as illustrated cards (the same
                Blender drawings as the desktop Products menu), the plain
                pages as ruled rows, and the two actions pinned to the
                bottom where a thumb reaches them. */}
            <SheetContent
              side="right"
              className="landing flex w-[86%] flex-col gap-0 p-0 sm:w-[380px]"
            >
              <SheetHeader className="flex h-16 flex-row items-center border-b border-[var(--rule)] px-5">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <LinkLogoSmall />
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4 pb-6 pt-5">
                <p className="px-1 text-[13px] text-muted-foreground">Products</p>
                <div className="mt-3 space-y-2.5">
                  {products.map((product) => (
                    <Link
                      key={product.href}
                      href={product.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-stretch overflow-hidden rounded-[12px] border border-[var(--rule)] transition-colors active:bg-[var(--well)]"
                    >
                      <span
                        style={dotsStyle}
                        className="relative flex w-[88px] shrink-0 items-center justify-center border-r border-[var(--rule)]"
                      >
                        <Image
                          src={product.illustration}
                          alt=""
                          width={1600}
                          height={1200}
                          sizes="88px"
                          className="h-auto w-[76px]"
                        />
                      </span>
                      <span className="min-w-0 px-3.5 py-3">
                        <span className="block text-[15px] font-medium text-foreground">
                          {product.name}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                          {product.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>

                <ul className="mt-6 border-t border-[var(--rule)]">
                  {navigationItems.map((item) => (
                    <li key={item.href} className="border-b border-[var(--rule)]">
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex h-12 items-center justify-between px-1 text-[16px] font-medium text-foreground",
                          item.page === page && "text-primary",
                        )}
                      >
                        {item.label}
                        <span aria-hidden className="text-muted-foreground">
                          &rarr;
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2.5 border-t border-[var(--rule)] bg-[var(--well)] p-4">
                <Link
                  href={`${appInfo.links.loginUrl}`}
                  rel="nofollow"
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-[8px] border text-[15px] font-medium",
                    buttonSkin.secondary,
                  )}
                >
                  Log in
                </Link>
                <Link
                  href={`${appInfo.links.signupUrl}`}
                  rel="nofollow"
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-[8px] border text-[15px] font-medium",
                    buttonSkin.primary,
                  )}
                >
                  Start free
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
