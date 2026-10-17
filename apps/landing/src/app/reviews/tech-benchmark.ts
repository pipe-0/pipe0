/**
 * Technology lookup benchmark: DataForSEO Domain Technologies, BuiltWith's Domain API and
 * Amplemarket's company enrichment on the same 20 domains (10 SaaS, 10 e-commerce),
 * 2026-10-17. For each domain we checked whether a tool found at least one technology in
 * categories that matter for prospecting (CRM, payments, email, reviews, ad pixels, …).
 * BuiltWith counts only technologies it marks live (detected after its latest full crawl);
 * Amplemarket returns no detection dates. Run notes: closed repo session 2026-10-17
 * (scratchpad techbench; Amplemarket via pipe0 run y89x7pl4qgstkvcr9uxllj8l).
 */
export const TECH_BENCHMARK_PERIOD = "October 2026";

export type TechTool = "dataforseo" | "builtwith" | "amplemarket";

export const TECH_TOOL_NAMES: Record<TechTool, string> = {
  builtwith: "BuiltWith",
  amplemarket: "Amplemarket",
  dataforseo: "DataForSEO",
};

/** Display order when no tool is highlighted. */
export const TECH_TOOLS: TechTool[] = ["builtwith", "amplemarket", "dataforseo"];

export type TechVertical = {
  key: "saas" | "ecommerce";
  label: string;
  /** Domain × category checks, and how many each tool found a technology in. */
  checks: number;
  found: Record<TechTool, number>;
  categories: string[];
};

export const TECH_VERTICALS: TechVertical[] = [
  {
    key: "saas",
    label: "SaaS companies",
    checks: 80,
    found: { dataforseo: 10, builtwith: 66, amplemarket: 62 },
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
    found: { dataforseo: 13, builtwith: 68, amplemarket: 71 },
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

/** Per tool, out of 20 domains / 10 stores. */
export const TECH_LOOKUPS: {
  domains: number;
  stores: number;
  tools: Record<
    TechTool,
    {
      empty: number;
      conflictingPlatforms: number;
      /** Median technologies per company: SaaS, online stores. */
      medianTechnologies: [number, number];
      /** The vendor's public price, never what pipe0 pays. */
      price: string;
      pipe0Price: string;
    }
  >;
} = {
  domains: 20,
  stores: 10,
  tools: {
    // BuiltWith: live technologies after pipe0's cleanup (rankings, CDN edges, currencies… removed).
    builtwith: {
      empty: 0,
      conflictingPlatforms: 0,
      medianTechnologies: [105, 120],
      price: "$0.0495 per lookup pay as you go, about $0.01 on the Team plan",
      pipe0Price: "2 credits",
    },
    // Amplemarket: the list as returned, undated and not cleaned (it includes entries like "SQL").
    amplemarket: {
      empty: 1,
      conflictingPlatforms: 3,
      medianTechnologies: [161, 117],
      price: "Part of an Amplemarket subscription",
      pipe0Price: "1.5 credits",
    },
    dataforseo: {
      empty: 2,
      conflictingPlatforms: 0,
      medianTechnologies: [8, 6],
      price: "$0.012 per lookup",
      pipe0Price: "Not offered",
    },
  },
};

export const pct = (found: number, of: number) => Math.round((found / of) * 100);

/** The .md twin of `<TechBenchmark />`. */
export function techBenchmarkMarkdown(): string {
  const cols = TECH_TOOLS.map((t) => TECH_TOOL_NAMES[t]);
  const row = (label: string, cell: (t: TechTool) => string) =>
    `| ${label} | ${TECH_TOOLS.map(cell).join(" | ")} |`;
  return [
    `Share of prospecting categories where each tool found a technology (pipe0 benchmark, ${TECH_BENCHMARK_PERIOD}, 20 domains).`,
    "",
    `| Domains | ${cols.join(" | ")} |`,
    `| --- | ${cols.map(() => "---").join(" | ")} |`,
    ...TECH_VERTICALS.map((v) => row(v.label, (t) => `${pct(v.found[t], v.checks)}%`)),
    row("Stores listed with conflicting shop platforms", (t) => `${TECH_LOOKUPS.tools[t].conflictingPlatforms} of 10`),
    row("Technologies per company, SaaS (median)", (t) => `${TECH_LOOKUPS.tools[t].medianTechnologies[0]}`),
    row("Technologies per company, online stores (median)", (t) => `${TECH_LOOKUPS.tools[t].medianTechnologies[1]}`),
    row("Lookups failed or empty", (t) => `${TECH_LOOKUPS.tools[t].empty} of 20`),
    row("List price", (t) => TECH_LOOKUPS.tools[t].price),
    row("Price in pipe0", (t) => TECH_LOOKUPS.tools[t].pipe0Price),
    "",
    "BuiltWith counts are live technologies after pipe0's cleanup; Amplemarket's are its list as returned, undated and uncleaned.",
  ].join("\n");
}
