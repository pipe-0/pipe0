import CalButton from "@/components/cal-button";
import { appInfo } from "@/lib/const";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The landing page's line grid.
 *
 * The whole page sits in one frame: two rails (the `border-x` of every band)
 * run from the header to the footer, each band closes with a full-bleed rule,
 * and a small cross marks every point where a rule meets a rail. Inside a
 * band, content is laid out in cells that share 1px walls — drawn with the
 * gap-px-over-a-rule-coloured-background trick, so walls never double up and
 * never need per-cell border bookkeeping.
 *
 * Nothing here is rounded. Radius belongs to the product UI shown inside the
 * cells, not to the page around it; that contrast is what makes the product
 * read as the subject.
 */

/** The frame: rails either side from `sm` up; on phones the content runs
 *  edge to edge with section rules only — rails and crosses are clutter at
 *  that width. */
export const frame =
  "relative mx-auto w-full max-w-330 border-[var(--rule)] sm:w-[calc(100%-3rem)] sm:border-x";

/** A full-bleed band: rule below, rails either side, crosses on top. */
export function Band({
  children,
  className,
  inner,
  marks = true,
  id,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  /** "muted" lays the band, edge to edge, on the well colour. Cells stay
   *  white, so the grid reads as white panels on a muted ground. */
  tone?: "default" | "muted";
  /** Classes for the framed inner box. */
  inner?: string;
  /** Crosses where the band's top edge meets the rails. */
  marks?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative border-b border-[var(--rule)]",
        tone === "muted" && "bg-[var(--well)]",
        className,
      )}
    >
      <div className={cn(frame, inner)}>
        {marks && (
          <>
            <Cross className="-left-[6px] -top-[6px]" />
            <Cross className="-right-[6px] -top-[6px]" />
          </>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * A registration cross on whole pixels. 11px box, 1px arms at pixel 5, so the
 * centre pixel sits exactly on a 1px rule when the box is offset by -6px from
 * the padding edge (the rail border and the rule above both sit 1px outside
 * it). No percentages or half-pixel translates — those rendered the arms
 * blurred and a pixel off the rails.
 */
export function Cross({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-20 size-[11px] max-sm:hidden",
        className,
      )}
    >
      <span className="absolute left-[5px] top-0 h-[11px] w-px bg-[var(--mark)]" />
      <span className="absolute left-0 top-[5px] h-px w-[11px] bg-[var(--mark)]" />
    </span>
  );
}

/** Cells that share 1px walls. Children should each be a <Cell>. */
export function Cells({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    /* Desktop: cells share 1px walls. Phones: the same cells become stacked
       rounded cards with breathing room — hairline walls alone don't give
       enough separation on a narrow screen. */
    <div
      className={cn(
        "grid gap-px bg-[var(--rule)] max-sm:gap-3 max-sm:bg-transparent max-sm:px-4 max-sm:py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Cell({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-w-0 bg-[var(--cell-bg,var(--background))] max-sm:overflow-hidden max-sm:rounded-[14px] max-sm:border max-sm:border-[var(--rule)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Dot grid for illustration wells — the drafting-paper stage the Blender line
 * drawings stand on. Inline rather than a class in globals.css: the CSS
 * pipeline dropped the equivalent `.landing .dots` rule without a warning.
 */
export const dotsStyle = {
  backgroundColor: "var(--well)",
  backgroundImage: "radial-gradient(#cfd4e6 1px, transparent 1.3px)",
  backgroundSize: "8px 8px",
} as const;

/**
 * Bar fills for comparison charts, in the glossy button language (top
 * highlight, darker edge, soft vertical gradient): indigo for pipe0, a
 * soft amber for whatever it is compared against. Inline styles, like
 * `dotsStyle`, so they don't depend on globals.css.
 */
export const barSkin = {
  win: {
    background: "linear-gradient(180deg, #5f6ae8 0%, #3b49e0 60%)",
    border: "1px solid #2c37b0",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.34), inset 0 -1px 0 rgba(0,0,0,0.12), 0 1px 2px rgba(14,17,23,0.18)",
  },
  /* The comparison: a soft amber, distinct from pipe0's indigo without the
     alarm of red. */
  lose: {
    background: "linear-gradient(180deg, #fdf0c8 0%, #f8e2a0 60%)",
    border: "1px solid #e8cb76",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(14,17,23,0.05)",
  },
  /* The weakest result, one step past amber: a pale coral at the same
     lightness, so the row reads "worse" without reading "error". */
  worst: {
    background: "linear-gradient(180deg, #fde4df 0%, #f8cbc3 60%)",
    border: "1px solid #eaa598",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(14,17,23,0.05)",
  },
} as const;

/** Standard cell padding. */
export const pad = "px-6 py-10 sm:px-10 sm:py-12 lg:px-12";

/**
 * A section's head: the title on the left and, optionally, one sentence of
 * lede on the right, bottom-aligned so the two read as a pair across the
 * gutter. No eyebrow, no index — the rule above already says "new section".
 */
export function SectionHead({
  title,
  lede,
}: {
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <div className="grid gap-6 px-6 pb-10 pt-12 sm:bg-background sm:px-10 sm:pb-12 sm:pt-16 lg:grid-cols-12 lg:items-end lg:gap-12 lg:px-12">
      <h2 data-reveal="up" className="text-balance text-[clamp(28px,2.3vw,32px)] font-medium leading-[1.02] tracking-[-0.04em] text-foreground lg:col-span-8">
        {title}
      </h2>
      {lede && (
        <p
          data-reveal="up"
          style={{ ["--reveal-delay" as string]: "90ms" }}
          className="max-w-[40ch] text-pretty text-[17px] leading-relaxed text-muted-foreground lg:col-span-4 lg:justify-self-end lg:pb-2">
          {lede}
        </p>
      )}
    </div>
  );
}

/** Four corner brackets, inset a few pixels from the parent's edge. */
export function Brackets({
  inset = 6,
  tone = "default",
}: {
  inset?: number;
  /** "inverse" on the indigo surfaces. */
  tone?: "default" | "inverse";
}) {
  const arm = cn(
    "absolute size-2.5",
    tone === "inverse" ? "border-white/50" : "border-[var(--mark)]",
  );
  const s = { margin: inset };
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <span style={s} className={cn(arm, "left-0 top-0 border-l border-t")} />
      <span style={s} className={cn(arm, "right-0 top-0 border-r border-t")} />
      <span style={s} className={cn(arm, "bottom-0 left-0 border-b border-l")} />
      <span style={s} className={cn(arm, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}

/** A link that runs the full width of its cell, as the cell's last row. */
export function RowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-14 items-center justify-between border-t border-[var(--rule)] px-6 text-[14.5px] font-medium text-foreground transition-colors hover:bg-[var(--well)] sm:px-10 lg:px-12",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
      >
        &rarr;
      </span>
    </Link>
  );
}

const btn =
  "inline-flex h-11 items-center justify-center rounded-[8px] border px-5 text-[15px] font-medium transition-[background,border-color] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/**
 * Button skins. The two default ones are the glossy treatment from the
 * original site (.btn-glossy / .btn-glossy-outline in globals.css: a top
 * highlight, a darker edge, a soft vertical gradient), so a button reads as
 * an object you can press against the flat line grid. The inverse pair is
 * the same idea drawn in white for the indigo closing band.
 */
export const buttonSkin = {
  primary: "btn-glossy text-white",
  secondary: "btn-glossy-outline text-foreground",
  inversePrimary:
    "border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#eef0fb_100%)] text-[#1c2333] shadow-[inset_0_-1px_0_rgba(28,35,80,0.08),0_1px_2px_rgba(10,14,60,0.35)] hover:bg-[linear-gradient(180deg,#f6f7fd_0%,#e4e7f8_100%)]",
  inverseSecondary:
    "border-white/30 bg-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:border-white/50 hover:bg-white/[0.12] hover:text-white",
} as const;

/** A link styled as a grid button, for pages whose actions aren't the
 *  Start free / Book a demo pair. */
export function ButtonLink({
  href,
  children,
  tone = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(btn, buttonSkin[tone], className)}
    >
      {children}
    </Link>
  );
}

/** Primary + demo pair. */
export function GridCtas({
  className,
  tone = "default",
}: {
  className?: string;
  /** "inverse" for the indigo closing band. */
  tone?: "default" | "inverse";
}) {
  const inverse = tone === "inverse";
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Link
        href={appInfo.links.signupUrl}
        rel="nofollow"
        className={cn(
          btn,
          inverse ? buttonSkin.inversePrimary : buttonSkin.primary,
        )}
      >
        Start free
      </Link>
      {/* CalButton renders a <Button>; the classes win via tailwind-merge. */}
      <CalButton
        variant="ghost"
        className={cn(
          btn,
          "h-11 rounded-[8px]",
          inverse ? buttonSkin.inverseSecondary : buttonSkin.secondary,
        )}
      >
        Book a demo
      </CalButton>
    </div>
  );
}
