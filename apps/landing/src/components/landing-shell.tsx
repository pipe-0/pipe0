import { AskAiButton } from "@/components/ai/ask-ai-button";
import { CookieBanner } from "@/components/cookie-banner";
import { Footer } from "@/components/footer";
import { Band, Brackets, GridCtas } from "@/components/grid";
import { Header } from "@/components/header";
import { RevealRoot } from "@/components/reveal-root";
import type { ReactNode } from "react";

/**
 * The frame every marketing page lives in: the grid header, the page's
 * bands, the footer inside the frame, and the Ask AI button bounded to the
 * frame width. Pages only supply their bands.
 */
export function LandingShell({
  page,
  children,
}: {
  page: "product" | "api" | "mcp" | "pricing" | "documentation";
  children: ReactNode;
}) {
  return (
    <div className="landing min-h-screen overflow-x-clip bg-background">
      <Header page={page} />
      {children}
      {/* Muted ground outside the rails; the footer draws its own white
          panel and muted copyright row inside them. */}
      <Band tone="muted" className="border-b-0">
        <Footer />
      </Band>
      <AskAiButton bound="1320px" variant="overlay" />
      <RevealRoot />
      <CookieBanner />
    </div>
  );
}

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
            <span className="block text-balance text-[clamp(24px,2.4vw,34px)] leading-[1.06] tracking-[-0.04em] text-[var(--mark)]">
              {kicker}
            </span>
          )}
          <span className="mt-1 block text-balance text-[clamp(26px,2.8vw,40px)] leading-[1.04] tracking-[-0.045em] text-foreground">
            {title}
          </span>
        </h1>
        {lede && (
          <p className="mx-auto mt-6 max-w-[680px] text-balance text-[17px] leading-[1.55] text-muted-foreground sm:text-[19px]">
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
        <Brackets inset={14} tone="inverse" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 className="text-balance text-[clamp(28px,2.8vw,40px)] font-medium leading-[0.98] tracking-[-0.05em] text-white lg:col-span-8">
            {title}
          </h2>
          <div className="lg:col-span-4">
            <p className="max-w-[40ch] text-[17px] leading-relaxed text-white/80">
              {lede}
            </p>
            <GridCtas tone="inverse" className="mt-7" />
          </div>
        </div>
      </div>
    </Band>
  );
}
