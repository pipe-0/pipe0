import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Clay cost calculator for /blog/clay-pricing. Every number below is Clay's
 * published tier list (clay.com/pricing, plans introduced 2026-03-11): the
 * price of each Actions tier and each Data Credits tier, per plan, on monthly
 * and annual billing (annual prices are the monthly equivalent). Top-ups are
 * Clay's documented rule: Data Credits only, a 30% premium on the plan's rate,
 * 250 credits minimum, at most 4x the monthly allocation. Actions can't be
 * topped up. When Clay changes its tiers, change them here and in the post.
 */

type Tier = { qty: number; monthly: number; annual: number };

const PLANS = {
  launch: {
    name: "Launch",
    actions: [
      { qty: 15_000, monthly: 60, annual: 54 },
      { qty: 40_000, monthly: 150, annual: 135 },
      { qty: 60_000, monthly: 200, annual: 180 },
      { qty: 100_000, monthly: 290, annual: 261 },
      { qty: 200_000, monthly: 540, annual: 486 },
    ],
    credits: [
      { qty: 2_500, monthly: 125, annual: 113 },
      { qty: 6_000, monthly: 290, annual: 261 },
      { qty: 10_000, monthly: 460, annual: 414 },
      { qty: 20_000, monthly: 880, annual: 792 },
      { qty: 50_000, monthly: 2_125, annual: 1_913 },
    ],
  },
  growth: {
    name: "Growth",
    actions: [
      { qty: 40_000, monthly: 205, annual: 185 },
      { qty: 60_000, monthly: 290, annual: 261 },
      { qty: 100_000, monthly: 450, annual: 405 },
      { qty: 200_000, monthly: 850, annual: 765 },
    ],
    credits: [
      { qty: 6_000, monthly: 290, annual: 261 },
      { qty: 10_000, monthly: 460, annual: 413 },
      { qty: 20_000, monthly: 880, annual: 792 },
      { qty: 50_000, monthly: 2_125, annual: 1_913 },
    ],
  },
} satisfies Record<string, { name: string; actions: Tier[]; credits: Tier[] }>;

const FREE = { actions: 500, credits: 100 };
const TOP_UP_PREMIUM = 1.3;
const TOP_UP_MIN = 250;
const TOP_UP_MAX_MULTIPLE = 4;
const TABLE_ROW_LIMIT = 50_000;

const RECORD_STEPS = [
  100, 250, 500, 1_000, 2_000, 3_000, 5_000, 7_500, 10_000, 15_000, 20_000,
  30_000, 50_000, 75_000, 100_000,
];

const CREDIT_OPTIONS = [
  { value: 1, label: "1", hint: "Profile and email" },
  { value: 6, label: "6", hint: "Full record, low end" },
  { value: 12, label: "12", hint: "Full record, middle" },
  { value: 20, label: "20", hint: "Full record, high end" },
];

const ACTION_OPTIONS = [
  { value: 3, label: "3", hint: "A short table" },
  { value: 5, label: "5", hint: "A typical table" },
  { value: 8, label: "8", hint: "A long table" },
];

type Billing = "monthly" | "annual";

type Estimate =
  | { kind: "free" }
  | { kind: "enterprise"; reason: string }
  | {
      kind: "plan";
      plan: string;
      actionsTier: number;
      creditsTier: number;
      topUp: number;
      actionsCost: number;
      creditsCost: number;
      topUpCost: number;
      total: number;
    };

function estimate(input: {
  records: number;
  creditsPerRecord: number;
  actionsPerRecord: number;
  needsCrm: boolean;
  billing: Billing;
}): Estimate {
  const actionsNeeded = input.records * input.actionsPerRecord;
  const creditsNeeded = input.records * input.creditsPerRecord;

  if (
    !input.needsCrm &&
    actionsNeeded <= FREE.actions &&
    creditsNeeded <= FREE.credits
  ) {
    return { kind: "free" };
  }

  const plan = input.needsCrm ? PLANS.growth : PLANS.launch;
  const price = (t: Tier) => t[input.billing];

  const actionsTier = plan.actions.find((t) => t.qty >= actionsNeeded);
  if (!actionsTier) {
    return {
      kind: "enterprise",
      reason: `That is ${fmt(actionsNeeded)} Actions a month, more than the largest self-serve tier (200,000).`,
    };
  }

  // The cheapest way to cover the Data Credits: a tier that fits, or a
  // smaller tier plus top-ups at the premium rate.
  let best: { tier: Tier; topUp: number; topUpCost: number } | undefined;
  for (const tier of plan.credits) {
    const short = Math.max(0, creditsNeeded - tier.qty);
    const topUp = short === 0 ? 0 : Math.max(TOP_UP_MIN, Math.ceil(short));
    if (topUp > tier.qty * TOP_UP_MAX_MULTIPLE) continue;
    const rate = price(tier) / tier.qty;
    const topUpCost = topUp * rate * TOP_UP_PREMIUM;
    if (!best || price(tier) + topUpCost < price(best.tier) + best.topUpCost) {
      best = { tier, topUp, topUpCost };
    }
  }
  if (!best) {
    return {
      kind: "enterprise",
      reason: `That is ${fmt(creditsNeeded)} Data Credits a month, beyond the largest self-serve tier and its top-up limit.`,
    };
  }

  const actionsCost = price(actionsTier);
  const creditsCost = price(best.tier);
  return {
    kind: "plan",
    plan: plan.name,
    actionsTier: actionsTier.qty,
    creditsTier: best.tier.qty,
    topUp: best.topUp,
    actionsCost,
    creditsCost,
    topUpCost: best.topUpCost,
    total: actionsCost + creditsCost + best.topUpCost,
  };
}

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
const usd = (n: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);

export function ClayCostCalculator() {
  const [step, setStep] = useState(RECORD_STEPS.indexOf(2_000));
  const [creditsPerRecord, setCreditsPerRecord] = useState(6);
  const [actionsPerRecord, setActionsPerRecord] = useState(5);
  const [needsCrm, setNeedsCrm] = useState(false);
  const [billing, setBilling] = useState<Billing>("monthly");
  const sliderId = useId();

  const records = RECORD_STEPS[step];
  const result = useMemo(
    () =>
      estimate({
        records,
        creditsPerRecord,
        actionsPerRecord,
        needsCrm,
        billing,
      }),
    [records, creditsPerRecord, actionsPerRecord, needsCrm, billing],
  );

  return (
    <figure className="not-prose my-12 overflow-hidden rounded-[14px] border border-[var(--rule)] bg-white">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-7 p-6 sm:p-8">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor={sliderId}
                className="text-[15px] font-medium text-foreground"
              >
                Records enriched a month
              </label>
              <span className="text-[22px] font-medium tabular-nums tracking-[-0.02em] text-foreground">
                {fmt(records)}
              </span>
            </div>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={RECORD_STEPS.length - 1}
              step={1}
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--primary)]"
            />
          </div>

          <Segmented
            label="Data Credits per record"
            options={CREDIT_OPTIONS}
            value={creditsPerRecord}
            onChange={setCreditsPerRecord}
          />

          <Segmented
            label="Actions per record"
            options={ACTION_OPTIONS}
            value={actionsPerRecord}
            onChange={setActionsPerRecord}
          />

          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-[15px] text-foreground">
              <input
                type="checkbox"
                checked={needsCrm}
                onChange={(e) => setNeedsCrm(e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Syncs to a CRM or calls an HTTP API
            </label>
            <div className="flex items-center gap-1 rounded-[8px] border border-[var(--rule)] p-0.5 text-[14px]">
              {(["monthly", "annual"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBilling(b)}
                  className={cn(
                    "rounded-[6px] px-3 py-1 transition-colors",
                    billing === b
                      ? "bg-[var(--well)] font-medium text-foreground shadow-[inset_0_0_0_1px_var(--rule)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {b === "monthly" ? "Monthly" : "Annual"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 border-t border-[var(--rule)] bg-[var(--well)] p-6 sm:p-8 lg:border-l lg:border-t-0">
          <Result result={result} records={records} billing={billing} />
        </div>
      </div>
      <figcaption className="border-t border-[var(--rule)] px-6 py-3 text-[13px] leading-relaxed text-muted-foreground sm:px-8">
        Uses Clay's published tiers and picks the cheapest mix of tiers and
        top-ups. Clay shows the exact Data Credit price of each enrichment in
        the table before you run it.
      </figcaption>
    </figure>
  );
}

function Result({
  result,
  records,
  billing,
}: {
  result: Estimate;
  records: number;
  billing: Billing;
}) {
  if (result.kind === "free") {
    return (
      <div>
        <p className="text-[14px] text-muted-foreground">Estimated bill</p>
        <p className="mt-1 text-[40px] font-medium leading-none tracking-[-0.035em] text-foreground">
          $0
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          The Free plan covers it: 100 Data Credits and 500 Actions a month,
          up to 200 rows per table.
        </p>
      </div>
    );
  }

  if (result.kind === "enterprise") {
    return (
      <div>
        <p className="text-[14px] text-muted-foreground">Estimated bill</p>
        <p className="mt-1 text-[32px] font-medium leading-tight tracking-[-0.03em] text-foreground">
          Enterprise
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          {result.reason} Clay prices Enterprise on request, on an annual
          contract.
        </p>
      </div>
    );
  }

  const rows = [
    { label: `${fmt(result.actionsTier)} Actions`, cost: result.actionsCost },
    {
      label: `${fmt(result.creditsTier)} Data Credits`,
      cost: result.creditsCost,
    },
    ...(result.topUp > 0
      ? [
          {
            label: `${fmt(result.topUp)} top-up credits`,
            cost: result.topUpCost,
          },
        ]
      : []),
  ];

  return (
    <>
      <div>
        <p className="text-[14px] text-muted-foreground">
          Estimated bill, {result.plan} plan
          {billing === "annual" ? ", billed annually" : ""}
        </p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-[40px] font-medium leading-none tracking-[-0.035em] text-foreground tabular-nums">
            {usd(result.total)}
          </span>
          <span className="text-[15px] text-muted-foreground">a month</span>
        </p>
        <p className="mt-2 text-[15px] text-muted-foreground tabular-nums">
          {usd(result.total / records, 2)} per record ·{" "}
          {usd(result.total * 12)} a year
        </p>
      </div>

      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between text-[14px]">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="tabular-nums text-foreground">
                {usd(row.cost)}
              </span>
            </div>
            <div className="mt-1 h-2 rounded-[4px] border border-[var(--rule)] bg-white">
              <div
                className="h-full rounded-[3px] bg-[var(--mark)]"
                style={{ width: `${(row.cost / result.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {records > TABLE_ROW_LIMIT && (
          <p className="pt-2 text-[13px] leading-relaxed text-muted-foreground">
            A Clay table holds 50,000 rows, so this volume means several
            tables a month or Enterprise bulk enrichment.
          </p>
        )}
      </div>
    </>
  );
}

function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: number; label: string; hint: string }[];
  value: number;
  onChange: (value: number) => void;
}) {
  const current = options.find((o) => o.value === value);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[15px] font-medium text-foreground">{label}</span>
        <span className="text-[14px] text-muted-foreground">
          {current?.hint}
        </span>
      </div>
      <div
        role="radiogroup"
        aria-label={label}
        className="mt-2.5 grid gap-1 rounded-[8px] border border-[var(--rule)] p-0.5"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-[6px] py-1.5 text-[15px] tabular-nums transition-colors",
              o.value === value
                ? "bg-[var(--well)] font-medium text-foreground shadow-[inset_0_0_0_1px_var(--rule)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
