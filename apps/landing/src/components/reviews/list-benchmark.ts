/**
 * pipe0's list-building benchmark, October 2026: the numbers behind the
 * Exa, Parallel and DataForSEO reviews. One source for the charts on the
 * pages and the tables in their .md twins, so the two never drift.
 *
 * Every scenario ran once per product, with the vendor's own timestamps for
 * durations and the vendor's own billing for cost (what pipe0 paid, before
 * any margin). Rows are unique rows after removing duplicates.
 */

export const LIST_BENCHMARK_PERIOD = "October 2026";

export type Vendor = "dataforseo" | "exa" | "parallel" | "database";

export type Product = {
  key: string;
  vendor: Vendor;
  name: string;
  /** For dense charts, where the scenario already sets the context. */
  short: string;
  /** What the product is, in a few words. */
  kind: string;
};

export const PRODUCTS: Product[] = [
  {
    key: "dataforseo",
    vendor: "dataforseo",
    name: "DataForSEO Business Listings",
    short: "DataForSEO",
    kind: "Filter search over map listings",
  },
  {
    key: "exa-ultra",
    vendor: "exa",
    name: "Exa Agent, ultra",
    short: "Exa ultra",
    kind: "Prompt-based research agent",
  },
  {
    key: "exa-medium",
    vendor: "exa",
    name: "Exa Agent, medium",
    short: "Exa medium",
    kind: "Prompt-based research agent",
  },
  {
    key: "parallel-pro",
    vendor: "parallel",
    name: "Parallel Task, pro",
    short: "Parallel Task pro",
    kind: "Prompt-based research task",
  },
  {
    key: "parallel-ultra",
    vendor: "parallel",
    name: "Parallel Task, ultra",
    short: "Parallel Task ultra",
    kind: "Prompt-based research task",
  },
  {
    key: "parallel-entity",
    vendor: "parallel",
    name: "Parallel Entity Search",
    short: "Parallel Entity",
    kind: "Company search",
  },
  {
    key: "parallel-findall",
    vendor: "parallel",
    name: "Parallel FindAll, base",
    short: "Parallel FindAll",
    kind: "Verified list search",
  },
  {
    key: "crustdata",
    vendor: "database",
    name: "Crustdata",
    short: "Crustdata",
    kind: "Company database (filters)",
  },
  {
    key: "amplemarket",
    vendor: "database",
    name: "Amplemarket",
    short: "Amplemarket",
    kind: "Company database (filters)",
  },
];

export type ScenarioKey = "nyc" | "dfw" | "chicago" | "miami";

export const SCENARIOS: { key: ScenarioKey; label: string; short: string }[] = [
  { key: "nyc", label: "Barbershops in New York City", short: "NYC barbershops" },
  { key: "dfw", label: "HVAC contractors in Dallas–Fort Worth", short: "DFW HVAC" },
  { key: "chicago", label: "Corporate event venues in Chicago", short: "Chicago venues" },
  { key: "miami", label: "Property managers in Miami", short: "Miami property managers" },
];

/** New York State licence data: barbershops in the five boroughs. */
export const NYC_LICENSED_BARBERSHOPS = 1952;

export type Result = {
  product: string;
  scenario: ScenarioKey;
  rows: number;
  /** Wall time from the vendor's own timestamps. */
  seconds?: number;
  /** What pipe0 paid, in USD. */
  costUsd?: number;
  /** Shown next to the number when the row count needs a qualifier. */
  note?: string;
};

export const RESULTS: Result[] = [
  { product: "dataforseo", scenario: "nyc", rows: 3959, seconds: 15, costUsd: 1.47 },
  { product: "dataforseo", scenario: "dfw", rows: 2147, seconds: 3, costUsd: 0.37, note: "available; first 1,000 fetched in 3 s for $0.37" },
  { product: "dataforseo", scenario: "chicago", rows: 826, seconds: 2, costUsd: 0.31 },
  { product: "dataforseo", scenario: "miami", rows: 1180, seconds: 2, costUsd: 0.37, note: "available; first 1,000 fetched in 2 s for $0.37" },

  { product: "exa-ultra", scenario: "nyc", rows: 1932, seconds: 325, costUsd: 1.46, note: "mostly copied from the state licence registry" },
  { product: "exa-ultra", scenario: "dfw", rows: 341, seconds: 173, costUsd: 1.09 },
  { product: "exa-ultra", scenario: "chicago", rows: 146, seconds: 189, costUsd: 1.1 },
  { product: "exa-ultra", scenario: "miami", rows: 170, seconds: 336, costUsd: 1.11 },

  { product: "exa-medium", scenario: "nyc", rows: 217, seconds: 125, costUsd: 0.1 },
  { product: "exa-medium", scenario: "dfw", rows: 156, seconds: 105, costUsd: 0.1 },
  { product: "exa-medium", scenario: "chicago", rows: 81, seconds: 125, costUsd: 0.1 },
  { product: "exa-medium", scenario: "miami", rows: 100, seconds: 132, costUsd: 0.1 },

  { product: "parallel-pro", scenario: "nyc", rows: 125, seconds: 475, costUsd: 0.1 },
  { product: "parallel-pro", scenario: "dfw", rows: 17, seconds: 498, costUsd: 0.1 },
  { product: "parallel-pro", scenario: "chicago", rows: 82, seconds: 616, costUsd: 0.1 },
  { product: "parallel-pro", scenario: "miami", rows: 23, seconds: 522, costUsd: 0.1 },

  { product: "parallel-ultra", scenario: "nyc", rows: 62, seconds: 663, costUsd: 0.3 },
  { product: "parallel-ultra", scenario: "dfw", rows: 200, seconds: 830, costUsd: 0.3 },

  { product: "parallel-entity", scenario: "nyc", rows: 81, seconds: 2, costUsd: 0.005, note: "companies only: no address or phone" },
  { product: "parallel-entity", scenario: "dfw", rows: 150, seconds: 5, costUsd: 0.008, note: "companies only: no address or phone" },
  { product: "parallel-entity", scenario: "chicago", rows: 85, seconds: 3, costUsd: 0.005, note: "companies only: no address or phone" },
  { product: "parallel-entity", scenario: "miami", rows: 158, seconds: 3, costUsd: 0.008, note: "companies only: no address or phone" },

  { product: "parallel-findall", scenario: "chicago", rows: 24, seconds: 380, costUsd: 1.15, note: "every row verified" },

  { product: "crustdata", scenario: "nyc", rows: 26, note: "about 8 are NYC barbershops" },
  { product: "crustdata", scenario: "dfw", rows: 280, note: "about half are HVAC contractors" },
  { product: "crustdata", scenario: "chicago", rows: 41, note: "about 10 are venues" },
  { product: "crustdata", scenario: "miami", rows: 450, note: "about a quarter are property managers" },

  { product: "amplemarket", scenario: "nyc", rows: 26, note: "about 18 are NYC barbershops" },
  { product: "amplemarket", scenario: "chicago", rows: 100, note: "mostly real venues" },
  { product: "amplemarket", scenario: "miami", rows: 500, note: "mixed with brokerages and proptech" },
];

/** Products drawn in the rows-per-scenario chart, in this order. */
export const ROWS_CHART_PRODUCTS = [
  "dataforseo",
  "exa-ultra",
  "exa-medium",
  "parallel-pro",
  "parallel-entity",
  "crustdata",
  "amplemarket",
];

/** The time and cost charts, grouped by how the product works. */
export const RANGE_CHART_GROUPS: { label: string; products: string[] }[] = [
  { label: "Filter and company search", products: ["dataforseo", "parallel-entity"] },
  {
    label: "Prompt-based agents",
    products: ["exa-medium", "exa-ultra", "parallel-findall", "parallel-pro", "parallel-ultra"],
  },
];

export const RANGE_CHART_PRODUCTS = RANGE_CHART_GROUPS.flatMap((g) => g.products);

export function product(key: string): Product {
  const p = PRODUCTS.find((x) => x.key === key);
  if (!p) throw new Error(`Unknown benchmark product: ${key}`);
  return p;
}

export function result(productKey: string, scenario: ScenarioKey) {
  return RESULTS.find((r) => r.product === productKey && r.scenario === scenario);
}

/** Min and max of a per-run measure across a product's scenarios. */
export function range(
  productKey: string,
  measure: (r: Result) => number | undefined,
): [number, number] | undefined {
  const values = RESULTS.filter((r) => r.product === productKey)
    .map(measure)
    .filter((v): v is number => v !== undefined);
  if (values.length === 0) return undefined;
  return [Math.min(...values), Math.max(...values)];
}

/** USD per 1,000 rows for one run. */
export function costPerThousand(r: Result): number | undefined {
  if (r.costUsd === undefined || r.rows === 0) return undefined;
  // DataForSEO bills per page fetched; partial fetches price the fetched rows.
  const fetched = r.note?.startsWith("available") ? 1000 : r.rows;
  return (r.costUsd / fetched) * 1000;
}

/** DataForSEO field fill rates per scenario, in percent. */
export const DATAFORSEO_FILL: {
  scenario: ScenarioKey;
  phone: number;
  website: number;
}[] = [
  { scenario: "nyc", phone: 80, website: 37 },
  { scenario: "dfw", phone: 96, website: 75 },
  { scenario: "chicago", phone: 87, website: 83 },
  { scenario: "miami", phone: 95, website: 67 },
];

/** Share of Exa ultra's rows that DataForSEO also returned, in percent. */
export const EXA_IN_DATAFORSEO: { scenario: ScenarioKey; share: number; note?: string }[] = [
  { scenario: "miami", share: 85 },
  { scenario: "nyc", share: 66 },
  { scenario: "chicago", share: 47 },
  { scenario: "dfw", share: 42, note: "against DataForSEO's first 1,000 of 2,147 rows" },
];

/** NYC barbershops checked against the state licence list (1,952 shops). */
export const NYC_REGISTRY: {
  product: string;
  rows: number;
  /** Rows matching a licensed shop by address, when measured. */
  licensed?: number;
  note?: string;
}[] = [
  { product: "dataforseo", rows: 3959, licensed: 1459, note: "80% with a phone, all inside NYC ZIP codes" },
  { product: "exa-ultra", rows: 1932, licensed: 1715, note: "copied the licence registry; 8% with a phone" },
  { product: "exa-medium", rows: 217, note: "all inside NYC, 68% with a phone" },
  { product: "parallel-pro", rows: 125 },
  { product: "parallel-entity", rows: 81, note: "companies, no addresses" },
  { product: "parallel-ultra", rows: 62, note: "55% inside NYC" },
  { product: "amplemarket", rows: 26, note: "about 18 real" },
  { product: "crustdata", rows: 26, note: "about 8 real" },
];

/**
 * "US sustainable apparel brands with their own Shopify store". A brand
 * counts as verified when its domain serves a live Shopify /products.json.
 * Costs are pipe0 credits at list price, so the three compare directly.
 */
export const SHOPIFY = {
  rows: [
    { name: "Crustdata, Shopify technology filter", rows: 91, verified: 77, time: "seconds", cost: "13.7 credits" },
    { name: "Amplemarket, first page", rows: 50, verified: 35, time: "seconds", cost: "2 credits" },
    { name: "Exa Agent, ultra", rows: 28, verified: 26, time: "165 s", cost: "about 65 credits" },
  ],
  exaAlsoInCrustdata: 25,
  crustdataPool: 5726,
};

/**
 * Natural Products Expo West 2026 against its official exhibitor list,
 * which sits on one public directory page. The research agent is the
 * current one, which can copy a list page whole (harvest_list); "typical"
 * is its median over 9 runs, "reached the page" its one run that found the
 * full directory. Costs are pipe0 credits at list price.
 */
export const EXHIBITORS = {
  official: 3194,
  rows: [
    {
      name: "Exa Agent, ultra",
      found: 212,
      value: "212",
      sub: "about 4 min · about 63 credits · 96% precise",
    },
    {
      name: "Research agent, typical run",
      found: 45,
      value: "about 45",
      sub: "1 to 3 min · a few credits",
    },
    {
      name: "Research agent, reached the directory page",
      found: 3194,
      value: "full list",
      sub: "about 3 min · 8 credits · 1 run in 9",
    },
  ],
};

export type Fit = "best" | "good" | "mixed" | "weak" | "none" | "untested";

export const FIT_LABEL: Record<Fit, string> = {
  best: "Best pick",
  good: "Works",
  mixed: "Mixed",
  weak: "Weak",
  none: "Not built for it",
  untested: "Not tested",
};

export const FIT_COLUMNS: { key: Vendor; name: string }[] = [
  { key: "dataforseo", name: "DataForSEO" },
  { key: "exa", name: "Exa" },
  { key: "parallel", name: "Parallel" },
  { key: "database", name: "Company databases" },
];

/** Which tool to reach for, per job. Each cell cites the measurement behind it. */
export const FIT_MATRIX: {
  job: string;
  example: string;
  cells: Record<Vendor, { fit: Fit; why: string }>;
}[] = [
  {
    job: "Local businesses by category",
    example: "Barbershops in New York City",
    cells: {
      dataforseo: { fit: "best", why: "826 to 3,959 rows per city in seconds" },
      exa: { fit: "good", why: "146 to 341 rows in 3 to 6 minutes" },
      parallel: { fit: "weak", why: "17 to 200 rows in 8 to 14 minutes" },
      database: { fit: "weak", why: "26 barbershops, most of them noise" },
    },
  },
  {
    job: "Phone, hours and rating per location",
    example: "HVAC contractors to call",
    cells: {
      dataforseo: { fit: "best", why: "80 to 96% of rows with a phone" },
      exa: { fit: "mixed", why: "97% with a phone in Dallas, 8% in NYC" },
      parallel: { fit: "weak", why: "Entity Search returns no phone" },
      database: { fit: "none", why: "No phone per location" },
    },
  },
  {
    job: "Companies by firmographics or tech stack",
    example: "US apparel brands on Shopify",
    cells: {
      dataforseo: { fit: "none", why: "Only businesses with a map listing" },
      exa: { fit: "weak", why: "26 brands, 25 already in Crustdata" },
      parallel: { fit: "untested", why: "Entity Search wasn't run on this" },
      database: { fit: "best", why: "77 verified Shopify brands in seconds" },
    },
  },
  {
    job: "Lists published on the web",
    example: "Exhibitors at a trade show",
    cells: {
      dataforseo: { fit: "none", why: "No event or membership data" },
      exa: { fit: "good", why: "A few hundred accurate rows per run, never the full list" },
      parallel: { fit: "untested", why: "FindAll fits the shape; not run" },
      database: { fit: "none", why: "No exhibited-at filter" },
    },
  },
  {
    job: "One researched answer per row",
    example: "The imprint page of a small company",
    cells: {
      dataforseo: { fit: "none", why: "Not a web research tool" },
      exa: { fit: "untested", why: "Not benchmarked for this" },
      parallel: { fit: "best", why: "Task base solved 5 of 5, in 22 to 63 s" },
      database: { fit: "none", why: "Not a web research tool" },
    },
  },
];

const fmtInt = (n: number) => n.toLocaleString("en-US");
const fmtUsd = (n: number) =>
  n < 0.1 ? `$${n.toFixed(3)}` : n < 10 ? `$${n.toFixed(2)}` : `$${n.toFixed(0)}`;
const fmtSeconds = (s: number) =>
  s < 90 ? `${s} s` : `${(s / 60).toFixed(1).replace(/\.0$/, "")} min`;

/** "1.8–2.2 min", "$0.46–1.23": the shared unit printed once. */
export function formatRange(
  [min, max]: [number, number],
  fmt: (n: number) => string,
): string {
  const [a, b] = [fmt(min), fmt(max)];
  if (a === b) return a;
  const unit = (v: string) => v.match(/ \D+$/)?.[0] ?? "";
  if (a.startsWith("$") && b.startsWith("$")) return `${a}–${b.slice(1)}`;
  if (unit(a) && unit(a) === unit(b)) return `${a.slice(0, -unit(a).length)}–${b}`;
  return `${a} – ${b}`;
}

export const format = { int: fmtInt, usd: fmtUsd, seconds: fmtSeconds };

export type ChartName =
  | "rows"
  | "time"
  | "cost"
  | "nyc"
  | "fill"
  | "overlap"
  | "shopify"
  | "exhibitors"
  | "fit";

/**
 * Each chart as a markdown table, for the .md twin answer engines read.
 * The page renders the same numbers as a chart.
 */
export function listBenchmarkMarkdown(chart: ChartName): string {
  switch (chart) {
    case "rows":
      return [
        `Unique rows returned per scenario (pipe0 benchmark, ${LIST_BENCHMARK_PERIOD}).`,
        "",
        `| Product | ${SCENARIOS.map((s) => s.short).join(" | ")} |`,
        `| --- | ${SCENARIOS.map(() => "---").join(" | ")} |`,
        ...ROWS_CHART_PRODUCTS.map((key) => {
          const cells = SCENARIOS.map((s) => {
            const r = result(key, s.key);
            return r ? fmtInt(r.rows) : "–";
          });
          return `| ${product(key).name} | ${cells.join(" | ")} |`;
        }),
      ].join("\n");
    case "time":
      return [
        "Time per run, from the vendor's own timestamps.",
        "",
        "| Product | Time per run |",
        "| --- | --- |",
        ...RANGE_CHART_PRODUCTS.map((key) => {
          const r = range(key, (x) => x.seconds);
          return `| ${product(key).name} | ${r ? formatRange(r, fmtSeconds) : "–"} |`;
        }),
      ].join("\n");
    case "cost":
      return [
        "What pipe0 paid per 1,000 rows, before margin.",
        "",
        "| Product | USD per 1,000 rows |",
        "| --- | --- |",
        ...RANGE_CHART_PRODUCTS.map((key) => {
          const r = range(key, costPerThousand);
          return `| ${product(key).name} | ${r ? formatRange(r, fmtUsd) : "–"} |`;
        }),
      ].join("\n");
    case "nyc":
      return [
        `NYC barbershops against New York State's licence list of ${fmtInt(NYC_LICENSED_BARBERSHOPS)} shops.`,
        "",
        "| Product | Rows | Matching a licensed shop | Note |",
        "| --- | --- | --- | --- |",
        ...NYC_REGISTRY.map(
          (r) =>
            `| ${product(r.product).name} | ${fmtInt(r.rows)} | ${r.licensed !== undefined ? fmtInt(r.licensed) : "–"} | ${r.note ?? ""} |`,
        ),
      ].join("\n");
    case "fill":
      return [
        "DataForSEO rows with a phone number and a website, per scenario.",
        "",
        "| Scenario | Phone | Website |",
        "| --- | --- | --- |",
        ...DATAFORSEO_FILL.map(
          (f) =>
            `| ${SCENARIOS.find((s) => s.key === f.scenario)!.label} | ${f.phone}% | ${f.website}% |`,
        ),
      ].join("\n");
    case "overlap":
      return [
        "Share of Exa ultra's rows that DataForSEO also returned.",
        "",
        "| Scenario | Also in DataForSEO |",
        "| --- | --- |",
        ...EXA_IN_DATAFORSEO.map(
          (o) =>
            `| ${SCENARIOS.find((s) => s.key === o.scenario)!.label} | ${o.share}%${o.note ? ` (${o.note})` : ""} |`,
        ),
      ].join("\n");
    case "shopify":
      return [
        "US sustainable apparel brands with their own Shopify store. Verified means the domain serves a live Shopify store.",
        "",
        "| Search | Rows | Verified Shopify brands | Time | Cost |",
        "| --- | --- | --- | --- | --- |",
        ...SHOPIFY.rows.map(
          (r) => `| ${r.name} | ${r.rows} | ${r.verified} | ${r.time} | ${r.cost} |`,
        ),
        "",
        `Crustdata already held ${SHOPIFY.exaAlsoInCrustdata} of the 26 brands Exa verified.`,
      ].join("\n");
    case "exhibitors":
      return [
        `Exhibitors at Natural Products Expo West 2026, against the official list of ${fmtInt(EXHIBITORS.official)}, which is public on one directory page.`,
        "",
        "| Search | Exhibitors found | Share of official list | Time and cost |",
        "| --- | --- | --- | --- |",
        ...EXHIBITORS.rows.map(
          (r) =>
            `| ${r.name} | ${r.value} | ${Math.min((r.found / EXHIBITORS.official) * 100, 100).toFixed(1)}% | ${r.sub} |`,
        ),
      ].join("\n");
    case "fit":
      return [
        "Which tool to use for which list-building job, from the benchmark.",
        "",
        `| Job | ${FIT_COLUMNS.map((c) => c.name).join(" | ")} |`,
        `| --- | ${FIT_COLUMNS.map(() => "---").join(" | ")} |`,
        ...FIT_MATRIX.map(
          (row) =>
            `| ${row.job} (e.g. ${row.example.toLowerCase()}) | ${FIT_COLUMNS.map(
              (c) => `${FIT_LABEL[row.cells[c.key].fit]}: ${row.cells[c.key].why}`,
            ).join(" | ")} |`,
        ),
      ].join("\n");
  }
}
