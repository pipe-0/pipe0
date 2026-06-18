import { MessageCircleIcon } from "lucide-react";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { cn } from "@/lib/utils";
import { AISearch, AISearchPanel, AISearchTrigger } from "@/components/ai/search";

/**
 * Floating "Ask AI" button + chat panel.
 *
 * The button is `fixed` (always visible while scrolling) but stays inside the
 * page's content bounds rather than hugging the viewport edge: on screens wider
 * than `bound` it aligns to the right edge of the centered content column; on
 * narrower screens it falls back to a fixed gutter from the viewport edge.
 *
 * `bound` is the max content width to align to (the widest element on the page):
 * - docs  → `var(--fd-layout-width, 97rem)` (the fumadocs layout width)
 * - home  → the hero width (`1750px`)
 * - pricing → the hero width (`96rem`)
 *
 * Render it once inside a layout/page that sits within a fumadocs `RootProvider`.
 */
export function AskAiButton({
  bound = "var(--fd-layout-width, 97rem)",
  variant = "docked",
}: {
  bound?: string;
  /**
   * `docked` (default) docks the chat panel into the fumadocs docs grid.
   * `overlay` renders it as a fixed right-side drawer — use on non-docs pages
   * (e.g. the marketing site) that have no docs grid to dock into.
   */
  variant?: "docked" | "overlay";
}) {
  // Gap from the content edge; `--removed-body-scroll-bar-size` keeps the button
  // from shifting when the panel opens and the page scrollbar is removed.
  const gap = "calc(1.5rem + var(--removed-body-scroll-bar-size, 0px))";

  return (
    <AISearch>
      <AISearchPanel variant={variant} />
      <AISearchTrigger
        position="float"
        style={{
          insetInlineEnd: `max(${gap}, calc((100vw - ${bound}) / 2 + ${gap}))`,
        }}
        className={cn(
          buttonVariants({
            color: "secondary",
            className:
              "h-12 gap-2 rounded-full px-5 text-base text-fd-muted-foreground [&_svg]:size-5",
          }),
        )}
      >
        <MessageCircleIcon className="size-5" />
        Ask AI
      </AISearchTrigger>
    </AISearch>
  );
}
