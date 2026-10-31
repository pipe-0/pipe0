import { RowLink, barSkin } from "@/components/grid";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

/**
 * The money section — what a result costs here against what it usually
 * costs, and what an action costs.
 *
 * Sources:
 * - pipe0 averages: evidence.md section C (~4.5¢ per work email, ~14¢ per
 *   mobile, 20-record test). With high-volume pricing enrolled: ~3¢ per
 *   work email, ~10¢ per mobile.
 * - Typical ranges: evidence.md section E, "embedded waterfalls: 25–100¢ per
 *   mobile, 8–30¢ per work email". Unnamed on purpose: it is the norm, not
 *   one vendor.
 * - "Up to Nx" is the top of the typical range over pipe0's average,
 *   rounded down (100 / 14 = 7.1, 30 / 4.5 = 6.7).
 * - Actions: action pipes run on the customer's own connection, billed at
 *   the custom-connection fee (docs/connections.mdx): 0.001 credits on plans
 *   above $300/mo, so 100k actions = 100 credits ≈ $3. 0.05 below that.
 *
 * The chart is one scale per row, running a little past the top of the
 * typical range so no bar fills its track. Both rows share the track and a
 * right-hand value column: pipe0's average in indigo; the typical range in
 * amber, solid to the bottom of the range and fading across it, so
 * "25–100¢" reads as a span, not a point.
 *
 * Tabs switch pipe0's bar between high-volume and standard pricing. Both
 * panels stay in the DOM (the inactive one is `hidden`) so crawlers read
 * both sets of numbers.
 */

/** Track length as a multiple of the top of the typical range. */
const HEADROOM = 1.15;

const rows = [
  {
    label: "Mobile number",
    ours: { volume: 10, standard: 14 },
    low: 25,
    high: 100,
    range: "25–100¢",
  },
  {
    label: "Work email",
    ours: { volume: 3, standard: 4.5 },
    low: 8,
    high: 30,
    range: "8–30¢",
  },
];

const tabs = [
  { key: "volume", label: "With high-volume pricing", short: "High-volume" },
  { key: "standard", label: "Without high-volume pricing", short: "Standard" },
] as const;

type Tier = (typeof tabs)[number]["key"];

export function LandingEconomics({
  pricingLink = true,
}: {
  /** Off on the pricing page itself. */
  pricingLink?: boolean;
}) {
  const [active, setActive] = useState<Tier>("volume");

  return (
    <>
      {/* The tabs are a row of cells sharing a 1px wall, like the rest of
          the grid: the chosen one sits on the page background, the other on
          the well. */}
      <div
        role="tablist"
        aria-label="Pricing"
        className="grid grid-cols-2 gap-px border-t border-[var(--rule)] bg-[var(--rule)]"
      >
        {tabs.map((tab) => {
          const on = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`economics-tab-${tab.key}`}
              aria-selected={on}
              aria-controls={`economics-panel-${tab.key}`}
              onClick={() => setActive(tab.key)}
              className={cn(
                "flex min-h-14 items-center gap-2.5 px-6 py-3 text-left text-[14.5px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-10 lg:px-12",
                on
                  ? "bg-background text-foreground"
                  : "bg-[var(--well)] text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 shrink-0 transition-colors",
                  on ? "bg-primary" : "bg-[var(--rule)]",
                )}
              />
              <span className="sm:hidden">{tab.short}</span>
              <span className="max-sm:hidden">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`economics-panel-${tab.key}`}
          aria-labelledby={`economics-tab-${tab.key}`}
          hidden={tab.key !== active}
        >
          <ResultRows tier={tab.key} />
        </div>
      ))}

      {/* Actions: what they are under the title, the price on the right;
          the plan condition as a footnote in the tile's corner. */}
      <div className="relative grid gap-6 border-t border-[var(--rule)] px-6 pb-12 pt-10 sm:px-10 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:px-12">
        <div>
          <p className="text-[17px] font-medium text-foreground">Actions</p>
          <p className="mt-1 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground">
            CRM writes, Slack messages, and sequence enrollments on your own
            connections. No second meter that grows with every step.
          </p>
        </div>
        <p className="lg:text-right">
          <span className="whitespace-nowrap text-[clamp(22px,2vw,28px)] font-medium leading-none tracking-[-0.04em] text-foreground">
            $3<span className="text-muted-foreground">*</span>
          </span>
          <span className="mt-1 block text-[14px] text-muted-foreground">
            per 100k actions
          </span>
        </p>
        <p className="absolute bottom-3 right-6 text-[12px] text-muted-foreground sm:right-10 lg:right-12">
          * On plans above $300/mo
        </p>
      </div>

      {pricingLink && <RowLink href="/pricing">See pricing</RowLink>}
    </>
  );
}

/** The two result rows, with pipe0's bar at the given pricing tier. */
function ResultRows({ tier }: { tier: Tier }) {
  return (
    <>
      {rows.map((row) => {
        const pct = (v: number) => `${(v / (row.high * HEADROOM)) * 100}%`;
        const lowAt = `${(row.low / row.high) * 100}%`;
        return (
          <div
            key={row.label}
            className="grid gap-6 border-t border-[var(--rule)] px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-center lg:gap-10 lg:px-12"
          >
            <div>
              <p className="text-[17px] font-medium text-foreground">
                {row.label}
              </p>
              <p className="mt-1 text-[15px] text-muted-foreground">
                average cost per result
              </p>
            </div>

            <dl className="space-y-3">
              <Bar label="pipe0" value={`${row.ours[tier]}¢`} ours>
                <span
                  className="absolute inset-y-0 left-0 rounded-[3px]"
                  style={{ width: pct(row.ours[tier]), ...barSkin.win }}
                />
              </Bar>
              <Bar label="Typical" value={row.range}>
                <span
                  className="absolute inset-y-0 left-0 rounded-[3px]"
                  style={{
                    width: pct(row.high),
                    ...barSkin.lose,
                    // solid to the bottom of the range, then fading across it
                    maskImage: `linear-gradient(90deg, #000 ${lowAt}, rgba(0,0,0,0.4) 100%)`,
                    WebkitMaskImage: `linear-gradient(90deg, #000 ${lowAt}, rgba(0,0,0,0.4) 100%)`,
                  }}
                />
              </Bar>
            </dl>
          </div>
        );
      })}
    </>
  );
}

/** One chart row: label, a track running to the top of the typical range,
 *  and the value in a fixed column on the right. */
function Bar({
  label,
  value,
  ours = false,
  children,
}: {
  label: string;
  value: string;
  ours?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_5.25rem] items-center gap-3 sm:grid-cols-[5rem_minmax(0,1fr)_6rem] sm:gap-4">
      <dt
        className={
          ours
            ? "text-[15px] font-medium text-foreground"
            : "text-[15px] text-muted-foreground"
        }
      >
        {label}
      </dt>
      <dd className="relative h-8 rounded-[3px] border border-[var(--rule)] bg-[var(--well)] sm:h-9">
        {children}
      </dd>
      <dd
        className={
          ours
            ? "whitespace-nowrap text-right text-[17px] font-medium text-foreground"
            : "whitespace-nowrap text-right text-[15px] text-muted-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}
