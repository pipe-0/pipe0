"use client";

import { cn } from "@/lib/utils";
import { LoopVideo } from "@/components/loop-video";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Brackets, dotsStyle } from "@/components/grid";
import Image from "next/image";
import Link from "next/link";
import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
  type RefObject,
} from "react";

/**
 * Interfaces — the same engine, reached four ways.
 *
 * Four pages in a folder. Each page is a white panel with a file-folder tab
 * on its top edge; the tabs sit at four different positions, so as the pages
 * stack up on scroll every tab stays visible and the row of them reads as
 * the folder's index. A page sticks just under the header while the next
 * one scrolls up over it. Done with sticky positioning, not scroll
 * hijacking: momentum, keyboard paging and reduced motion all keep working.
 *
 * Nothing here is new to the site — the page is the standard panel, the tab
 * is the panel's border and background lifted onto its top edge, and the
 * heading is the two-tone pair every section uses.
 */

type Surface = {
  key: string;
  tab: string;
  title: string;
  copy: string;
  href: string;
  linkLabel: string;
  /** One small example under the copy; omitted where the copy is enough. */
  pane?: ReactNode;
  /** Isometric line drawing, rendered in Blender (assets/illustrations). */
  illustration: string;
  /** The same drawing as a Blender loop (lineart.py, .mp4 output). */
  loop: string;
};

const surfaces: Surface[] = [
  {
    key: "agent",
    tab: "Sheets",
    title: "A sheet that keeps running",
    copy: "Sheets are a remote workspace for your lists, with schedules, signals, and webhooks built in. Ask in plain language and the agent sets it up; every column stays yours to adjust.",
    href: "/docs/sheets/ai-agents",
    linkLabel: "Agents in Sheets",
    illustration: "/media/website/illustrations/sheets.png",
    loop: "/media/website/illustrations/sheets.mp4",
  },
  {
    key: "mcp",
    tab: "MCP",
    title: "Claude, Codex, and Cursor",
    copy: "Connect the MCP server and your agent gets every search and pipe as a tool, with data back in the same call. When a list gets big, it writes it to a sheet your team can open.",
    href: "/docs/sdks/mcp",
    linkLabel: "MCP server",
    pane: <McpPane />,
    illustration: "/media/website/illustrations/mcp.png",
    loop: "/media/website/illustrations/mcp.mp4",
  },
  {
    key: "slack",
    tab: "Slack",
    title: "Ask from Slack",
    copy: "Mention @pipe0 in a channel. It researches the account, finds contact data, and answers in the thread, with a link to continue in pipe0.",
    href: "/docs/sdks/integrations/slack-agent",
    linkLabel: "Slack agent",
    pane: <SlackPane />,
    illustration: "/media/website/illustrations/slack-chat.png",
    loop: "/media/website/illustrations/slack.mp4",
  },
  {
    key: "api",
    tab: "API",
    title: "Build it into your product",
    copy: "Typed REST endpoints and a TypeScript SDK for every search and pipe. Ship enrichment behind your own UI, billed per result found.",
    href: "/enrichment-api",
    linkLabel: "Enrichment API",
    illustration: "/media/website/illustrations/api.png",
    loop: "/media/website/illustrations/api.mp4",
  },
];

/* Tab geometry. The tabs stand above the page, so the page rests that much
   further below the header (h-16) than a plain sticky panel would. */
const TAB_H = 44;
const STICK_TOP = 64 + 20 + TAB_H;

export function LandingSpotlight() {
  /* One ref per page: a page's tab dims as the *next* page covers it. */
  const refs = useMemo(
    () => surfaces.map(() => createRef<HTMLDivElement>()),
    [],
  );

  return (
    <div>

      {/* The first tab stands TAB_H above the first page, inside this margin,
          so the tab height is added back to keep the usual gap under the
          heading.

          Equal-height rows (1fr, sized to the tallest page) so every page is
          as tall as the tallest: a shorter page parked over a taller one
          would otherwise leave the taller one's bottom showing beneath it.
          The last row is the dwell for the final page. */}
      {/* Phones: no folder. The stacking pages and offset tabs need a wide
          screen to read; here each surface is a plain card in sequence. */}
      <div className="space-y-4 px-4 pb-6 sm:hidden">
        {surfaces.map((s) => (
          <article
            key={s.key}
            className="overflow-hidden rounded-[14px] border border-[var(--rule)] bg-background"
          >
            <div
              style={dotsStyle}
              className="relative flex aspect-[16/10] items-center justify-center border-b border-[var(--rule)]"
            >
              <Brackets />
              <LoopVideo
                src={s.loop}
                poster={s.illustration}
                className="w-[72%]"
              />
            </div>
            {/* Fixed-height copy block so every card is the same height;
                the link sits at its foot. No examples on phones — calmer. */}
            <div className="flex h-[264px] flex-col px-6 pb-6 pt-6">
              <p className="text-[13px] text-muted-foreground">{s.tab}</p>
              <h3 className="mt-1.5 text-[21px] font-medium leading-tight tracking-[-0.03em] text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {s.copy}
              </p>
              <Link
                href={s.href}
                className="mt-auto inline-block text-[15px] font-medium text-primary underline decoration-primary/30 underline-offset-4"
              >
                {s.linkLabel} <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div
        className="relative mt-[44px] grid gap-y-14 max-sm:hidden"
        style={{
          gridTemplateRows: `repeat(${surfaces.length}, 1fr) 35svh`,
        }}
      >
        {surfaces.map((s, i) => (
          <Page
            key={s.key}
            index={i}
            surface={s}
            ref={refs[i]}
            nextRef={refs[i + 1] ?? null}
          />
        ))}
        {/* The pages stay parked until this wrapper's bottom edge reaches
            them, so the folder moves on exactly when the wrapper ends. This
            spacer pushes that end down: the last page reaches its place and
            rests for this much scroll before everything continues. */}
        <div aria-hidden />
      </div>
    </div>
  );
}

function Page({
  index,
  surface,
  ref,
  nextRef,
}: {
  index: number;
  surface: Surface;
  ref: RefObject<HTMLDivElement | null>;
  nextRef: RefObject<HTMLDivElement | null> | null;
}) {
  const reduced = useReducedMotion();

  /* How much of this page the next one has covered, 0..1, measured from the
     two boxes rather than derived from scroll position: the cover only
     starts once this page has stuck, and where that happens depends on the
     viewport and every page above. Measuring is exact and needs no maths. */
  const covered = useMotionValue(0);
  const measure = useCallback(() => {
    const me = ref.current;
    const next = nextRef?.current;
    if (!me || !next) return;
    const a = me.getBoundingClientRect();
    const b = next.getBoundingClientRect();
    covered.set(Math.min(1, Math.max(0, (a.bottom - b.top) / a.height)));
  }, [ref, nextRef, covered]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", measure);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* A covered page's tab drops to the panel grey, so the one open page reads
     as the front of the folder. The pages themselves stay put: any scale on
     a covered page would carry its tab with it and break the tab row. */
  const tabShade = useTransform(covered, [0, 0.6], [0, 1]);

  return (
    <div ref={ref} className="sticky" style={{ top: STICK_TOP }}>
      <article
        className={cn(
          /* Top and bottom only: the page runs rail to rail and shares the
             frame's own side borders rather than drawing a second pair
             inside them. */
          "relative h-full border-y border-[var(--rule)] bg-background",
        )}
      >
        {/* The folder tab. Its bottom edge reaches one pixel into the page,
            so the page's top border disappears under it and the two read as
            one shape. Slot 0 is flush with the page's left edge (the -1px
            puts its border on top of the page's), and that page squares its
            top-left corner so the tab's side runs straight into the page. */}
        <div
          className="absolute flex items-center gap-3 border border-b-0 border-[var(--rule)] bg-background px-4 text-[13px] font-medium text-foreground sm:px-6 sm:text-[14px] lg:px-12"
          style={{
            height: TAB_H,
            bottom: "calc(100% - 1px)",
            left: `calc(${index} * 100% / ${surfaces.length} - 1px)`,
            /* The last tab runs flush to the page's right edge (covering
               its border), so the tab row spans the full width. */
            width:
              index === surfaces.length - 1
                ? `calc(100% / ${surfaces.length} + 1px)`
                : `calc(100% / ${surfaces.length} - 8px)`,
          }}
        >
          <span className="relative z-10 truncate">{surface.tab}</span>
          <motion.span
            aria-hidden
            style={{ opacity: reduced ? 0 : tabShade }}
            className="absolute inset-0 bg-[var(--well)]"
          />
        </div>

        {/* minmax(0, …) everywhere: the code previews have an intrinsic width
            that would otherwise push the column past the page's edge. */}
        {/* Stacked below `lg`, the preview row takes whatever height the copy
            leaves. Every page is already as tall as the tallest one (the
            1fr rows above), so this is what makes the blue tile the same
            size on every page instead of hugging its own preview — a short
            code block and a tall Slack thread would otherwise give tiles of
            two different heights, with the leftover page showing beneath
            the short one. Side by side at `lg` the single row stretches and
            the rule is moot. */}
        <div className="grid h-full grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:min-h-[min(72svh,660px)] lg:px-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-none lg:gap-12">
          {/* Copy column — title, one paragraph and the link at the top;
              one small example of what using the surface looks like, set
              at the foot of the column. */}
          <div className="flex flex-col">
            <h3 className="text-balance text-[clamp(20px,1.6vw,22px)] font-medium leading-[1.12] tracking-[-0.03em] text-foreground">
              {surface.title}
            </h3>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
              {surface.copy}
            </p>
            <div className={surface.pane ? "mt-6" : "mt-6 lg:mt-auto"}>
              <Link
                href={surface.href}
                className="text-[14.5px] font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
              >
                {surface.linkLabel} <span aria-hidden>&rarr;</span>
              </Link>
            </div>
            {surface.pane && (
              <div className="mt-10 max-w-[460px] lg:mt-auto">
                {surface.pane}
              </div>
            )}
          </div>

          {/* Illustration column — a dotted well with registration
              brackets, the same stage as every figure on the page. */}
          <div
            style={dotsStyle}
            className="relative flex min-h-[260px] min-w-0 items-center justify-center overflow-hidden border border-[var(--rule)] p-6"
          >
            <Brackets />
            <LoopVideo
              src={surface.loop}
              poster={surface.illustration}
              className="w-[86%] max-w-[600px]"
            />
          </div>
        </div>
      </article>
    </div>
  );
}

/* ---- Previews ---------------------------------------------------------- */

/* Previews are frameless: plain type on the stage, no card, no shadow. */
const card = "w-full";

/* The coding agents the MCP server is used from, as their own marks. */
const agents = [
  { name: "Claude Code", src: "/media/website/logos/agent-claude.svg" },
  { name: "Codex", src: "/media/website/logos/agent-openai.svg" },
  { name: "Cursor", src: "/media/website/logos/agent-cursor.svg" },
];

function McpPane() {
  return (
    <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
      {agents.map((a) => (
        <li
          key={a.name}
          className="flex items-center gap-2.5 text-[15px] font-medium text-foreground"
        >
          <Image src={a.src} alt="" width={22} height={22} className="size-[22px]" />
          {a.name}
        </li>
      ))}
    </ul>
  );
}

/* Slack's own channel-link treatment, so mentions read as live links. */
const slackLink = "rounded-[4px] bg-[#e8f2fb] px-1 font-medium text-[#1264a3]";

/* The four-colour Slack mark (Slack's published brand asset geometry), used
   as the asker's avatar so the scene says "this is Slack" before a word is
   read. */
function SlackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 54" className={className} aria-hidden>
      <path
        fill="#36C5F0"
        d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386"
      />
      <path
        fill="#2EB67D"
        d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387"
      />
      <path
        fill="#ECB22E"
        d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386"
      />
      <path
        fill="#E01E5A"
        d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.249m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.25a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387"
      />
    </svg>
  );
}

const avatar = "grid size-9 shrink-0 place-items-center";

function SlackPane() {
  return (
    <div className="flex gap-3">
      <span className={avatar}>
        <SlackMark className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-[#1d1c1d]">Florian</p>
        <p className="mt-0.5 text-[15px] leading-relaxed text-[#1d1c1d]">
          <span className={slackLink}>@pipe0</span> who in{" "}
          <span className={slackLink}>#customers</span> works in engineering?
        </p>
      </div>
    </div>
  );
}

