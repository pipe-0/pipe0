"use client";

import * as Primitive from "fumadocs-core/toc";
import { TOCScrollArea, useTOCItems } from "fumadocs-ui/components/toc";
import { Text } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Replaces fumadocs' built-in TOC, whose progress line is an SVG path that
 * bends to follow heading depth. Here the rail is a plain 1px border and the
 * active section is marked by coloring the same pixel column on each active
 * item — depth is expressed through indentation only, so the line stays
 * straight.
 */
function indentClass(depth: number) {
  if (depth <= 2) return "ps-3.5";
  if (depth === 3) return "ps-7";
  return "ps-10";
}

function TocItem({ item }: { item: Primitive.TOCItemType }) {
  return (
    <Primitive.TOCItem
      href={item.url}
      className={cn(
        "prose relative -ms-px border-s border-transparent py-1.5 text-sm text-fd-muted-foreground transition-colors [overflow-wrap:anywhere]",
        "hover:text-fd-accent-foreground data-[active=true]:border-fd-primary data-[active=true]:text-fd-primary",
        indentClass(item.depth),
      )}
    >
      {item.title}
    </Primitive.TOCItem>
  );
}

export function StraightToc() {
  const items = useTOCItems();

  if (items.length === 0) {
    return (
      <div
        id="nd-toc-placeholder"
        className="hidden xl:layout:[--fd-toc-width:268px]"
      />
    );
  }

  return (
    <div
      id="nd-toc"
      className="sticky top-(--fd-docs-row-1) flex h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] w-(--fd-toc-width) flex-col pt-12 pe-4 pb-2 [grid-area:toc] max-xl:hidden xl:layout:[--fd-toc-width:268px]"
    >
      <h3
        id="toc-title"
        className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground"
      >
        <Text className="size-4" />
        On this page
      </h3>
      <TOCScrollArea>
        <div className="flex flex-col border-s border-fd-border">
          {items.map((item) => (
            <TocItem key={item.url} item={item} />
          ))}
        </div>
      </TOCScrollArea>
    </div>
  );
}
