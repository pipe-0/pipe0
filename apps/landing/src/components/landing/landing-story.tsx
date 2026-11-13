import { Cell, Cells, type } from "@/components/grid";
import { Image } from "@/components/image";
import { cn } from "@/lib/utils";

/**
 * What pipe0 is, said early: the three levels go-to-market work happens on.
 *
 * Florian's model. Research (what a rep needs before a call or an email),
 * systems (plays that scale one person), infrastructure (what the whole
 * company runs on). Each cell names the level in plain terms, then, under a
 * short rule, how pipe0 covers it. The second line is in ink and the first
 * in grey, so the pair reads as question and answer.
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

const levels: {
  key: string;
  name: string;
  what: string;
  here: string;
  alt: string;
}[] = [
    {
      key: "research",
      name: "Research",
      what: "What a rep needs before a call or an email: who this is, what changed, why now.",
      /* Florian's figure, from his own testing (2026-11-13). */
      here: "Get the answer with AI about 17x faster than with competing systems.",
      alt: "A profile card under a magnifying glass",
    },
    {
      key: "systems",
      name: "Systems",
      what: "Plays that scale one person to work a whole market, like drafting a hundred emails a day.",
      here: "Building blocks for technical and non-technical users to create any GTM play.",
      alt: "A small machine turning out a row of envelopes",
    },
    {
      key: "infrastructure",
      name: "Infrastructure",
      what: "What the whole company runs on: signal engines, CRM enrichment, lead routing.",
      here: "Tables up to 2M records, signals, webhooks, and a stateless API to power production.",
      alt: "A helper in a hard hat beside a pipe that drops coloured balls into a bin",
    },
  ];

export function LandingLevels() {
  return (
    <Cells className="border-t border-[var(--rule)] lg:grid-cols-3">
      {levels.map((level) => (
        // The cards sit on the muted ground at every width. The pictures
        // are multiplied onto it, so their white takes the card's colour.
        <Cell key={level.key} className="flex flex-col bg-[var(--well)]">
          {/* The picture is an accent above the words, with air around
              it. At full cell width three of them in a row were louder
              than the story they illustrate. One picture per cell, and
              nothing happens on hover: a version that swapped a line
              drawing for the picture changed the page's look too much. */}
          <div className="flex justify-center px-6 pt-10 sm:pt-12">
            <Scene
              name={level.key}
              alt={level.alt}
              className="w-[min(62%,236px)]"
            />
          </div>
          {/* Air under the picture before the words start. */}
          <div className="flex flex-1 flex-col px-6 pb-10 pt-11 sm:px-10 sm:pb-12 sm:pt-14 lg:px-12">
            <h3 className={type.heading}>{level.name}</h3>
            <p className={cn("mt-3 max-w-[36ch] text-pretty", type.body)}>
              {level.what}
            </p>
            {/* How pipe0 covers the level, set off by a rule so the two
                lines read as question and answer. */}
            <p
              className={cn(
                "mt-auto max-w-[36ch] text-pretty pt-7",
                type.body,
                "text-foreground",
              )}
            >
              <span className="mb-4 block h-px w-8 bg-[var(--rule-strong)]" />
              {level.here}
            </p>
          </div>
        </Cell>
      ))}
    </Cells>
  );
}
