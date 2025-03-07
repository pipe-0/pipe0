"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/features/docs/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

function HeaderTabLink({
  href,
  isActive,
  ...rest
}: ComponentProps<typeof Link> & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
        isActive
          ? "border-brand rounded-lg border-2 font-bold"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}
      {...rest}
    />
  );
}

export function DocsHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <header className="shadow-2xl h-13">
      <div className="px-8">
        <div className="grid grid-cols-[200px_1fr_300px] items-center py-2">
          {/* Trigger */}
          <div className="flex items-center gap-3">
            <SidebarTrigger className="mr-2" />
            <ThemeToggle />
          </div>

          {/* Main Navigation Tabs */}
          <div className="mx-4 hidden md:flex justify-center">
            <nav className="flex space-x-1">
              <HeaderTabLink
                href="/docs"
                isActive={
                  isActive("/docs") &&
                  !isActive("/docs/pipe-catalog") &&
                  !isActive("/docs/api-reference")
                }
              >
                Documentation
              </HeaderTabLink>
              <HeaderTabLink
                href="/docs/pipe-catalog"
                isActive={isActive("/docs/pipe-catalog")}
              >
                Pipe Catalog
              </HeaderTabLink>
              <HeaderTabLink
                href="/docs/api-reference"
                isActive={isActive("/docs/api-reference")}
              >
                API Reference
              </HeaderTabLink>
            </nav>
          </div>

          {/* <div className="ml-auto flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="default" size="sm" disabled>
                Log in
              </Button>
            </nav>
          </div> */}
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="border-t md:hidden">
        <nav className="flex">
          <Link
            href="/docs"
            className={cn(
              "flex-1 px-3 py-2 text-center text-xs font-medium transition-colors",
              isActive("/docs") &&
                !isActive("/docs/pipe-catalog") &&
                !isActive("/docs/api-reference")
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground"
            )}
          >
            Docs
          </Link>
          <Link
            href="/docs/pipe-catalog"
            className={cn(
              "flex-1 px-3 py-2 text-center text-xs font-medium transition-colors",
              isActive("/docs/pipe-catalog")
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground"
            )}
          >
            Pipes
          </Link>
          <Link
            href="/docs/api-reference"
            className={cn(
              "flex-1 px-3 py-2 text-center text-xs font-medium transition-colors",
              isActive("/docs/api-reference")
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground"
            )}
          >
            API
          </Link>
        </nav>
      </div>
    </header>
  );
}
