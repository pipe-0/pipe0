import { Band, Brackets, GridCtas, type } from "@/components/grid";
import { WellSheet } from "@/components/well-sheet";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * A centred page hero: an optional muted lead-in, the title, one sentence,
 * and actions. The homepage hero is the reference; this is its shape for
 * every other page.
 */
export function PageHero({
  kicker,
  title,
  lede,
  actions,
}: {
  /** Muted first line, set at the title's scale. */
  kicker?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  /** Actions under the lede. Defaults to the Start free / Book a demo
   *  pair; `false` for none. */
  actions?: ReactNode | false;
}) {
  return (
    <Band>
      <div className="flex flex-col items-center px-6 pb-12 pt-12 text-center sm:px-10 sm:pb-14 sm:pt-16 lg:px-12">
        <h1 className="font-medium">
          {kicker && (
            <span className="block text-balance text-[clamp(24px,2.4vw,34px)] leading-[1.06] tracking-[-0.04em] text-[var(--mark-text-large)]">
              {kicker}
            </span>
          )}
          <span className="mt-1 block text-balance text-[clamp(26px,2.8vw,40px)] leading-[1.04] tracking-[-0.045em] text-foreground">
            {title}
          </span>
        </h1>
        {lede && (
          <p
            className={cn("mx-auto mt-6 max-w-[680px] text-balance", type.lede)}
          >
            {lede}
          </p>
        )}
        {actions !== false && (
          <div className="mt-8 flex w-full min-w-0 justify-center">
            {actions ?? <GridCtas className="justify-center" />}
          </div>
        )}
      </div>
    </Band>
  );
}

const defaultCloseLede =
  "Run a few rows of a list you already enriched somewhere else. Compare the hit rate and the cost per contact.";

/** Closing indigo band — the page ends on the same colour it opens with. */
export function CloseBand({
  title = "Give your GTM team its AI moment.",
  lede = defaultCloseLede,
}: {
  title?: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <Band tone="muted">
      <div className="relative overflow-hidden px-6 py-20 sm:px-10 sm:py-28 lg:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 120% at 88% 0%, rgba(120, 140, 255, 0.45) 0%, transparent 60%), linear-gradient(165deg, #232b94 0%, #2c37b8 55%, #3846d6 100%)",
          }}
        />
        {/* The well from the homepage, in white: the page ends where its
            argument does. */}
        <WellSheet
          view={{ x: -700, y: -352, w: 1400, h: 560 }}
          tone="inverse"
          className="opacity-70"
        />
        <Brackets inset={14} tone="inverse" />
        {/* The hero's shape, in white: a centred title, the sentence
            under it a step smaller, then the way in. */}
        <div className="relative z-10 sm:mx-auto sm:max-w-[820px] sm:text-center">
          <h2 className={cn(type.title, "text-white")}>{title}</h2>
          <p
            className={cn(
              "mt-3 max-w-[52ch] text-pretty sm:mx-auto sm:mt-4 sm:text-balance",
              type.lede,
              "text-white/75",
            )}
          >
            {lede}
          </p>
          <GridCtas tone="inverse" className="mt-8 sm:justify-center" />
        </div>
      </div>
    </Band>
  );
}
