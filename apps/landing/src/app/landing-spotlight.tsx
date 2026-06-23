"use client";

import { InViewVideo } from "@/components/in-view-video";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Surface = {
  key: string;
  title: string;
  copy: string;
};

/* One copy source, shared by the mobile and desktop layouts. */
const spotlightHeading = "Three-in-one.";
const spotlightIntro =
  "The same enrichment core, wherever you work: your codebase, a sheet, or inside your agents.";

const surfaces: Surface[] = [
  {
    key: "api",
    title: "Built for your codebase.",
    copy: "A full enrichment and prospecting API. Compose 50+ providers, actions, and conditions into pipes, then ship Clay-like enrichment inside your own product.",
  },
  {
    key: "sheets",
    title: "Tables that hold 2M records.",
    copy: "Graphical enrichment tables, multiplayer by default, with point-in-time restoration when things go sideways. All the depth of the API, none of the code.",
  },
  {
    key: "mcp",
    title: "An MCP server, ready to go.",
    copy: "Plug pipe0 into Codex, Claude Code, Cursor, and friends. Your agents get the same enrichment engine you do, with no glue code in between.",
  },
];

const CYCLE_MS = 7000;

export function LandingSpotlight() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(
      () => setActive((a) => (a + 1) % surfaces.length),
      CYCLE_MS,
    );
    return () => clearTimeout(t);
  }, [active, reduced]);

  const panes = [
    <CodebasePane key="api" />,
    <SheetsPane key="sheets" />,
    <McpPane key="mcp" active reduced={reduced} />,
  ];

  return (
    <div style={{ ["--spot-speed" as string]: `${CYCLE_MS}ms` }}>
      {/* ===== Mobile / tablet — stacked cards, copy next to its visual ===== */}
      <div className="flex flex-col gap-10 lg:hidden">
        <div className="max-w-180">
          <h2 className="text-[clamp(28px,3vw,38px)] font-semibold leading-tight tracking-[-0.02em] text-foreground">
            {spotlightHeading}
          </h2>
          <p className="mt-3.5 max-w-135 text-base text-muted-foreground">
            {spotlightIntro}
          </p>
        </div>
        {surfaces.map((s, i) => (
          /* Each surface is a self-contained box — the stacked single-column
             layout runs all the way to lg, so without the border/wash the next
             visual reads as belonging to the copy above it. */
          <div
            key={s.key}
            className="min-w-0 rounded-[20px] border border-border bg-card/40 p-2.5"
          >
            <div className="stage-glossy relative mb-4 h-75 min-w-0 overflow-hidden rounded-2xl border sm:h-90">
              {panes[i]}
            </div>
            <h3 className="px-1.5 font-display text-[18px] font-semibold leading-snug tracking-tight text-foreground">
              {s.title}
            </h3>
            <p className="mt-1.5 px-1.5 pb-1 text-[14.5px] leading-relaxed text-muted-foreground">
              {s.copy}
            </p>
          </div>
        ))}
      </div>

      {/* ===== Desktop — accordion + shared stage ===== */}
      <div className="hidden gap-9 lg:grid lg:grid-cols-[minmax(320px,5fr)_7fr] lg:items-stretch">
        {/* Left column — heading on top, tabs fill the remaining height */}
        <div className="flex flex-col">
          <div className="max-w-180">
            <h2 className="text-[clamp(28px,3vw,38px)] font-semibold leading-tight tracking-[-0.02em] text-foreground">
              {spotlightHeading}
            </h2>
            <p className="mt-3.5 max-w-135 text-base text-muted-foreground">
              {spotlightIntro}
            </p>
          </div>

          {/* Headlines — hairline-separated, active one full-ink with a rail */}
          <div
            className="mt-10 flex flex-1 flex-col justify-center"
            role="tablist"
            aria-label="Platform surfaces"
          >
            {surfaces.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative grid gap-1.5 border-t border-border px-6 py-4.5 text-left transition-opacity duration-500 first:border-t-0",
                    isActive
                      ? "cursor-default opacity-100"
                      : "cursor-pointer opacity-45 hover:opacity-75",
                  )}
                >
                  <span
                    className={cn(
                      "spot-rail absolute top-4.5 bottom-4.5 left-0 w-0.5 rounded-sm bg-foreground/10 transition-opacity duration-300",
                      isActive ? "is-active opacity-100" : "opacity-0",
                    )}
                  >
                    {isActive && !reduced && <i key={i} />}
                  </span>
                  <span className="font-display text-[19px] font-semibold leading-snug tracking-tight text-foreground">
                    {s.title}
                  </span>
                  <span className="text-[14.5px] leading-relaxed text-muted-foreground">
                    {s.copy}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage — glossy framed pane (same material as the hero), spans the
            full column height including the heading. Panes crossfade. */}
        <div className="stage-glossy relative min-h-90 overflow-hidden rounded-[18px] border lg:min-h-140">
          <StagePane active={active === 0}>
            <CodebasePane />
          </StagePane>
          <StagePane active={active === 1}>
            <SheetsPane />
          </StagePane>
          <StagePane active={active === 2}>
            <McpPane active={active === 2} reduced={reduced} />
          </StagePane>
        </div>
      </div>
    </div>
  );
}

function StagePane({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 rounded-[18px] transition-[opacity,transform] duration-1000 ease-out",
        active
          ? "opacity-100 translate-y-0 scale-100"
          : "pointer-events-none translate-y-2 scale-[0.992] opacity-0",
      )}
    >
      {children}
    </div>
  );
}

/* ---- Stage visuals (self-contained, no async) ---- */

function CodebasePane() {
  return (
    <div className="relative flex h-full flex-col bg-[linear-gradient(180deg,var(--deep-2)_0%,var(--deep)_72%)] p-5 sm:p-7">
      {/* bottom darkening, like the hero's foot */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/35 to-transparent"
        aria-hidden
      />
      <div className="flex items-center gap-1.5 pb-4">
        <span className="size-2.5 rounded-full bg-white/25" />
        <span className="size-2.5 rounded-full bg-white/25" />
        <span className="size-2.5 rounded-full bg-white/25" />
        <span className="ml-2 font-mono text-[11px] text-white/45">
          enrich.ts
        </span>
      </div>
      <pre className="overflow-hidden font-mono text-[12px] leading-relaxed text-white/80 sm:text-[13px]">
        <code>
          <span className="text-indigo-300">const</span> res ={" "}
          <span className="text-indigo-300">await</span> pipe0.pipes.
          <span className="text-sky-300">run</span>({"{"}
          {"\n"}  pipes: [{"\n"}    {"{"} pipe_id:{" "}
          <span className="text-emerald-300">
            &quot;people:workemail@1&quot;
          </span>{" "}
          {"}"},{"\n"}    {"{"} pipe_id:{" "}
          <span className="text-emerald-300">
            &quot;company:description@1&quot;
          </span>{" "}
          {"}"},{"\n"}  ],{"\n"}  input: [{"{"} name:{" "}
          <span className="text-emerald-300">&quot;John Doe&quot;</span>,
          company:{" "}
          <span className="text-emerald-300">&quot;Pipe0&quot;</span> {"}"}],
          {"\n"}
          {"}"});
        </code>
      </pre>
      <span className="relative mt-auto pt-6 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-white/45">
        API · compose 50+ providers
      </span>
    </div>
  );
}

const sheetChips = [
  "2M records per table",
  "Multi-player",
  "Point-in-time restoration",
  "API access",
];

function SheetsPane() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5 bg-[linear-gradient(180deg,#e3edfd_0%,#bfd5f8_100%)] px-5 py-6 sm:px-8">
      {/* App window — the demo plays at fixed proportions inside a frame */}
      <div className="w-full max-w-150 overflow-hidden rounded-[12px] border border-[#1c2333]/12 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.06),0_16px_40px_rgba(28,35,80,0.18)]">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-[#1c2333]/8 bg-[#f7f9fc] px-3.5 py-2.5">
          <span className="size-2.5 rounded-full bg-[#1c2333]/15" />
          <span className="size-2.5 rounded-full bg-[#1c2333]/15" />
          <span className="size-2.5 rounded-full bg-[#1c2333]/15" />
          <span className="ml-2 text-[11px] font-medium text-[#5b6478]">
            pipe0 · Sheets
          </span>
          <span className="ml-auto flex items-center gap-2">
            <span className="flex -space-x-1.5">
              <span className="size-4.5 rounded-full border-2 border-white bg-primary/80" />
              <span className="size-4.5 rounded-full border-2 border-white bg-emerald-500/80" />
              <span className="size-4.5 rounded-full border-2 border-white bg-amber-500/80" />
            </span>
            <span className="text-[10.5px] font-medium text-[#5b6478]">
              3 editing now
            </span>
          </span>
        </div>
        {/* Demo recording */}
        <InViewVideo
          className="block aspect-video w-full object-cover object-top"
          loop
          muted
          playsInline
          preload="metadata"
          src="/media/website/sheet-enrich-demo.webm"
        />
      </div>

      {/* Feature chips — highlighted one at a time */}
      <div className="flex max-w-150 flex-wrap items-center justify-center gap-2">
        {sheetChips.map((chip, i) => (
          <span
            key={chip}
            className="spot-chip rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors"
            style={{ ["--chip-delay" as string]: `${i * 2}s` }}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

/* MCP conversation — messages arrive step by step as the enrichment
   runs, replaying each time the pane becomes active. */
const mcpResults = [
  { name: "Anna Schmidt", detail: "anna.schmidt@google.com" },
  { name: "Jonas Weber", detail: "jonas.weber@google.com" },
  { name: "Mara Keller", detail: "mara.keller@google.com" },
];

const MCP_STEPS = 3 + mcpResults.length; // prompt, call, results…, summary

function McpPane({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(MCP_STEPS);
      return;
    }
    if (!active) {
      setStep(0);
      return;
    }
    if (step >= MCP_STEPS) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 350 : 850);
    return () => clearTimeout(t);
  }, [active, reduced, step]);

  const show = (i: number) =>
    cn(
      "relative transition-all duration-500 ease-out",
      step > i
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-2 opacity-0",
    );

  return (
    <div className="relative flex h-full flex-col gap-3 bg-[linear-gradient(180deg,#7b94e8_0%,#b5d2f6_58%,#d6e9fc_100%)] p-5 sm:p-7">
      {/* gentle top darkening, echoing the hero */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#1d2476]/25 to-transparent"
        aria-hidden
      />
      <div
        className={cn(
          show(0),
          "rounded-[10px] border border-white/60 bg-white/85 p-3.5 text-[13px] leading-relaxed text-[#1c2333]",
        )}
      >
        Find <span className="font-medium">100 software engineers</span> in{" "}
        <span className="font-medium">Berlin</span> at{" "}
        <span className="font-medium">Google</span>. Fetch work emails and
        phone numbers.
      </div>
      <div
        className={cn(
          show(1),
          "rounded-[10px] border border-white/60 bg-white/85 p-3 font-mono text-[11px] leading-relaxed text-[#444c66]",
        )}
      >
        <span className="text-[#2c37a4]">pipe0.search</span>(role:
        &quot;software_engineer&quot;, company:&quot;google&quot;, location:
        &quot;berlin&quot;, limit:100)
      </div>

      {/* Results streaming in */}
      <div className="flex flex-col gap-1.5">
        {mcpResults.map((r, i) => (
          <div
            key={r.name}
            className={cn(
              show(2 + i),
              "flex items-center gap-2.5 rounded-[9px] border border-white/55 bg-white/70 px-3 py-2 text-[12px] text-[#2b3350]",
            )}
          >
            <span className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-500/90 text-[9px] font-bold text-white">
              ✓
            </span>
            <span className="font-medium">{r.name}</span>
            <span className="truncate font-mono text-[11px] text-[#5b6478]">
              {r.detail}
            </span>
          </div>
        ))}
        <div
          className={cn(
            show(2 + mcpResults.length),
            "px-1 pt-1 text-[11.5px] font-medium text-[#2c356e]",
          )}
        >
          ✓ 100 records enriched
        </div>
      </div>

      <div className="relative mt-auto flex items-center gap-2 pt-2 text-[11px] text-[#39406b]">
        <span className="font-semibold uppercase tracking-[0.13em] text-[#2c356e]">
          MCP
        </span>
        <span className="text-[#2c356e]/40">·</span>
        <span>Cursor · Claude Code · Codex</span>
      </div>
    </div>
  );
}
