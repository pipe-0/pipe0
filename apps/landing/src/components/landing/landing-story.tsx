import { Cells, type } from "@/components/grid";
import { Image } from "@/components/image";
import { cn } from "@/lib/utils";

/**
 * What pipe0 is, said early: the three levels go-to-market work happens on.
 *
 * Florian's model. Research (what a rep needs before a call or an email),
 * systems (plays that scale one person), infrastructure (what the whole
 * company runs on).
 *
 * The section is a small sheet: three columns, two rows. The upper row is
 * the work (a picture, the level's name, what it is, in grey). The lower
 * row is pipe0's: what it does about each level, led by the claim. The
 * whole row is in the glossy indigo of pipe0's bars in the charts
 * (`barSkin.win`: the lit face, the darker rim, the highlight along the
 * top), with the words in white, and a tab at its corner in the same
 * material carries pipe0's mark. Indigo means pipe0 on this page, so the
 * row says whose it is before anything is read.
 *
 * Three versions came before it: a 2px primary outline around a pale row
 * (too loud), a thin pale outline (too weak), and a pale row with only the
 * tab in indigo (the tab looked stranded).
 *
 * The lines are sentences on purpose. A version with one large figure per
 * cell ("~17x", "1 prompt", "2M") was tried and dropped: the figures took
 * the attention from the sentences, and the sentences are what explain the
 * product.
 *
 * Pictures are stills on purpose. A reader is reading here, and anything
 * that moves beside the words competes with them. Each is one simple
 * object in solid glossy colour: indigo, yellow, coral and white (fal.ai,
 * assets/illustrations/scenes_fal.md), rendered on white and multiplied
 * onto the page. All three point the same way, down to the right, so the
 * row reads as a set.
 */

const media = "/media/website/illustrations";

/** A still from the scene set: lazy, and with no box around it. */
export function Scene({
  name,
  alt,
  className,
  width = 1000,
  height = 750,
}: {
  name: string;
  alt: string;
  className?: string;
  /** The still's own size; all but the tall one are 1000 by 750. */
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={`${media}/scene-${name}.webp`}
      alt={alt}
      width={width}
      height={height}
      sizes="(min-width: 1024px) 420px, 80vw"
      className={cn("h-auto mix-blend-multiply", className)}
    />
  );
}

/* Where the object is in each 1000 by 750 still (the solid part, without
   its floor shadow), measured from the files: left edge, bottom edge. The
   pictures are set by these, not by their frames, so the three objects
   start on the words' left edge and stand on one floor. `scale` evens out
   their weight: the profile card lies flat, so it is drawn a little larger
   than the two that stand. */
const levels: {
  key: string;
  name: string;
  what: string;
  /** What pipe0 makes possible on this level: Florian's words (2026-11-17). */
  claim: string;
  here: string;
  alt: string;
  still: { left: number; bottom: number; scale: number };
}[] = [
  {
    key: "research",
    name: "Research",
    what: "What a rep needs before a call or an email: who this is, what changed, why now.",
    claim: "Answer any research question.",
    /* Florian's figure, from his own testing (2026-11-13). */
    here: "Get the answer with AI about 17x faster than with competing systems.",
    alt: "A profile card under a magnifying glass",
    /* The card is white on white: its left corner is at 64, far left
       of the first coloured pixel. */
    still: { left: 64, bottom: 628, scale: 0.27 },
  },
  {
    key: "systems",
    name: "Systems",
    what: "Plays that scale one person to work a whole market, like drafting a hundred emails a day.",
    claim: "Build any system.",
    /* A non-breaking hyphen: "non-" must not end a line. */
    here: "Building blocks for technical and non\u2011technical users to create any GTM play.",
    alt: "A small machine turning out a row of envelopes",
    still: { left: 171, bottom: 698, scale: 0.26 },
  },
  {
    key: "infrastructure",
    name: "Infrastructure",
    what: "What the whole company runs on: signal engines, CRM enrichment, lead routing.",
    claim: "Run your most involved infrastructure.",
    here: "Tables up to 2M records, signals, webhooks, and a stateless API to power production.",
    alt: "A helper in a hard hat beside a pipe that drops coloured balls into a bin",
    still: { left: 177, bottom: 696, scale: 0.26 },
  },
];

/* Explicit columns from lg, so the two cells of a level sit one above the
   other while the DOM keeps them together (a phone shows them as one card). */
const column = ["lg:col-start-1", "lg:col-start-2", "lg:col-start-3"];

/* pipe0's row, in the material of pipe0's bars (`barSkin.win` in grid.tsx,
   as classes so they can change with the screen): the face lit from above,
   a darker rim, a highlight along the top edge. */
const glossy =
  "border border-[#2c37b0] bg-[linear-gradient(180deg,#5f6ae8_0%,#3b49e0_60%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-1px_0_rgba(0,0,0,0.12),0_1px_2px_rgba(14,17,23,0.18)]";

const cellPad = "px-6 sm:px-10 lg:px-12";

/** Whose row it is: pipe0's mark on a tab that grows out of the row's top
 *  left corner. Its face ends on the colour the row's face starts with,
 *  and its foot covers the row's rim and highlight, so tab and row are one
 *  piece. */
function Tab({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute -left-px bottom-full -mb-[2px] flex h-[42px] w-11 items-center justify-center rounded-t-[9px] border border-b-0 border-[#2c37b0] bg-[linear-gradient(180deg,#6e79ee_0%,#5f6ae8_100%)] pb-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.34)]",
        className,
      )}
    >
      <img
        src="/logo-small-dark.svg"
        alt=""
        width={50}
        height={50}
        className="h-[26px] w-auto"
      />
    </span>
  );
}

export function LandingLevels() {
  return (
    <Cells className="border-t border-[var(--rule)] lg:grid-cols-3">
      {levels.map((level, i) => (
        // One card on a phone; from sm its two cells join the grid.
        <div key={level.key} className="sm:contents">
          {/* ---- The work ---- */}
          <div
            className={cn(
              "min-w-0 bg-background pb-14 pt-10 max-sm:rounded-t-[14px] max-sm:border max-sm:border-b-0 max-sm:border-[var(--rule)] sm:pb-12 sm:pt-12 lg:row-start-1",
              cellPad,
              column[i],
            )}
          >
            {/* The stage: every object starts on the left edge of the
                words and stands on its floor. Shadows fall below it. */}
            <div className="relative h-[176px]">
              <Image
                src={`${media}/scene-${level.key}.webp`}
                alt={level.alt}
                width={1000}
                height={750}
                sizes="300px"
                className="absolute h-auto max-w-none mix-blend-multiply"
                style={{
                  width: 1000 * level.still.scale,
                  left: -level.still.left * level.still.scale,
                  bottom: -(750 - level.still.bottom) * level.still.scale,
                }}
              />
            </div>
            <h3 className={cn("mt-11", type.heading)}>{level.name}</h3>
            <p className={cn("mt-3 max-w-[36ch] text-pretty", type.body)}>
              {level.what}
            </p>
          </div>
          {/* ---- What pipe0 does about it ---- */}
          {/* Each cell lies one pixel over the walls around it, so the
              rim replaces them, and neighbours share one rim: from lg the
              three read as one bar in three parts. */}
          <div
            className={cn(
              "relative z-10 min-w-0 py-8 max-sm:rounded-b-[14px] sm:-m-px sm:py-9 lg:row-start-2",
              glossy,
              cellPad,
              column[i],
            )}
          >
            {/* One tab for the row. Below lg the levels are stacked, so
                each answer carries its own. */}
            <Tab className={i > 0 ? "lg:hidden" : undefined} />
            <p className={cn(type.subheading, "text-white")}>{level.claim}</p>
            <p
              className={cn(
                "mt-2 max-w-[36ch] text-pretty",
                type.body,
                "text-white/85",
              )}
            >
              {level.here}
            </p>
          </div>
        </div>
      ))}
    </Cells>
  );
}
