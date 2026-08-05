"use client";

import { SectionHeading } from "@/components/marketing";
import { PlaceholderAvatar } from "@/components/placeholder-avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Interfaces — the same engine, reached four ways.
 *
 * Laid out as a row of measures rather than an accordion: a rule, a label and
 * a muted line, with the full-width preview underneath. There is deliberately
 * no progress indicator; the section cycles, but showing a countdown made it
 * read like a carousel demanding attention rather than a set of facts.
 */

type Surface = {
  key: string;
  tab: string;
  title: string;
  copy: string;
  href: string;
  linkLabel: string;
};

const surfaces: Surface[] = [
  {
    key: "agent",
    tab: "UI Agent",
    title: "Ask in the sheet.",
    copy: "Describe the outcome. The agent picks the searches and pipes, builds the columns, and runs them.",
    href: "/docs/sheets/ai-agents",
    linkLabel: "Agents in Sheets",
  },
  {
    key: "mcp",
    tab: "MCP",
    title: "Your own agents.",
    copy: "Claude Code, Cursor, ChatGPT. The same engine over MCP, with no glue code in between.",
    href: "/docs/sdks/mcp",
    linkLabel: "MCP server",
  },
  {
    key: "slack",
    tab: "Slack",
    title: "Bot command.",
    copy: "@pipe0 researches an account, finds contact data, and reports back where the team already works.",
    href: "/docs/sdks/slack-agent",
    linkLabel: "Slack agent",
  },
  {
    key: "api",
    tab: "API",
    title: "Send your requests.",
    copy: "Compose providers, actions and conditions into pipes, then ship enrichment inside your own product.",
    href: "/enrichment-api",
    linkLabel: "Enrichment API",
  },
];

const CYCLE_MS = 10000;

/* The section opens on the API pane: developers are the audience most likely
   to bounce before the rotation reaches them. The cycle continues from here,
   so the other three still get their turn. */
const INITIAL = surfaces.findIndex((s) => s.key === "api");

export function LandingSpotlight() {
  const [active, setActive] = useState(INITIAL);
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

  const panes = [<AgentPane key="a" />, <McpPane key="m" />, <SlackPane key="s" />, <ApiPane key="p" />];

  /* Fade out, swap, fade in — one pane on screen at a time. A crossfade
     showed two panes at once, and the incoming translate made the block
     appear to shift; both read as a wobble. `shown` lags `active` by exactly
     the fade-out, so the caption swaps with its own preview. */
  const [shown, setShown] = useState(INITIAL);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (shown === active) return;
    // Starting the fade-out is the point of this effect, not a derived value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(false);
    const t = setTimeout(() => {
      setShown(active);
      setVisible(true);
    }, 380);
    return () => clearTimeout(t);
  }, [active, shown]);

  return (
    <div>
      <SectionHeading
        title="One engine. Every interface."
        subtitle="The same primitives for technical and non-technical users."
      />

      {/* Measures — a rule, a label, a muted line. */}
      <div
        className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4"
        role="tablist"
        aria-label="Interfaces"
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
              className="group cursor-pointer text-left"
            >
              {/* 2px rather than a hairline: at 1px the selected measure was
                  the same weight as the three it had to be picked out from,
                  and only its colour carried the state. */}
              <span
                aria-hidden
                className={cn(
                  "block h-0.5 w-full transition-colors duration-700 ease-out",
                  isActive
                    ? "bg-primary"
                    : "bg-border group-hover:bg-foreground/40",
                )}
              />
              <span
                className={cn(
                  "mt-4 block text-[17px] font-medium tracking-[-0.01em] transition-colors duration-700 ease-out",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.tab}
              </span>
              <span
                className={cn(
                  "mt-1.5 block max-w-[280px] text-sm leading-relaxed transition-colors duration-700 ease-out",
                  isActive ? "text-muted-foreground" : "text-muted-foreground/60",
                )}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Full-width preview on the same muted surface as the rest of the page.
          Both rows have a reserved height, so nothing reflows when the pane or
          the caption swaps — the caption lines differ in length and would
          otherwise change the panel's height mid-fade. */}
      <div className="mt-10 overflow-hidden rounded-[18px] border border-[var(--panel-edge)] bg-[var(--panel)]">
        <div
          className={cn(
            "flex h-[360px] items-center px-5 [will-change:opacity] transition-opacity ease-[cubic-bezier(0.33,0,0.2,1)] sm:h-[560px] sm:px-10",
            visible
              ? "opacity-100 duration-[700ms]"
              : "opacity-0 duration-[380ms]",
          )}
        >
          {panes[shown]}
        </div>

        <div className="flex min-h-[120px] flex-col items-start gap-3 border-t border-[var(--panel-edge)] px-5 py-5 sm:min-h-[76px] sm:flex-row sm:items-center sm:gap-3 sm:px-10">
          <span
            className={cn(
              "flex min-w-0 flex-1 flex-col gap-1 [will-change:opacity] transition-opacity ease-[cubic-bezier(0.33,0,0.2,1)] ease-out sm:flex-row sm:items-baseline sm:gap-3",
              visible
                ? "opacity-100 duration-[700ms]"
                : "opacity-0 duration-[380ms]",
            )}
          >
            <span className="text-[15px] font-medium text-foreground">
              {surfaces[shown].title}
            </span>
            <span className="min-w-0 text-sm leading-relaxed text-muted-foreground sm:flex-1">
              {surfaces[shown].copy}
            </span>
          </span>
          <Link
            href={surfaces[shown].href}
            className={cn(
              "shrink-0 text-sm font-medium text-primary underline-offset-4 [will-change:opacity] transition-opacity ease-[cubic-bezier(0.33,0,0.2,1)] ease-out hover:underline",
              visible
                ? "opacity-100 duration-[700ms]"
                : "opacity-0 duration-[380ms]",
            )}
          >
            {surfaces[shown].linkLabel} &rarr;
          </Link>
        </div>
      </div>
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
