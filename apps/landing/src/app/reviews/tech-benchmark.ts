/**
 * Technology lookup benchmark: DataForSEO Domain Technologies against BuiltWith's Domain API on
 * the same 20 domains (10 SaaS, 10 e-commerce), 2026-10-17. For each domain we checked whether
 * a tool found at least one technology in categories that matter for prospecting (CRM, payments,
 * email, reviews, ad pixels, …). BuiltWith counts only technologies it marks live (detected after
 * its latest full crawl). Run notes: closed repo session 2026-10-17, scratchpad techbench.
 */
export const TECH_BENCHMARK_PERIOD = "October 2026";

export type TechVertical = {
  key: "saas" | "ecommerce";
  label: string;
  /** Domain × category checks with a tool found, and the number of checks. */
  checks: number;
  dataforseo: number;
  builtwith: number;
  categories: string[];
};

export const TECH_VERTICALS: TechVertical[] = [
  {
    key: "saas",
    label: "SaaS companies",
    checks: 80,
    dataforseo: 10,
    builtwith: 66,
    categories: [
      "CRM and marketing automation",
      "product analytics",
      "support and chat",
      "payments",
      "web analytics",
      "ad pixels",
      "CMS",
      "B2B intent",
    ],
  },
  {
    key: "ecommerce",
    label: "Online stores",
    checks: 90,
    dataforseo: 13,
    builtwith: 68,
    categories: [
      "shop platform",
      "payments and BNPL",
      "email and SMS",
      "reviews",
      "support",
      "search",
      "subscriptions",
      "ad pixels",
      "attribution",
    ],
  },
];

/** Lookups that failed or came back empty, out of 20, and the price per lookup. */
export const TECH_LOOKUPS = {
  domains: 20,
  dataforseo: { empty: 2, costUsd: 0.012 },
  builtwith: { empty: 0, costUsd: 0.018 },
};

export const pct = (found: number, of: number) => Math.round((found / of) * 100);

/** The .md twin of `<TechBenchmark />`. */
export function techBenchmarkMarkdown(): string {
  return [
    `Share of prospecting categories where each tool found a technology (pipe0 benchmark, ${TECH_BENCHMARK_PERIOD}, 20 domains).`,
    "",
    "| Domains | DataForSEO | BuiltWith |",
    "| --- | --- | --- |",
    ...TECH_VERTICALS.map(
      (v) =>
        `| ${v.label} | ${pct(v.dataforseo, v.checks)}% | ${pct(v.builtwith, v.checks)}% |`,
    ),
    `| Lookups failed or empty | ${TECH_LOOKUPS.dataforseo.empty} of 20 | ${TECH_LOOKUPS.builtwith.empty} of 20 |`,
    `| Price per lookup | $${TECH_LOOKUPS.dataforseo.costUsd} | $${TECH_LOOKUPS.builtwith.costUsd} |`,
  ].join("\n");
}
