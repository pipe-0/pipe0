"use client";

import Link from "fumadocs-core/link";
import { usePathname } from "fumadocs-core/framework";
import type { FC } from "react";
import * as PageTree from "fumadocs-core/page-tree";
import { cn } from "@/lib/utils";
import { useFolderDepth } from "fumadocs-ui/components/sidebar/base";

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

/* No colour transition: the glossy active state is a gradient, which can't
   animate, so on deselect the gradient vanished at once while the border and
   text colours faded — a bordered ghost of the old item flashed for 150ms.
   Active and inactive now swap in one frame. */
const baseClass = cn(
  "relative flex flex-row items-center gap-2 rounded-[7px] border border-transparent py-1.5 pe-2.5 text-start text-[14px] wrap-anywhere",
  "[&_svg]:size-4 [&_svg]:shrink-0",
);

const inactiveClass = cn(
  "text-fd-muted-foreground",
  "hover:bg-[var(--well)] hover:text-fd-foreground hover:transition-none",
);

// Active item: the glossy indigo of the site's primary buttons (top
// highlight, darker edge, soft gradient), so "you are here" uses the same
// material as "start here".
const activeClass = cn("btn-glossy font-medium text-white");

/* fumadocs' own indentation (layouts/docs/slots/sidebar getItemOffset), so
   nested items clear the folder's tree line. */
function itemOffset(depth: number) {
  return `calc(${2 + 3 * depth} * var(--spacing))`;
}

export const CatalogAwareSidebarItem: FC<{ item: PageTree.Item }> = ({
  item,
}) => {
  const pathname = usePathname();
  const depth = useFolderDepth();
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
      style={{ paddingInlineStart: itemOffset(depth) }}
    >
      {item.icon}
      {item.name}
    </Link>
  );
};
