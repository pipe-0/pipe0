import { source } from "@/lib/source";
import { flattenTree, getPageTreeRoots } from "fumadocs-core/page-tree";
import type * as PageTree from "fumadocs-core/page-tree";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Previous / next page links at the foot of a docs page.
 *
 * Replaces fumadocs' footer cards. Neighbours are found within the current
 * section (Documentation, Sheets, API reference, …) and skip the hidden
 * catalog-entry nodes the tree carries for sidebar resolution (empty name).
 * Each side is a ruled cell: a quiet direction label, the page title, and an
 * arrow tile that turns glossy indigo on hover — the site's button material.
 */
export function PageNav({ url }: { url: string }) {
  const { previous, next } = neighbours(url);
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Previous and next page"
      className="not-prose mt-16 grid gap-3 border-t border-[var(--rule)] pt-8 sm:grid-cols-2"
    >
      {previous ? <NavCell item={previous} dir="previous" /> : <span />}
      {next && <NavCell item={next} dir="next" />}
    </nav>
  );
}

function NavCell({ item, dir }: { item: PageTree.Item; dir: "previous" | "next" }) {
  const isNext = dir === "next";
  const Arrow = isNext ? ArrowRight : ArrowLeft;
  return (
    <Link
      href={item.url}
      className={`group flex items-center gap-4 rounded-[10px] border border-[var(--rule)] px-4 py-3.5 transition-colors hover:border-[var(--rule-strong)] hover:bg-[var(--well)] ${
        isNext ? "flex-row-reverse text-right" : ""
      }`}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-[8px] border border-[var(--rule-strong)] text-muted-foreground transition-colors group-hover:border-[#2c37b0] group-hover:bg-[linear-gradient(180deg,#5f6ae8_0%,#3b49e0_60%)] group-hover:text-white group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.34)]">
        <Arrow className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] text-muted-foreground">
          {isNext ? "Next" : "Previous"}
        </span>
        <span className="block truncate text-[15px] font-medium tracking-[-0.01em] text-foreground">
          {item.name}
        </span>
      </span>
    </Link>
  );
}

function neighbours(url: string): {
  previous?: PageTree.Item;
  next?: PageTree.Item;
} {
  const tree = source.getPageTree();
  for (const root of getPageTreeRoots(tree)) {
    const pages = flattenTree(root.children).filter(
      (item) => typeof item.name === "string" ? item.name !== "" : true,
    );
    const index = pages.findIndex((item) => item.url === url);
    if (index === -1) continue;
    return { previous: pages[index - 1], next: pages[index + 1] };
  }
  return {};
}
