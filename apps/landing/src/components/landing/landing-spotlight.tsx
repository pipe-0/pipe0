import { Link } from "@tanstack/react-router";
import { Break, BreakHead, card, ground, type } from "@/components/grid";
import { Scene } from "@/components/landing/landing-story";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
} from "react";

/**
 * Interfaces — the same core, reached four ways.
 *
 * A break from the line grid (`Break` in grid.tsx): four white cards in a
 * row that is wider than the screen. This is where the product is used, not
 * what it is; that was said above, so the cards stay quiet.
 *
 * On a wide screen the row is pinned while the reader scrolls and moves
 * sideways under them, so all four cards pass at reading pace. Done with
 * sticky positioning and one transform, not by taking over the scroll:
 * momentum and keyboard paging keep working. Everywhere else (phones,
 * tablets, short windows, reduced motion, no JavaScript) the same row is an
 * ordinary sideways scroller, which is also what the server renders.
 *
 * A card is a picture, a title, two lines and a link. The title says which
 * surface it is, so there is no label above it.
 */

const surfaces: {
  key: string;
  title: string;
  copy: string;
  href: string;
  linkLabel: string;
  /** The still from the scene set (landing-story.tsx) and what it shows. */
  scene: string;
  alt: string;
}[] = [
  {
    key: "sheets",
    title: "A sheet that keeps running",
    copy: "Your lists in a remote workspace, with schedules, signals, and webhooks built in.",
    href: "/docs/sheets/ai-agents",
    linkLabel: "Agents in Sheets",
    scene: "sheets",
    alt: "An agent placing coloured tiles into a sheet, with an alarm clock beside it",
  },
  {
    key: "mcp",
    title: "Claude, Codex, and Cursor",
    copy: "Every search and pipe becomes a tool for your agent, with data back in the same call.",
    href: "/docs/sdks/mcp",
    linkLabel: "MCP server",
    scene: "mcp",
    alt: "Three agents, each plugged into one hub by its own cable",
  },
  {
    key: "slack",
    title: "Ask from Slack",
    copy: "Mention @pipe0 in a channel. It researches the account and answers in the thread.",
    href: "/docs/sdks/integrations/slack-agent",
    linkLabel: "Slack agent",
    scene: "slack",
    alt: "An agent sitting on a chat bubble that carries an at sign",
  },
  {
    key: "api",
    title: "Build it into your product",
    copy: "Typed REST endpoints and a TypeScript SDK for every search and pipe, billed per result found.",
    href: "/enrichment-api",
    linkLabel: "Enrichment API",
    scene: "api",
    alt: "An agent building a tower of blocks, about to add one marked with curly braces",
  },
];

/* Scroll the row rests for at its two ends before and after it moves, so
   the first and the last card each get a still moment. */
const DWELL = 180;
/* A smooth step from 0 to 1 as `v` goes from `from` to `to`. */
const ramp = (v: number, from: number, to: number) => {
  const t = Math.min(1, Math.max(0, (v - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
const EDGES =
  "linear-gradient(to bottom, transparent 0, #000 12rem, #000 calc(100% - 12rem), transparent 100%)";

/* When the row is pinned: room for the cards, a pointer-sized screen, and a
   reader who has not asked for less motion. */
const PIN_QUERY =
  "(min-width: 64rem) and (min-height: 44rem) and (prefers-reduced-motion: no-preference)";
/* The pinned stage: as tall as the screen under the header, up to a cap, and
   centred in that space on taller screens. */
const STAGE_H = "min(calc(100svh - 4rem), 44rem)";
const STAGE_TOP = "max(4rem, calc(2rem + 50svh - 22rem))";

export function LandingSpotlight() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [pinned, setPinned] = useState(false);
  /* How far the row has to move for its last card to reach the edge. */
  const [travel, setTravel] = useState(0);
  const x = useMotionValue(0);
  /* How much of the muted ground shows: none before the row moves, all of
     it while it moves, none again once it has arrived. */
  const shade = useMotionValue(0);

  useEffect(() => {
    const query = window.matchMedia(PIN_QUERY);
    const apply = () => setPinned(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const s = scroller.current;
    const t = track.current;
    if (!pinned || !s || !t) return;
    // The row may have been scrolled by hand before it was pinned.
    s.scrollLeft = 0;
    const measure = () =>
      setTravel(Math.max(0, t.scrollWidth - s.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(s);
    ro.observe(t);
    return () => ro.disconnect();
  }, [pinned]);

  /* Where the row belongs for the current scroll position: measured from
     the two boxes, so it is right whatever sits above the section. */
  const place = useCallback(() => {
    const w = wrap.current;
    const st = stage.current;
    if (!pinned || !w || !st) {
      x.set(0);
      shade.set(0);
      return;
    }
    const top = parseFloat(getComputedStyle(st).top) || 0;
    const scrolled = top - w.getBoundingClientRect().top;
    x.set(-Math.min(travel, Math.max(0, scrolled - DWELL / 2)));
    /* The page is white when the section arrives and white when it leaves.
       In between, the ground comes up over the first third of the way and
       goes down over the last, slowly enough to be felt rather than seen. */
    const p = Math.min(1, Math.max(0, scrolled / (travel + DWELL)));
    shade.set(ramp(p, 0.03, 0.36) * (1 - ramp(p, 0.64, 0.97)));
  }, [pinned, travel, x, shade]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", place);
  useEffect(() => {
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [place]);

  /* A link reached with the keyboard may sit in a card that is off screen.
     Scroll the page to where that card is in view. */
  const reveal = (e: FocusEvent<HTMLUListElement>) => {
    const w = wrap.current;
    const st = stage.current;
    const card = (e.target as HTMLElement).closest("li");
    const first = track.current?.firstElementChild as HTMLElement | null;
    if (!pinned || !w || !st || !card || !first) return;
    const box = card.getBoundingClientRect();
    if (box.left >= 0 && box.right <= window.innerWidth) return;
    const top = parseFloat(getComputedStyle(st).top) || 0;
    const want = Math.min(travel, card.offsetLeft - first.offsetLeft);
    window.scrollTo({
      top:
        w.getBoundingClientRect().top + window.scrollY - top + DWELL / 2 + want,
    });
  };

  return (
    /* Pinned, the section tints its own ground as the row moves. Anywhere
       else it is an ordinary break, whose ground fades in and out with the
       page as it scrolls by. */
    <Break
      tint={
        pinned ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              opacity: shade,
              background: ground,
              // Soft at both ends as well, so no edge can ever show.
              maskImage: EDGES,
              WebkitMaskImage: EDGES,
            }}
          />
        ) : undefined
      }
    >
      <div
        ref={wrap}
        style={
          pinned
            ? { height: `calc(${STAGE_H} + ${travel + DWELL}px)` }
            : undefined
        }
      >
        <div
          ref={stage}
          className={cn("flex flex-col", pinned && "sticky")}
          style={pinned ? { top: STAGE_TOP, height: STAGE_H } : undefined}
        >
          <BreakHead
            tight={pinned}
            title="Work anywhere."
            lede="In a sheet, from your coding agent, in Slack, or from your own code."
          />

          <div
            ref={scroller}
            className={cn(
              "pb-10 pt-1",
              pinned
                ? "min-h-0 flex-1 overflow-hidden"
                : "overflow-x-auto overscroll-x-contain max-lg:snap-x max-lg:snap-mandatory max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden",
            )}
          >
            {/* The side padding is the frame's left edge plus a cell's
                padding, so the first card starts under the head and the
                last one ends on the frame's right edge. Percentages are of
                the scroller, which excludes a vertical scrollbar. */}
            <motion.ul
              ref={track}
              onFocus={reveal}
              style={{ x }}
              className={cn(
                "flex w-max gap-4 px-6 sm:gap-6 sm:px-[calc(max(1.5rem,(100%-82.5rem)/2)+2.5rem+1px)] lg:px-[calc(max(1.5rem,(100%-82.5rem)/2)+3rem+1px)]",
                pinned && "h-full",
              )}
            >
              {surfaces.map((s) => (
                <li
                  key={s.key}
                  className={cn(
                    card,
                    "flex w-[min(82vw,23rem)] shrink-0 snap-start scroll-ml-6 flex-col overflow-hidden sm:w-[26rem] sm:scroll-ml-16 lg:w-[clamp(27rem,35vw,33rem)]",
                    pinned && "h-full max-h-[30rem]",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center px-8 pt-8",
                      pinned ? "min-h-0 flex-1" : "aspect-[4/3]",
                    )}
                  >
                    {/* Small on purpose: the card is mostly white, and the
                        picture is an accent in it, not its subject. */}
                    <Scene
                      name={s.scene}
                      alt={s.alt}
                      className={
                        pinned
                          ? "max-h-[min(100%,12.5rem)] min-h-0 w-auto max-w-full object-contain"
                          : "w-[58%]"
                      }
                    />
                  </div>
                  <div className="px-7 pb-8 pt-5 sm:px-9 sm:pb-9">
                    <h3 className={type.heading}>{s.title}</h3>
                    {/* Room for three lines on every card, so the titles
                        of neighbouring cards stand on one line. */}
                    <p
                      className={cn(
                        "mt-2.5 min-h-[4.875rem] max-w-[40ch]",
                        type.body,
                      )}
                    >
                      {s.copy}
                    </p>
                    <Link
                      to={s.href}
                      className="mt-5 inline-block text-[16px] font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                    >
                      {s.linkLabel} <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>

      {/* Room for the ground to fade back to white under the cards. */}
      <div aria-hidden className="h-12 sm:h-24" />
    </Break>
  );
}
