import Image from "next/image";
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
        /* A friendly assistant rather than a chat bubble: a soft clay
           character (assets/illustrations/buddy.py) in a round avatar. Its
           face is drawn here, not in the render, so it can blink; the whole
           character bobs gently. Both stop under reduced motion. */
        className="group flex h-12 items-center gap-2.5 rounded-full border border-[var(--rule-strong)] bg-background/95 py-1 pl-1 pr-5 text-[15px] font-medium text-foreground shadow-[0_1px_2px_rgba(14,17,23,0.06),0_10px_30px_rgba(28,35,80,0.12)] backdrop-blur transition-[box-shadow,transform] hover:-translate-y-px hover:shadow-[0_1px_2px_rgba(14,17,23,0.06),0_14px_36px_rgba(28,35,80,0.18)]"
      >
        <span className="relative size-10 shrink-0 overflow-hidden rounded-full border border-[var(--rule)] bg-[radial-gradient(circle_at_50%_30%,#ffffff_0%,#eef0ff_70%,#e2e6fb_100%)]">
          <span className="buddy-bob absolute left-1/2 top-[-1px] block size-[54px] -translate-x-1/2">
            <Image
              src="/media/website/illustrations/buddy.png"
              alt=""
              width={640}
              height={640}
              sizes="54px"
              className="size-[54px] brightness-[1.05] saturate-[1.15]"
            />
            {/* Face: two eyes and a small smile, placed on the body. */}
            <span className="buddy-blink absolute left-[41%] top-[48%] h-[5px] w-[3.5px] rounded-full bg-[#1c2333]" />
            <span className="buddy-blink absolute left-[56%] top-[48%] h-[5px] w-[3.5px] rounded-full bg-[#1c2333]" />
            <span className="absolute left-[46%] top-[58%] h-[3px] w-[6px] rounded-b-full border-b-[1.5px] border-[#1c2333]" />
          </span>
        </span>
        Ask AI
      </AISearchTrigger>
    </AISearch>
  );
}
