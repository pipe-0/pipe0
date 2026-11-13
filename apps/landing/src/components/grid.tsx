import { createLink } from "@tanstack/react-router";
import CalButton from "@/components/cal-button";
import { appInfo } from "@/lib/const";
import { cn } from "@/lib/utils";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

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
        // On phones a band of cells is a stack of bordered cards; a rule
        // right under the last card would be a second line doing the same
        // job, so the band drops it there.
        "relative border-b border-[var(--rule)] max-sm:has-[[data-cells]]:border-b-0",
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
      data-cells
      className={cn(
        // Most callers add a rule above the cells. On phones the cards
        // carry their own border, so that rule goes too.
        "grid gap-px bg-[var(--rule)] max-sm:gap-3 max-sm:!border-t-0 max-sm:bg-transparent max-sm:px-4 max-sm:pb-6 max-sm:pt-0",
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

/* Everything pipe0 is compared against is one grey: a neutral with a trace
   of the brand's indigo in it, strong enough to read as a bar and not as an
   empty track. */
const compared = {
  background: "linear-gradient(180deg, #a3a9bd 0%, #8a91a8 60%)",
  border: "1px solid #747c95",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.08), 0 1px 2px rgba(14,17,23,0.1)",
} as const;

/**
 * Bar fills for comparison charts, in the glossy button language (top
 * highlight, darker edge, soft vertical gradient). Two colours only: indigo
 * for pipe0, grey for everything else. Colour on this site means "pipe0" or
 * "you can press this"; a chart that used yellow and coral for the others
 * was louder than its own message. Inline styles, like `dotsStyle`, so they
 * don't depend on globals.css.
 */
export const barSkin = {
  win: {
    background: "linear-gradient(180deg, #5f6ae8 0%, #3b49e0 60%)",
    border: "1px solid #2c37b0",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.34), inset 0 -1px 0 rgba(0,0,0,0.12), 0 1px 2px rgba(14,17,23,0.18)",
  },
  lose: compared,
  /* Kept as its own key for the charts that mark their weakest row; it is
     the same grey, and the bar's length says the rest. */
  worst: compared,
  /* The far end of a range ("25 to 100¢"): flat and pale, behind the solid
     bar that marks where the range starts. */
  range: { background: "hsl(228 16% 87%)" },
} as const;

/** Standard cell padding. */
export const pad = "px-6 py-10 sm:px-10 sm:py-12 lg:px-12";

/**
 * The type scale of the marketing pages: 14, 16, 18 and 22 pixels, a
 * section title, and the hero's headline (set where it is used). Nothing
 * else. On phones the two largest text steps come down one (18 to 16, 22 to
 * 20). A new size is almost never the answer; pick the nearest step. Before
 * this existed the homepage alone used twenty sizes, and it showed.
 *
 * Each step carries its own tone and leading, so a component only adds
 * layout (margins, max-widths). Override the colour with `cn(type.x, ...)`.
 * Controls (buttons, the nav) are 14 or 16 and medium.
 */
export const type = {
  /** A section's title. */
  title:
    "text-balance text-[clamp(26px,2.3vw,32px)] font-medium leading-[1.14] tracking-[-0.035em] text-foreground",
  /** The sentence under a title, and under the hero's headline. */
  lede: "text-[16px] leading-[1.55] text-muted-foreground sm:text-[18px]",
  /** The title of a card or a cell, and a quote. */
  heading:
    "text-[20px] font-medium leading-[1.2] tracking-[-0.03em] text-foreground sm:text-[22px]",
  /** A smaller title where many stand together: a question in a list. */
  subheading:
    "text-[18px] font-medium leading-snug tracking-[-0.015em] text-foreground",
  /** Running text. */
  body: "text-[16px] leading-relaxed text-muted-foreground",
  /** Captions, labels and notes. */
  small: "text-[14px] leading-relaxed text-muted-foreground",
} as const;

/** Corner radii: a card, a control, a bar. Nothing else on the page is
 *  rounded (product UI shown inside a card keeps its own). */
export const radius = {
  card: "rounded-[14px]",
  control: "rounded-[8px]",
  bar: "rounded-[4px]",
} as const;

/**
 * A section's head: the title, and under it one or two sentences, a clear
 * step smaller and in grey. Centred from tablet width up, like the hero, so
 * every section opens the same way the page does; on phones it stays on the
 * left edge with the cards under it. No eyebrow, no index: the rule above
 * already says "new section".
 *
 * Keep the title short. The line under it is where the sentence goes.
 *
 * A head is simply there when it scrolls into view. It used to fade and
 * rise into place; that read as a template effect, and was removed.
 */
function Head({ title, lede }: { title: ReactNode; lede?: ReactNode }) {
  return (
    <div className="sm:mx-auto sm:max-w-[820px] sm:text-center">
      <h2 className={type.title}>{title}</h2>
      {lede && (
        <p
          className={cn(
            "mt-3 max-w-[58ch] text-pretty sm:mx-auto sm:mt-4 sm:text-balance",
            type.lede,
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/** The space a head stands in: generous above, so a section starts with
 *  air, and a little less below, so the head belongs to what follows. */
const headSpace = "pb-9 pt-12 sm:pb-14 sm:pt-20";
/** The same with less of it, for a head inside a pinned stage, where every
 *  pixel of height is taken from the content under it. */
const headSpaceTight = "pb-8 pt-12";

export function SectionHead({
  title,
  lede,
}: {
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <div className={cn("px-6 sm:bg-background sm:px-10 lg:px-12", headSpace)}>
      <Head title={title} lede={lede} />
    </div>
  );
}

/* ---- Breaks from the grid ------------------------------------------------
   Most of the page is hairlines and shared walls. A break is a section
   where the rails stop: the ground fades from white into a muted tone,
   and what stands on it are white cards with a radius and a shadow,
   objects rather than cells. It marks a change of subject. Use it
   sparingly; a page of breaks has no grid to break from. */

/** The ground of a break: a step more muted than the well, so a white card
 *  reads against it. */
export const ground = "hsl(228 33% 96.4%)";

/** A white card on the ground of a break. */
export const card = cn(
  radius.card,
  "border border-[var(--rule)] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_44px_-20px_rgba(28,35,80,0.2)]",
);

/**
 * A full-bleed section without rails. The ground fades in from white at the
 * top. At the bottom it fades back to white, or, with `into="well"`, settles
 * into the well colour when the bands that follow are muted ones.
 *
 * A section that tints its own ground (the surfaces row does, while its
 * cards move) passes it as `tint`: the section is then white, and the tint
 * is drawn behind its content.
 */
export function Break({
  children,
  into = "background",
  tint,
  id,
}: {
  children: ReactNode;
  into?: "background" | "well";
  tint?: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative isolate border-b border-[var(--rule)] bg-background"
      style={
        tint
          ? undefined
          : {
              background: `linear-gradient(to bottom, var(--background) 0, ${ground} 11rem, ${ground} calc(100% - 10rem), var(--${into}) calc(100% - 1rem))`,
            }
      }
    >
      {tint}
      {/* The marks where the rails of the band above come to an end. */}
      <div aria-hidden className={cn(frame, "h-0 border-transparent")}>
        <Cross className="-left-[6px] -top-[6px]" />
        <Cross className="-right-[6px] -top-[6px]" />
      </div>
      {children}
    </section>
  );
}

/** The frame's box with no rails drawn: content in a break stands on the
 *  same left and right edges as content in a band. */
export const breakFrame = cn(frame, "border-transparent px-6 sm:px-10 lg:px-12");

/** A section head inside a break. */
export function BreakHead({
  title,
  lede,
  tight = false,
}: {
  title: ReactNode;
  lede?: ReactNode;
  tight?: boolean;
}) {
  return (
    <div className={cn(breakFrame, tight ? headSpaceTight : headSpace)}>
      <Head title={title} lede={lede} />
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
      <span
        style={s}
        className={cn(arm, "bottom-0 left-0 border-b border-l")}
      />
      <span
        style={s}
        className={cn(arm, "bottom-0 right-0 border-b border-r")}
      />
    </span>
  );
}

const RowAnchor = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>(
  function RowAnchor({ children, className, ...props }, ref) {
    return (
      <a
        ref={ref}
        className={cn(
          "group flex h-14 items-center justify-between border-t border-[var(--rule)] px-6 text-[16px] font-medium text-foreground transition-colors hover:bg-[var(--well)] sm:px-10 lg:px-12",
          className,
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
        >
          &rarr;
        </span>
      </a>
    );
  },
);

/** A link that runs the full width of its cell, as the cell's last row. */
export const RowLink = createLink(RowAnchor);

const btn =
  "inline-flex h-11 items-center justify-center rounded-[8px] border px-5 text-[16px] font-medium transition-[background,border-color] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

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

const ButtonAnchor = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<"a"> & { tone?: "primary" | "secondary" }
>(function ButtonAnchor({ tone = "primary", className, ...props }, ref) {
  return (
    <a ref={ref} className={cn(btn, buttonSkin[tone], className)} {...props} />
  );
});

/** A link styled as a grid button, for pages whose actions aren't the
 *  Start free / Book a demo pair. */
export const ButtonLink = createLink(ButtonAnchor);

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
      <a
        href={appInfo.links.signupUrl}
        rel="nofollow"
        className={cn(
          btn,
          inverse ? buttonSkin.inversePrimary : buttonSkin.primary,
        )}
      >
        Start free
      </a>
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
