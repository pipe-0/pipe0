import { Brackets, Cell, Cells, dotsStyle } from "@/components/grid";
import { NearVideo } from "@/components/loop-video";
import Image from "next/image";

/**
 * The core point — an agent and a team working on the same system.
 *
 * Framed by the buyer research (memory: gtm-buyer-psychology): GTM engineers
 * want their agent to do the building, and fear the two failure modes they
 * already know — a table tool their agent can't work in, and an agent stack
 * of scripts only one person can see or fix.
 *
 * Left: the illustration of exactly that (an agent's plug and a person's
 * cursor on one sheet). Right: the same claim as a three-row comparison.
 *
 * The rows are kinds of tool, not brands: the point is the choice buyers
 * have learned to make, and naming a competitor beside a flaw turns that
 * into an attack. Each line credits what the kind of tool is built for
 * before saying where it stops; pipe0's line is the gain, not a feature.
 * Brand-by-brand comparisons live on the compare pages.
 */

const rows: {
  tool: string;
  /** pipe0's mark beside its name; the kinds of tool have none. */
  logo?: string;
  line: string;
  team: boolean;
  agents: boolean;
  ours?: boolean;
}[] = [
  {
    tool: "Table tools",
    line: "Built for your team. Every table is clicked together by hand.",
    team: true,
    agents: false,
  },
  {
    tool: "Data tools for agents",
    line: "Built for your agent. The data comes back in the chat, and the rest is up to you.",
    team: false,
    agents: true,
  },
  {
    tool: "pipe0",
    logo: "/logo-small-light.svg",
    line: "Built for both. Your agent builds it, your team can see it, and nothing is rebuilt in between.",
    team: true,
    agents: true,
    ours: true,
  },
];

const cols =
  "grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] items-center gap-x-3 sm:grid-cols-[minmax(0,1fr)_5.5rem_5.5rem] sm:gap-x-4";

export function LandingPaths() {
  return (
    <Cells className="border-t border-[var(--rule)] lg:grid-cols-12">
      <Cell className="max-sm:p-0 p-6 sm:p-10 lg:col-span-5 lg:p-12">
        <div
          style={dotsStyle}
          className="relative flex aspect-[4/3] items-center justify-center border border-[var(--rule)] max-sm:border-0 lg:aspect-auto lg:h-full lg:min-h-[420px]"
        >
          <Brackets />
          {/* Animated scene (Blender, assets/illustrations/interface_anim.py):
              an agent's plug and a person's cursor dock into one screen and
              its rows light up. Same on every screen size. */}
          <NearVideo
            src="/media/website/illustrations/interface.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="An agent and a person using the same interface"
            width={800}
            height={600}
            className="h-auto w-[94%] mix-blend-multiply"
          />
        </div>
      </Cell>

      {/* Phones: one card per tool with labelled checks underneath — the
          two-column table needs more width than a phone has. */}
      {rows.map((row) => (
        <Cell
          key={`m-${row.tool}`}
          className={
            row.ours
              ? "bg-[var(--well)] px-5 py-5 max-sm:border-primary/40 sm:hidden"
              : "px-5 py-5 sm:hidden"
          }
        >
          <p
            className={
              row.ours
                ? "flex items-center gap-2.5 text-[21px] font-medium leading-none tracking-[-0.035em] text-foreground"
                : "flex items-center gap-2.5 text-[21px] font-medium leading-none tracking-[-0.035em] text-[var(--mark-text)]"
            }
          >
            {row.logo && (
              <Image
                src={row.logo}
                alt=""
                width={22}
                height={22}
                className="size-[22px] rounded-[5px] object-contain"
              />
            )}
            {row.tool}
          </p>
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
            {row.line}
          </p>
          <div className="mt-4 flex gap-2">
            {(
              [
                ["Team", row.team],
                ["Agents", row.agents],
              ] as const
            ).map(([label, on]) => (
              <span
                key={label}
                className={
                  on
                    ? row.ours
                      ? "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[13px] font-medium text-primary"
                      : "inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 py-1 text-[13px] font-medium text-foreground/80"
                    : "inline-flex items-center gap-1.5 rounded-full border border-dashed border-[var(--rule-strong)] px-3 py-1 text-[13px] text-muted-foreground"
                }
              >
                {on ? "✓" : "–"} {label}
              </span>
            ))}
          </div>
        </Cell>
      ))}

      <Cell className="flex flex-col max-sm:hidden lg:col-span-7">
        <div
          role="table"
          aria-label="Who each tool is built for"
          className="flex flex-1 flex-col"
        >
          <div
            role="row"
            className={`${cols} h-12 border-b border-[var(--rule)] px-6 text-[14px] text-muted-foreground sm:px-10 lg:px-12`}
          >
            {/* A real grid cell; only its text is visually hidden. */}
            <span role="columnheader">
              <span className="sr-only">Tool</span>
            </span>
            <span role="columnheader" className="text-center">
              Team
            </span>
            <span role="columnheader" className="text-center">
              Agents
            </span>
          </div>
          {rows.map((row) => (
            <div
              key={row.tool}
              role="row"
              className={
                row.ours
                  ? `${cols} relative flex-1 bg-[var(--well)] px-6 py-8 sm:px-10 lg:px-12`
                  : `${cols} flex-1 border-b border-[var(--rule)] px-6 py-8 sm:px-10 lg:px-12`
              }
            >
              {row.ours && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px] bg-primary"
                />
              )}
              <div role="rowheader">
                <p
                  className={
                    row.ours
                      ? "text-[clamp(20px,1.7vw,24px)] font-medium leading-none tracking-[-0.035em] text-foreground"
                      : "text-[clamp(20px,1.7vw,24px)] font-medium leading-none tracking-[-0.035em] text-[var(--mark-text)]"
                  }
                >
                  {row.tool}
                </p>
                <p
                  className={
                    row.ours
                      ? "mt-3 max-w-[40ch] text-[16px] leading-relaxed text-foreground"
                      : "mt-3 max-w-[40ch] text-[16px] leading-relaxed text-muted-foreground"
                  }
                >
                  {row.line}
                </p>
              </div>
              <Mark on={row.team} ours={!!row.ours} />
              <Mark on={row.agents} ours={!!row.ours} />
            </div>
          ))}
        </div>
      </Cell>
    </Cells>
  );
}

function Mark({ on, ours }: { on: boolean; ours: boolean }) {
  return (
    <span role="cell" className="flex justify-center">
      {on ? (
        <svg
          viewBox="0 0 24 24"
          className={ours ? "size-7 text-primary" : "size-7 text-foreground/70"}
          role="img"
          aria-label="Yes"
        >
          <path
            d="M5 12.5l4.5 4.5L19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span
          role="img"
          aria-label="No"
          className="block h-[2px] w-5 bg-[var(--rule-strong)]"
        />
      )}
    </span>
  );
}
