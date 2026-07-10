"use client";

import Link from "fumadocs-core/link";
import { usePathname } from "fumadocs-core/framework";
import type { FC } from "react";
import * as PageTree from "fumadocs-core/page-tree";
import { cn } from "@/lib/utils";

const NESTED_MATCH_URLS = new Set([
  "/docs/pipe-catalog",
  "/docs/search-catalog",
]);

function trimTrailingSlash(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

function isActive(href: string, pathname: string, nested: boolean): boolean {
  const a = trimTrailingSlash(href);
  const b = trimTrailingSlash(pathname);
  return a === b || (nested && b.startsWith(`${a}/`));
}

const baseClass = cn(
  "relative flex flex-row items-center gap-2 rounded-lg p-2 ps-3 text-start transition-colors wrap-anywhere",
  "[&_svg]:size-4 [&_svg]:shrink-0",
);

const inactiveClass = cn(
  "text-fd-muted-foreground",
  "hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none",
);

// Active item gets the same glossy treatment as primary CTA buttons —
// primary gradient fill, darker edge, and the inset highlight/glare.
const activeClass = cn("btn-glossy-indigo btn-glossy border text-white");

export const CatalogAwareSidebarItem: FC<{ item: PageTree.Item }> = ({
  item,
}) => {
  const pathname = usePathname();
  const nested = NESTED_MATCH_URLS.has(item.url);
  const active = isActive(item.url, pathname, nested);

  // Catalog entry pages are injected into the tree so the sidebar can resolve
  // its root on detail pages (see catalogEntryTreePlugin), but only the
  // catalog index links should be visible.
  const isHiddenCatalogEntry = [...NESTED_MATCH_URLS].some((url) =>
    item.url.startsWith(`${url}/`),
  );
  if (isHiddenCatalogEntry) return null;

  return (
    <Link
      href={item.url}
      external={item.external}
      data-active={active}
      className={cn(baseClass, active ? activeClass : inactiveClass)}
    >
      {item.icon}
      {item.name}
    </Link>
  );
};
