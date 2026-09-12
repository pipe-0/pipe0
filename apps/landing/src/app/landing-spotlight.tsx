"use client";

import { SectionHeading } from "@/components/marketing";
import { PlaceholderAvatar } from "@/components/placeholder-avatar";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
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
  subtitle: string;
  copy: string;
  href: string;
  linkLabel: string;
  pane: ReactNode;
};

const surfaces: Surface[] = [
  {
    key: "agent",
    tab: "UI Agent",
    title: "Ask in the sheet.",
    subtitle: "The agent builds the columns.",
    copy: "Describe the outcome. The agent picks the searches and pipes, builds the columns, and runs them.",
    href: "/docs/sheets/ai-agents",
    linkLabel: "Agents in Sheets",
    pane: <AgentPane />,
  },
  {
    key: "mcp",
    tab: "MCP",
    title: "Your own agents.",
    subtitle: "Claude Code, Cursor, ChatGPT.",
    copy: "The same engine over MCP, with no glue code in between. Your agent gets every search and pipe as a tool.",
    href: "/docs/sdks/mcp",
    linkLabel: "MCP server",
    pane: <McpPane />,
  },
  {
    key: "slack",
    tab: "Slack",
    title: "Bot command.",
    subtitle: "Where the team already works.",
    copy: "@pipe0 researches an account, finds contact data, and reports back in the channel that asked.",
    href: "/docs/sdks/slack-agent",
    linkLabel: "Slack agent",
    pane: <SlackPane />,
  },
  {
    key: "api",
    tab: "API",
    title: "Send your requests.",
    subtitle: "Enrichment inside your product.",
    copy: "Compose providers, actions and conditions into pipes, then ship enrichment behind your own UI.",
    href: "/enrichment-api",
    linkLabel: "Enrichment API",
    pane: <ApiPane />,
  },
];

/* Tab geometry. The tabs stand above the page, so the page rests that much
   further below the header (h-16) than a plain sticky panel would. */
const TAB_H = 36;
const STICK_TOP = 64 + 20 + TAB_H;

export function LandingSpotlight() {
  /* One ref per page: a page's tab dims as the *next* page covers it. */
  const refs = useMemo(
    () => surfaces.map(() => createRef<HTMLDivElement>()),
    [],
  );

  return (
    <div>
      <SectionHeading
        title="One engine. Every interface."
        subtitle="The same primitives for technical and non-technical users."
      />

      <div className="relative mt-10 sm:mt-12">
        {surfaces.map((s, i) => (
          <Page
            key={s.key}
            index={i}
            surface={s}
            ref={refs[i]}
            nextRef={refs[i + 1] ?? null}
          />
        ))}
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
    <div ref={ref} className="sticky pb-14" style={{ top: STICK_TOP }}>
      <article
        className="relative rounded-[18px] border border-[var(--panel-edge)] bg-background shadow-[0_1px_2px_rgba(14,17,23,0.04),0_18px_44px_rgba(28,35,80,0.08)]"
      >
        {/* The folder tab. One pixel into the page so the page's top border
            disappears under it and the two read as a single shape. Four
            slots across the width, past the rounded corner on the left. */}
        <div
          className="absolute flex items-center rounded-t-[10px] border border-b-0 border-[var(--panel-edge)] bg-background px-2.5 text-[12px] font-medium text-foreground sm:px-4 sm:text-[13px]"
          style={{
            height: TAB_H,
            bottom: "calc(100% - 1px)",
            left: `calc(18px + ${index} * (100% - 36px) / ${surfaces.length})`,
            width: `calc((100% - 36px) / ${surfaces.length} - 6px)`,
          }}
        >
          <span className="relative z-10 truncate">{surface.tab}</span>
          <motion.span
            aria-hidden
            style={{ opacity: reduced ? 0 : tabShade }}
            className="absolute inset-0 rounded-t-[9px] bg-[var(--panel)]"
          />
        </div>

        {/* minmax(0, …) everywhere: the code previews have an intrinsic width
            that would otherwise push the column past the page's edge. */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 p-6 sm:p-10 lg:min-h-[min(72svh,660px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
          {/* Copy column — the section heading pair, one size down. */}
          <div className="flex flex-col">
            <div className="text-[clamp(22px,2.45vw,31px)] font-medium leading-[1.36] tracking-[-0.018em]">
              <h3 className="text-foreground">{surface.title}</h3>
              <p className="text-muted-foreground">{surface.subtitle}</p>
            </div>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
              {surface.copy}
            </p>
            <div className="mt-8 lg:mt-auto lg:pt-10">
              <Link
                href={surface.href}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {surface.linkLabel} <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Preview column — the pane on the same muted inset the section
              always used for its previews. */}
          <div className="flex min-w-0 items-center rounded-[14px] border border-[var(--panel-edge)] bg-[var(--panel)] p-4 sm:p-8 [&>*]:min-w-0">
            {surface.pane}
          </div>
        </div>
      </article>
    </div>
  );
}

/* ---- Previews ---------------------------------------------------------- */

/* Full width of the panel — the preview is the point of the section, not a
   thumbnail floating in it. */
const card =
  "w-full rounded-[12px] border border-[#1c2333]/10 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.05),0_14px_36px_rgba(28,35,80,0.10)]";

function AgentPane() {
  return (
    <div className={card}>
      <div className="p0-composer m-4 rounded-[12px] px-4 py-3.5">
        <p className="text-[15px] text-[#1c2333]">
          Find the VP of Sales at every company in this sheet and verify their
          work email.
        </p>
      </div>
      <div className="space-y-2 px-5 pb-5 text-[13.5px] text-[#5b6478]">
        {[
          "Added column · VP of Sales",
          "Added column · Work email (waterfall)",
          "Enriching 1,204 rows…",
        ].map((step, i) => (
          <p key={step} className="flex items-center gap-2.5">
            <span
              className={cn(
                "size-1.5 rounded-full",
                i === 2 ? "bg-primary" : "bg-emerald-500",
              )}
            />
            {step}
          </p>
        ))}
      </div>
    </div>
  );
}

function McpPane() {
  return (
    <div className={cn(card, "overflow-hidden")}>
      <div className="flex items-center gap-2 border-b border-[#1c2333]/8 bg-[#f7f9fc] px-4 py-2.5 text-[11px] font-medium text-[#5b6478]">
        Claude Code · pipe0 MCP
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[11px] leading-relaxed text-[#2b3350] sm:text-[13px]">
        <code>
          <span className="text-[#5b6478]">&gt;</span> find 100 CTOs in Berlin
          {"\n\n"}
          <span className="text-[#2c37a4]">run_search_oneshot</span>(
          <span className="text-emerald-700">&quot;people:profiles&quot;</span>){"\n"}
          <span className="text-[#2c37a4]">run_pipes_oneshot</span>(
          <span className="text-emerald-700">&quot;person:workemail&quot;</span>)
          {"\n\n"}
          <span className="text-emerald-700">✓ 100 records · 94 emails</span>
        </code>
      </pre>
    </div>
  );
}

function SlackPane() {
  return (
    <div className={cn(card, "p-5")}>
      <div className="flex gap-3">
        <PlaceholderAvatar size={32} radius={7} />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#1d1c1d]">Florian</p>
          <p className="mt-0.5 text-[14.5px] leading-relaxed text-[#1d1c1d]">
            <span className="rounded bg-[#e8f2fb] px-1 font-medium text-[#1264a3]">
              @pipe0
            </span>{" "}
            who from #customers works in engineering? Get their work emails.
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-[7px] border border-[#1c2333]/10 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-small-light.svg" alt="" className="h-3 w-auto" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1d1c1d]">
            pipe0
            <span className="rounded-[3px] bg-[#f2f1ee] px-1 py-px text-[9px] font-bold tracking-wide text-[#616061]">
              APP
            </span>
          </p>
          <p className="mt-0.5 text-[14.5px] leading-relaxed text-[#1d1c1d]">
            Found <span className="font-semibold">12 people</span> in #customers
            with engineering titles — 11 work emails verified.
          </p>
          <p className="mt-2 text-[12.5px] font-medium text-[#1264a3]">
            Continue in pipe0: #customers · engineering
          </p>
        </div>
      </div>
    </div>
  );
}

function ApiPane() {
  return (
    <div className={cn(card, "overflow-hidden")}>
      <div className="flex items-center gap-2 border-b border-[#1c2333]/8 bg-[#f7f9fc] px-4 py-2.5 text-[11px] font-medium text-[#5b6478]">
        enrich.ts
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[11px] leading-relaxed text-[#2b3350] sm:text-[13px]">
        <code>
          <span className="text-[#2c37a4]">const</span> res ={" "}
          <span className="text-[#2c37a4]">await</span> pipe0.pipes.run({"{"}
          {"\n"}  pipes: [{"\n"}    {"{"} pipe_id:{" "}
          <span className="text-emerald-700">
            &quot;person:workemail:waterfall@1&quot;
          </span>{" "}
          {"}"},{"\n"}    {"{"} pipe_id:{" "}
          <span className="text-emerald-700">&quot;company:overview@3&quot;</span>{" "}
          {"}"},{"\n"}  ],{"\n"}  input: rows,{"\n"}
          {"}"});
        </code>
      </pre>
    </div>
  );
}
