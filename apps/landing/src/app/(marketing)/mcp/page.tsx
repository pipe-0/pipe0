import { LandingEconomics } from "@/app/landing-economics";
import { CopyCommand } from "@/components/copy-command";
import {
  Band,
  Brackets,
  ButtonLink,
  Cell,
  Cells,
  SectionHead,
  barSkin,
  dotsStyle,
} from "@/components/grid";
import { CloseBand, LandingShell, PageHero } from "@/components/landing-shell";
import { LoopVideo } from "@/components/loop-video";
import { JsonLd, softwareApplicationJsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Product page: pipe0 for coding agents (Claude Code, Cursor, Codex).
 *
 * Positioning (pipe0-positioning skill, frame 2 — agent tool gateways):
 * the same stateless, agent-first workflow those tools offer, plus
 * coverage from a curated waterfall and a stateful home when the list
 * needs one. Their story ends with data; ours doesn't — said here as what
 * pipe0 does, never as a jab.
 *
 * Buyer (memory: gtm-buyer-psychology): developers and GTM engineers who
 * want a self-serve install, docs before signup, per-result prices, and an
 * MCP server that behaves like the API. Hence the install command in the
 * hero and the validation section.
 *
 * Facts: MCP URL, OAuth sign-in, tool names and confirmation behaviour
 * from docs/sdks/mcp.mdx. Benchmark: evidence.md section B (20 records,
 * one run each, by hand through each tool's agent interface, Sept 2026).
 */

const description =
  "Give Claude Code, Cursor, and Codex 100+ searches and enrichments across 50+ providers through one MCP server. Curated waterfalls bill only on a hit, and lists that outgrow the chat land in a sheet your team can open.";

export const metadata = createMetadata({
  title: "Enrichment MCP server for coding agents",
  description,
  path: "/mcp",
});

/* Kicker marks, the same files as the homepage's MCP pane. */
const agentMarks = [
  { src: "/media/website/logos/agent-claude.svg", name: "Claude Code" },
  { src: "/media/website/logos/agent-cursor.svg", name: "Cursor" },
  { src: "/media/website/logos/agent-openai.svg", name: "Codex" },
];

const MCP_URL = "https://api.pipe0.com/v1/mcp";
const INSTALL = `claude mcp add --transport http pipe0 ${MCP_URL}`;

/* ---- A session, as the agent runs it --------------------------------- */

type Step = { tool: string; arg: string; result: string };

const session: Step[] = [
  {
    tool: "run_search_oneshot",
    arg: "people:profiles:crustdata@3",
    result: "25 people",
  },
  {
    tool: "run_pipes_oneshot",
    arg: "person:workemail:waterfall@1",
    result: "23 work emails found · 2 misses, not billed",
  },
  {
    tool: "create_sheet",
    arg: "Berlin fintech RevOps",
    result: "sheet created",
  },
  {
    tool: "run_effects",
    arg: "rows:add:run@1",
    result: "25 rows written",
  },
];

function SessionCard() {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-[12px] border border-[#1c2333]/10 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.04),0_8px_24px_rgba(28,35,80,0.06)]">
      <div className="flex items-center justify-between border-b border-[#1c2333]/8 bg-[#f7f9fc] px-4 py-2.5 font-mono text-[11.5px] text-[#5b6478]">
        <span>claude · ~/gtm</span>
        <span>pipe0 connected</span>
      </div>
      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        {/* The ask, in the person's words. */}
        <p className="text-[15px] leading-relaxed text-foreground">
          <span className="mr-2 font-mono text-[13px] text-muted-foreground">
            &gt;
          </span>
          Find heads of RevOps at Series B fintechs in Berlin, get their work
          emails, and put them somewhere my team can see.
        </p>
        {/* What the agent did, one tool call per line. */}
        <ol className="space-y-2.5 border-l border-[var(--rule-strong)] pl-4">
          {session.map((s) => (
            <li key={s.tool + s.arg} className="font-mono text-[11.5px] leading-[1.6] sm:text-[12.5px]">
              <span className="text-[#2c37a4]">{s.tool}</span>{" "}
              <span className="text-[#5b6478]">{s.arg}</span>
              <span className="block text-emerald-700">→ {s.result}</span>
            </li>
          ))}
        </ol>
        {/* The answer: short, with a place to look. */}
        <p className="text-[15px] leading-relaxed text-foreground">
          Done. 23 of 25 have a work email. They&apos;re in{" "}
          <span className="font-medium text-primary underline decoration-primary/30 underline-offset-4">
            Berlin fintech RevOps
          </span>
          , ready for your team.
        </p>
      </div>
    </div>
  );
}

/* ---- Measured against other agent tools ------------------------------ */

const tested = [
  { name: "pipe0", found: 18, cost: "14¢", time: "17 s", ours: true },
  { name: "Landbase", found: 13, cost: "43¢", time: "62 s" },
  { name: "Deepline", found: 12, cost: "41¢", time: "145 s" },
];

function AgentBenchmark() {
  return (
    <figure className="border-t border-[var(--rule)] px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
      <figcaption className="sr-only">
        Mobile numbers found from 20 records through each tool&apos;s agent:
        pipe0 18 of 20 at 14 cents per mobile in 17 seconds per phone,
        Landbase 13 of 20 at 43 cents in 62 seconds, Deepline 12 of 20 at 41
        cents in about 145 seconds.
      </figcaption>
      {/* Column heads, desktop only; phones label the numbers inline. */}
      <div className="hidden grid-cols-[9rem_minmax(0,1fr)_7rem_7rem] gap-8 pb-5 text-[14px] text-muted-foreground lg:grid">
        <span />
        <span>Mobile numbers found, of 20</span>
        <span className="text-right">Cost per mobile</span>
        <span className="text-right">Time per phone</span>
      </div>
      <div className="space-y-7 lg:space-y-5">
        {tested.map((t) => (
          <div
            key={t.name}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2.5 lg:grid-cols-[9rem_minmax(0,1fr)_7rem_7rem] lg:gap-8"
          >
            <span
              className={
                t.ours
                  ? "text-[17px] font-medium text-foreground"
                  : "text-[17px] text-muted-foreground"
              }
            >
              {t.name}
            </span>
            {/* Phones: cost and time beside the name. */}
            <span className="text-right text-[14px] text-muted-foreground lg:hidden">
              {t.cost} · {t.time}
            </span>
            <div className="col-span-2 flex items-center gap-4 lg:col-span-1">
              <div className="relative h-10 flex-1 rounded-[3px] border border-[var(--rule)] bg-[var(--well)] sm:h-12">
                <span
                  className="absolute inset-y-0 left-0 rounded-[3px]"
                  style={{
                    width: `${(t.found / 20) * 100}%`,
                    ...(t.ours ? barSkin.win : barSkin.lose),
                  }}
                />
              </div>
              <span
                className={
                  t.ours
                    ? "w-[4ch] text-right text-[clamp(20px,1.9vw,26px)] font-medium leading-none tracking-[-0.04em] text-primary"
                    : "w-[4ch] text-right text-[clamp(20px,1.9vw,26px)] font-medium leading-none tracking-[-0.04em] text-[var(--mark)]"
                }
              >
                {t.found}
              </span>
            </div>
            <span
              className={
                t.ours
                  ? "hidden text-right text-[17px] font-medium text-foreground lg:block"
                  : "hidden text-right text-[17px] text-muted-foreground lg:block"
              }
            >
              {t.cost}
            </span>
            <span
              className={
                t.ours
                  ? "hidden text-right text-[17px] font-medium text-foreground lg:block"
                  : "hidden text-right text-[17px] text-muted-foreground lg:block"
              }
            >
              {t.time}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ---- Stateless and stateful ------------------------------------------ */

function RecordsCard() {
  return (
    <pre className="overflow-x-auto rounded-[10px] border border-[var(--rule)] bg-white px-4 py-4 font-mono text-[11.5px] leading-[1.7] text-[#2b3350] sm:text-[12.5px]">
      <code>
        <span className="text-[#98a1b5]">{"// records, back in the call"}</span>
        {"\n"}
        {"{"} name: <span className="text-emerald-700">&quot;Lena Brandt&quot;</span>,{"\n"}
        {"  "}company_domain: <span className="text-emerald-700">&quot;heliolabs.io&quot;</span>,{"\n"}
        {"  "}work_email: <span className="text-emerald-700">&quot;lena@heliolabs.io&quot;</span> {"}"}
        {"\n"}
        {"{"} name: <span className="text-emerald-700">&quot;Jonas Weber&quot;</span>,{"\n"}
        {"  "}company_domain: <span className="text-emerald-700">&quot;payfold.de&quot;</span>,{"\n"}
        {"  "}work_email: <span className="text-emerald-700">&quot;jonas@payfold.de&quot;</span> {"}"}
      </code>
    </pre>
  );
}

const sheetRows = [
  ["Lena Brandt", "heliolabs.io", "lena@heliolabs.io"],
  ["Jonas Weber", "payfold.de", "jonas@payfold.de"],
  ["Mira Koch", "clearsum.com", "mira@clearsum.com"],
  ["Tim Ahrens", "ledgerly.io", "—"],
];

function SheetCard() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--rule)] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--rule)] bg-[#f7f9fc] px-4 py-2.5">
        <span className="truncate text-[13px] font-medium text-foreground">
          Berlin fintech RevOps
        </span>
        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-medium text-primary">
          Every Monday 9:00
        </span>
      </div>
      <table className="w-full text-left text-[12.5px] sm:text-[13px]">
        <thead className="text-muted-foreground">
          <tr className="border-b border-[var(--rule)]">
            <th className="px-4 py-2 font-normal">Name</th>
            <th className="hidden px-4 py-2 font-normal sm:table-cell">Domain</th>
            <th className="px-4 py-2 font-normal">Work email</th>
          </tr>
        </thead>
        <tbody>
          {sheetRows.map((r) => (
            <tr key={r[0]} className="border-b border-[var(--rule)] last:border-b-0">
              <td className="px-4 py-2 text-foreground">{r[0]}</td>
              <td className="hidden px-4 py-2 text-muted-foreground sm:table-cell">{r[1]}</td>
              <td className={r[2] === "—" ? "px-4 py-2 text-muted-foreground" : "px-4 py-2 text-foreground"}>
                {r[2]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---- Built for an agent to get right ---------------------------------- */

const guardrails = [
  {
    title: "Schemas before calls",
    body: "The agent reads every search and pipe's inputs and outputs before it runs anything, so it builds the payload instead of guessing it.",
  },
  {
    title: "Checked before billed",
    body: "Every run is validated first. A wrong key or an unknown filter value comes back as a named error with the closest real value, and nothing is billed.",
  },
  {
    title: "Asks before it spends",
    body: "Tools that spend credits or change data confirm on the first call. The same engine, prices, and limits as the API.",
  },
];

function ValidationCard() {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-[12px] border border-[#1c2333]/10 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.04),0_8px_24px_rgba(28,35,80,0.06)]">
      <div className="border-b border-[#1c2333]/8 bg-[#f7f9fc] px-4 py-2.5 font-mono text-[11.5px] text-[#5b6478]">
        run_search_oneshot
      </div>
      <div className="space-y-3 px-5 py-5 font-mono text-[11.5px] leading-[1.7] sm:text-[12.5px]">
        <p className="text-[#5b6478]">
          filters.locations: <span className="text-foreground">&quot;Berlin, DE&quot;</span>
        </p>
        <p className="flex items-start gap-2 text-[#b4541a]">
          <span aria-hidden>✕</span>
          <span>Not a known value. Nothing ran, nothing billed.</span>
        </p>
        <p className="text-[#5b6478]">
          closest: <span className="text-emerald-700">&quot;Berlin, Germany&quot;</span>
        </p>
        <p className="border-t border-[var(--rule)] pt-3 text-[#5b6478]">
          <span className="text-[#2c37a4]">retry</span> → 25 people
        </p>
      </div>
    </div>
  );
}

/* ---- Install ---------------------------------------------------------- */

const clients: { name: string; how: ReactNode }[] = [
  {
    name: "Claude Code",
    how: (
      <>
        <code className="break-all font-mono text-[12.5px] text-foreground">{INSTALL}</code>
        <span className="mt-1.5 block">
          Then run <code className="font-mono text-[12.5px]">/mcp</code> and choose
          Authenticate.
        </span>
      </>
    ),
  },
  {
    name: "Cursor",
    how: (
      <>
        Add the URL under <code className="font-mono text-[12.5px]">mcpServers</code>{" "}
        in <code className="font-mono text-[12.5px]">.cursor/mcp.json</code>, then sign
        in from Settings, MCP.
      </>
    ),
  },
  {
    name: "Claude and ChatGPT",
    how: <>Add a custom connector with the server URL and connect.</>,
  },
  {
    name: "Codex and other clients",
    how: <>Any client with streamable HTTP and OAuth connects with the same URL.</>,
  },
];

/* ---- Page ------------------------------------------------------------- */

export default function McpPage() {
  return (
    <LandingShell page="mcp">
      <JsonLd data={softwareApplicationJsonLd({ description })} />

      <PageHero
        kicker={
          <>
            {/* The agents as marks. Their names stay in the heading as
                visually hidden text, so search engines and screen readers
                read the full line. */}
            GTM data for
            <span className="sr-only"> Claude Code, Cursor, and Codex.</span>
            <span aria-hidden className="ml-[0.35em] inline-flex items-center gap-[0.3em] align-[-0.12em]">
              {agentMarks.map((m) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={m.src} src={m.src} alt="" className="size-[0.95em]" />
              ))}
            </span>
          </>
        }
        title="Ask your agent for a list. Get a list."
        lede="One MCP server gives your agent 100+ searches and enrichments across 50+ providers. Waterfalls bill only when they find something, and when a list outgrows the chat, it lands in a sheet your team can open."
        actions={
          <div className="flex w-full min-w-0 flex-col items-center gap-4">
            <CopyCommand command={INSTALL} />
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/docs/sdks/mcp">Set up in two minutes</ButtonLink>
              <ButtonLink href="/docs/pipe-catalog" tone="secondary">
                Browse the tools
              </ButtonLink>
            </div>
          </div>
        }
      />

      {/* ===== A session: what the agent actually does ===== */}
      <Band>
        <SectionHead
          title="One prompt, start to finish."
          lede="Your agent finds the right search, runs the waterfall, and writes the result where your team can see it. No scraping, no keys to juggle."
        />
        <Cells className="border-t border-[var(--rule)] lg:grid-cols-12">
          <Cell className="px-6 py-10 sm:px-10 lg:col-span-7 lg:px-12">
            <SessionCard />
          </Cell>
          <Cell className="p-6 sm:p-10 lg:col-span-5 lg:p-12">
            <div
              style={dotsStyle}
              className="relative flex aspect-[4/3] items-center justify-center border border-[var(--rule)] lg:aspect-auto lg:h-full"
            >
              <Brackets />
              <LoopVideo
                src="/media/website/illustrations/mcp.mp4"
                poster="/media/website/illustrations/mcp.png"
                label="An agent calling tools through one hub"
                className="w-[92%]"
              />
            </div>
          </Cell>
        </Cells>
      </Band>

      {/* ===== Measured against other agent tools ===== */}
      <Band>
        <SectionHead
          title="More found, through the agent."
          lede="Same 20 people, asked through each tool's own agent interface. Count the numbers, then check the bill."
        />
        <AgentBenchmark />
        <p className="border-t border-[var(--rule)] px-6 py-5 text-[13.5px] leading-relaxed text-muted-foreground sm:px-10 lg:px-12">
          20 records, one run each, September 2026. Test it on your own list.{" "}
          <Link
            href="/blog/deepline-alternatives"
            className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          >
            Method and data
          </Link>
        </p>
      </Band>

      {/* ===== Stateless, then stateful ===== */}
      <Band>
        <SectionHead
          title="When the list outgrows the chat, it gets a sheet."
          lede="Data comes back in the call while that's enough. When a list needs a schedule, a webhook, or a teammate's eyes, the agent writes it to a sheet. Same records, nothing rebuilt."
        />
        <Cells className="border-t border-[var(--rule)] lg:grid-cols-2">
          <Cell className="px-6 py-10 sm:px-10 lg:px-12">
            <h3 className="text-[18px] font-medium tracking-[-0.015em] text-foreground">
              In the call
            </h3>
            <p className="mt-2 max-w-[46ch] text-[15.5px] leading-relaxed text-muted-foreground">
              Records come straight back to your agent, ready for its next step.
            </p>
            <div className="mt-7">
              <RecordsCard />
            </div>
          </Cell>
          <Cell className="px-6 py-10 sm:px-10 lg:px-12">
            <h3 className="text-[18px] font-medium tracking-[-0.015em] text-foreground">
              In a sheet
            </h3>
            <p className="mt-2 max-w-[46ch] text-[15.5px] leading-relaxed text-muted-foreground">
              Up to 2M rows, on a schedule, open to your team and to the agent.
            </p>
            <div className="mt-7">
              <SheetCard />
            </div>
          </Cell>
        </Cells>
      </Band>

      {/* ===== Built for an agent to get right ===== */}
      <Band>
        <SectionHead
          title="Built for an agent to get right."
          lede="Typed blocks that never shift under it, and errors it can read and fix on its own."
        />
        <Cells className="border-t border-[var(--rule)] lg:grid-cols-12">
          <Cell className="lg:col-span-7">
            {guardrails.map((g, i) => (
              <div
                key={g.title}
                className={
                  i
                    ? "border-t border-[var(--rule)] px-6 py-8 sm:px-10 lg:px-12"
                    : "px-6 py-8 sm:px-10 lg:px-12"
                }
              >
                <h3 className="text-[18px] font-medium tracking-[-0.015em] text-foreground">
                  {g.title}
                </h3>
                <p className="mt-2 max-w-[56ch] text-[15.5px] leading-relaxed text-muted-foreground">
                  {g.body}
                </p>
              </div>
            ))}
          </Cell>
          <Cell className="flex items-center px-6 py-10 sm:px-10 lg:col-span-5 lg:px-12">
            <ValidationCard />
          </Cell>
        </Cells>
      </Band>

      {/* ===== Install ===== */}
      <Band>
        <SectionHead
          title="Connect in one command."
          lede="Sign in with pipe0 in the browser. No API key to paste, no provider accounts to open."
        />
        <div className="border-t border-[var(--rule)]">
          {clients.map((c, i) => (
            <div
              key={c.name}
              className={
                (i ? "border-t border-[var(--rule)] " : "") +
                "grid gap-2 px-6 py-6 sm:px-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-baseline lg:gap-10 lg:px-12"
              }
            >
              <span className="text-[16px] font-medium text-foreground">{c.name}</span>
              <div className="min-w-0 text-[15px] leading-relaxed text-muted-foreground">
                {c.how}
              </div>
            </div>
          ))}
          <div className="grid gap-2 border-t border-[var(--rule)] bg-[var(--well)] px-6 py-5 sm:px-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-baseline lg:gap-10 lg:px-12">
            <span className="text-[14px] text-muted-foreground">Server URL</span>
            <code className="break-all font-mono text-[13px] text-foreground">{MCP_URL}</code>
          </div>
        </div>
      </Band>

      {/* ===== Pricing ===== */}
      <Band>
        <SectionHead
          title="Pay per result. Misses are free."
          lede="MCP calls are billed like API calls. No subscription required, no second meter for your agent."
        />
        <LandingEconomics />
      </Band>

      <CloseBand
        title="Give your agent the data."
        lede="Connect the MCP server, sign in once, and ask for your first list. New accounts get free credits."
      />
    </LandingShell>
  );
}
