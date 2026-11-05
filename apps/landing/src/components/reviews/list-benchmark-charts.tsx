import { barSkin, Cross } from "@/components/grid";
import { cn } from "@/lib/utils";
import { Check, CircleDashed, TriangleAlert, X } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import {
  costPerThousand,
  DATAFORSEO_FILL,
  EXA_IN_DATAFORSEO,
  EXHIBITORS,
  FIT_COLUMNS,
  FIT_LABEL,
  FIT_MATRIX,
  format,
  formatRange,
  LIST_BENCHMARK_PERIOD,
  NYC_LICENSED_BARBERSHOPS,
  NYC_REGISTRY,
  product,
  RANGE_CHART_GROUPS,
  range,
  result,
  ROWS_CHART_PRODUCTS,
  SCENARIOS,
  SHOPIFY,
  type ChartName,
  type Fit,
  type Vendor,
} from "./list-benchmark";

/**
 * The list-building benchmark as charts, for use in review MDX:
 * `<ListBenchmark chart="rows" highlight="exa" />`.
 *
 * Drawn in the landing page's line-grid language (components/grid.tsx): a
 * square frame with registration crosses, a header band, and sections laid
 * out as cells that share 1px walls. Bars sit in bordered wells and use the
 * landing's glossy skins: indigo for the reviewed vendor, amber for what it
 * is compared against. Every bar prints its value, so nothing depends on
 * colour alone. The .md twin swaps each tag for the same numbers as a table.
 */
export function ListBenchmark({
  chart,
  highlight,
}: {
  chart: ChartName;
  highlight?: Vendor;
}) {
  switch (chart) {
    case "rows":
      return <RowsChart highlight={highlight} />;
    case "time":
      return <TimeChart highlight={highlight} />;
    case "cost":
      return <CostChart highlight={highlight} />;
    case "nyc":
      return <NycChart highlight={highlight} />;
    case "fill":
      return <FillChart />;
    case "overlap":
      return <OverlapChart />;
    case "shopify":
      return <ShopifyChart />;
    case "exhibitors":
      return <ExhibitorsChart />;
    case "fit":
      return <FitMatrix highlight={highlight} />;
  }
}

/* ---- Frame ---------------------------------------------------------- */

/**
 * The figure: a square frame with crosses on its corners, a header band
 * (title, one line of method, the period on the right), the body, and an
 * optional legend and note band on the well colour.
 */
export function Frame({
  title,
  caption,
  period = LIST_BENCHMARK_PERIOD,
  legend,
  note,
  children,
}: {
  title: string;
  /** How to read the chart, when the bars alone don't say; printed in the note band. */
  caption?: ReactNode;
  /** When the runs happened, shown on the right of the header band. */
  period?: string;
  legend?: ReactNode;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-10">
      <div className="relative border border-[var(--rule)] bg-fd-background">
        <Cross className="-left-[6px] -top-[6px]" />
        <Cross className="-right-[6px] -top-[6px]" />
        <Cross className="-bottom-[6px] -left-[6px]" />
        <Cross className="-bottom-[6px] -right-[6px]" />

        <figcaption className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 border-b border-[var(--rule)] px-4 py-4 sm:px-5">
          <div className="min-w-0 flex-1 basis-[22rem]">
            <p className="text-[16px] font-medium leading-snug tracking-[-0.01em] text-fd-foreground">
              {title}
            </p>
          </div>
          <span className="text-[12.5px] text-fd-muted-foreground">
            {period}
          </span>
        </figcaption>

        {children}

        {(legend || caption || note) && (
          <div className="space-y-1.5 border-t border-[var(--rule)] bg-[var(--well)] px-4 py-3 sm:px-5">
            {legend && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-fd-muted-foreground">
                {legend}
              </div>
            )}
            {(caption || note) && (
              <p className="text-[12.5px] leading-snug text-fd-muted-foreground text-pretty">
                {caption}
                {caption && note && " "}
                {note}
              </p>
            )}
          </div>
        )}
      </div>
    </figure>
  );
}

/** Sections that share 1px walls: two columns from `sm`, stacked below. */
export function Cells({
  children,
  columns = 1,
}: {
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <div
      className={cn(
        "grid gap-px bg-[var(--rule)]",
        columns === 2 && "sm:grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}

/** One section: a small heading row, then its bars. */
export function Cell({
  heading,
  aside,
  children,
}: {
  heading?: string;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 bg-fd-background px-4 py-4 sm:px-5">
      {heading && (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[13px] font-medium text-fd-foreground">{heading}</p>
          {aside && (
            <p className="text-right text-[12px] text-fd-muted-foreground">
              {aside}
            </p>
          )}
        </div>
      )}
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

/* ---- Bars ----------------------------------------------------------- */

type Skin = "win" | "lose" | "faint";

const skins: Record<Skin, CSSProperties> = {
  win: barSkin.win,
  lose: barSkin.lose,
  // The unmatched remainder of a two-tone bar: the indigo skin, washed out.
  faint: { ...barSkin.win, opacity: 0.28, boxShadow: "none" },
};

/*
 * Label, track, value. Every column is fixed, so all tracks in a cell share
 * one length and reference lines (10 minutes, the licence count) line up
 * from row to row.
 */
const COMPACT_COLUMNS = "grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.25rem]";
const WIDE_COLUMNS =
  "grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_5.75rem] sm:grid-cols-[13rem_minmax(0,1fr)_6.5rem]";

/** Label, a bordered well with its fills, and the value in a fixed column. */
export function Row({
  label,
  sub,
  strong,
  value,
  valueSub,
  title,
  wide,
  children,
}: {
  label: string;
  sub?: string;
  strong?: boolean;
  value: ReactNode;
  valueSub?: string;
  title: string;
  /** A wider label column, for charts with one column of cells. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      title={title}
      className={cn(
        "grid items-center gap-x-3",
        wide ? WIDE_COLUMNS : COMPACT_COLUMNS,
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            "text-[13px] leading-tight",
            strong ? "font-medium text-fd-foreground" : "text-fd-muted-foreground",
          )}
        >
          {label}
        </p>
        {sub && (
          <p className="mt-0.5 text-[11.5px] leading-tight text-fd-muted-foreground">
            {sub}
          </p>
        )}
      </div>
      <div className="relative h-3 min-w-0 rounded-[3px] border border-[var(--rule)] bg-[var(--well)]">
        {children}
      </div>
      <div className="text-right leading-tight">
        <span
          className={cn(
            "whitespace-nowrap text-[13px] tabular-nums",
            strong ? "font-medium text-fd-foreground" : "text-fd-muted-foreground",
          )}
        >
          {value}
        </span>
        {valueSub && (
          <span className="block whitespace-nowrap text-[11px] tabular-nums text-fd-muted-foreground">
            {valueSub}
          </span>
        )}
      </div>
    </div>
  );
}

/** A fill from `from` to `to`, as shares of the track (0 to 1). */
export function Fill({
  from = 0,
  to,
  skin,
  min = "4px",
}: {
  from?: number;
  to: number;
  skin: Skin;
  min?: string;
}) {
  return (
    <span
      className="absolute -inset-y-px rounded-[3px]"
      style={{
        left: `calc(${from * 100}% - 1px)`,
        width: `max(calc(${(to - from) * 100}% + 2px), ${min})`,
        ...skins[skin],
      }}
    />
  );
}

/** A vertical reference line across a track, e.g. a licence count. */
function Marker({ at }: { at: number }) {
  return (
    <span
      aria-hidden
      className="absolute -inset-y-1 z-10 w-px bg-fd-foreground/55"
      style={{ left: `${at * 100}%` }}
    />
  );
}

export function Swatch({ skin, children }: { skin: Skin; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className="inline-block h-2.5 w-4 rounded-[2px]"
        style={skins[skin]}
      />
      {children}
    </span>
  );
}

const isSelf = (key: string, highlight?: Vendor) =>
  highlight !== undefined && product(key).vendor === highlight;

const skinFor = (key: string, highlight?: Vendor): Skin =>
  !highlight || isSelf(key, highlight) ? "win" : "lose";

function vendorLegend(highlight?: Vendor) {
  if (!highlight) return undefined;
  const name =
    FIT_COLUMNS.find((c) => c.key === highlight)?.name ?? "This vendor";
  return (
    <>
      <Swatch skin="win">{name}</Swatch>
      <Swatch skin="lose">Compared tools</Swatch>
    </>
  );
}

/* ---- Charts --------------------------------------------------------- */

function RowsChart({ highlight }: { highlight?: Vendor }) {
  const max = Math.max(
    ...ROWS_CHART_PRODUCTS.flatMap((key) =>
      SCENARIOS.map((s) => result(key, s.key)?.rows ?? 0),
    ),
  );
  return (
    <Frame
      title="How many businesses each tool finds"
      caption="All four panels share one scale."
      legend={vendorLegend(highlight)}
      note="Company databases count every row they returned; most were neighbouring businesses such as suppliers, software and planners."
    >
      <Cells columns={2}>
        {SCENARIOS.map((s) => (
          <Cell key={s.key} heading={s.label}>
            {ROWS_CHART_PRODUCTS.map((key) => {
              const r = result(key, s.key);
              if (!r) return null;
              return (
                <Row
                  key={key}
                  label={product(key).short}
                  strong={isSelf(key, highlight)}
                  value={format.int(r.rows)}
                  title={`${product(key).name}: ${format.int(r.rows)} rows${r.note ? ` (${r.note})` : ""}`}
                >
                  <Fill to={r.rows / max} skin={skinFor(key, highlight)} />
                </Row>
              );
            })}
          </Cell>
        ))}
      </Cells>
    </Frame>
  );
}

/** Time and cost: min-to-max spans per product, grouped by how it works. */
function RangeChart({
  title,
  caption,
  note,
  highlight,
  measure,
  scale,
  label,
  ticks,
  marker,
}: {
  title: string;
  caption: string;
  note: string;
  highlight?: Vendor;
  measure: Parameters<typeof range>[1];
  scale: (v: number) => number;
  label: (span: [number, number]) => string;
  ticks: { at: number; label: string }[];
  marker?: number;
}) {
  return (
    <Frame
      title={title}
      caption={caption}
      legend={vendorLegend(highlight)}
      note={note}
    >
      <Cells>
        {RANGE_CHART_GROUPS.map((group, i) => (
          <Cell key={group.label} heading={group.label}>
            {group.products.map((key) => {
              const span = range(key, measure);
              if (!span) return null;
              return (
                <Row
                  key={key}
                  wide
                  label={product(key).short}
                  sub={product(key).kind}
                  strong={isSelf(key, highlight)}
                  value={label(span)}
                  title={`${product(key).name}: ${label(span)}`}
                >
                  {marker !== undefined && <Marker at={marker} />}
                  <Fill
                    from={scale(span[0])}
                    to={scale(span[1])}
                    skin={skinFor(key, highlight)}
                    min="10px"
                  />
                </Row>
              );
            })}
            {i === RANGE_CHART_GROUPS.length - 1 && (
              <Axis ticks={ticks} marker={marker} />
            )}
          </Cell>
        ))}
      </Cells>
    </Frame>
  );
}

/** Tick labels under the track column, aligned with the wide rows. */
function Axis({
  ticks,
  marker,
}: {
  ticks: { at: number; label: string }[];
  marker?: number;
}) {
  return (
    <div className={cn("grid gap-x-3", WIDE_COLUMNS)}>
      <span />
      <div className="relative h-4">
        {ticks.map((t) => (
          <span
            key={t.label}
            className={cn(
              "absolute top-0 whitespace-nowrap font-mono text-[10.5px] tabular-nums",
              t.at === marker ? "text-fd-foreground" : "text-fd-muted-foreground",
              t.at === 0 ? "" : t.at === 1 ? "-translate-x-full" : "-translate-x-1/2",
            )}
            style={{ left: `${t.at * 100}%` }}
          >
            {t.label}
          </span>
        ))}
      </div>
      <span />
    </div>
  );
}

function TimeChart({ highlight }: { highlight?: Vendor }) {
  const MAX = 900;
  return (
    <RangeChart
      title="How long a list takes"
      caption="Each bar spans the fastest and the slowest list."
      note="The line marks 10 minutes. Past it, a run doesn't fit an interactive workflow or the step limit most automation tools set."
      highlight={highlight}
      measure={(r) => r.seconds}
      scale={(s) => Math.min(s / MAX, 1)}
      label={(span) => formatRange(span, format.seconds)}
      marker={600 / MAX}
      ticks={[
        { at: 0, label: "0" },
        { at: 300 / MAX, label: "5 min" },
        { at: 600 / MAX, label: "10 min" },
        { at: 1, label: "15 min" },
      ]}
    />
  );
}

function CostChart({ highlight }: { highlight?: Vendor }) {
  // Log scale from 1 cent to $100 per 1,000 rows: four decades.
  const scale = (usd: number) =>
    Math.min(Math.max((Math.log10(usd) + 2) / 4, 0), 1);
  return (
    <RangeChart
      title="What 1,000 rows cost"
      caption="Vendor prices before any reseller margin, on a log scale."
      note="Per-run pricing makes a short list expensive per row. Parallel Entity is the cheapest per row, but its rows are company profiles without an address or a phone."
      highlight={highlight}
      measure={costPerThousand}
      scale={scale}
      label={(span) => formatRange(span, format.usd)}
      ticks={[
        { at: 0, label: "$0.01" },
        { at: 0.25, label: "$0.10" },
        { at: 0.5, label: "$1" },
        { at: 0.75, label: "$10" },
        { at: 1, label: "$100" },
      ]}
    />
  );
}

function NycChart({ highlight }: { highlight?: Vendor }) {
  const max = Math.max(...NYC_REGISTRY.map((r) => r.rows));
  const line = NYC_LICENSED_BARBERSHOPS / max;
  const row = (r: (typeof NYC_REGISTRY)[number]) => (
    <Row
      key={r.product}
      wide
      label={product(r.product).short}
      sub={r.note}
      strong={isSelf(r.product, highlight)}
      value={format.int(r.rows)}
      valueSub={r.licensed !== undefined ? `${format.int(r.licensed)} licensed` : undefined}
      title={`${product(r.product).name}: ${format.int(r.rows)} rows${r.licensed !== undefined ? `, ${format.int(r.licensed)} matching a licensed shop` : ""}`}
    >
      <Marker at={line} />
      {r.licensed !== undefined ? (
        <>
          <Fill to={r.rows / max} skin="faint" />
          <Fill to={r.licensed / max} skin="win" />
        </>
      ) : (
        <Fill to={r.rows / max} skin={skinFor(r.product, highlight)} />
      )}
    </Row>
  );
  return (
    <Frame
      title="New York City barbershops against the licence list"
      caption={`The line marks the ${format.int(NYC_LICENSED_BARBERSHOPS)} barbershops New York State licenses in the city.`}
      legend={
        <>
          <Swatch skin="win">Matches a licensed shop</Swatch>
          <Swatch skin="faint">Other rows</Swatch>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-3 w-px bg-fd-foreground/55" />
            {format.int(NYC_LICENSED_BARBERSHOPS)} licensed shops
          </span>
        </>
      }
      note="A list can pass the licence count: unlicensed shops, salons that also cut hair, and permanently closed listings, which DataForSEO flags."
    >
      <Cells>
        <Cell heading="Checked against the licence list" aside="matched by address">
          {NYC_REGISTRY.filter((r) => r.licensed !== undefined).map(row)}
        </Cell>
        <Cell heading="Not checked" aside="row count only">
          {NYC_REGISTRY.filter((r) => r.licensed === undefined).map(row)}
        </Cell>
      </Cells>
    </Frame>
  );
}

function FillChart() {
  return (
    <Frame
      title="DataForSEO rows ready to call or visit"
      note="94% of NYC records and 98% of Dallas records had been updated in 2026. Each row also carries rating, review count, opening hours and whether the owner claimed the listing."
    >
      <Cells columns={2}>
        {DATAFORSEO_FILL.map((f) => {
          const s = SCENARIOS.find((x) => x.key === f.scenario)!;
          return (
            <Cell key={f.scenario} heading={s.label}>
              <Row label="Phone" strong value={`${f.phone}%`} title={`${s.short}: ${f.phone}% with a phone`}>
                <Fill to={f.phone / 100} skin="win" />
              </Row>
              <Row label="Website" strong value={`${f.website}%`} title={`${s.short}: ${f.website}% with a website`}>
                <Fill to={f.website / 100} skin="win" />
              </Row>
            </Cell>
          );
        })}
      </Cells>
    </Frame>
  );
}

function OverlapChart() {
  return (
    <Frame
      title="How much of Exa's list DataForSEO already had"
      caption="The rest are businesses DataForSEO missed, or rows just outside its radius or category."
    >
      <Cells>
        <Cell heading="Exa rows also in DataForSEO">
          {EXA_IN_DATAFORSEO.map((o) => {
            const s = SCENARIOS.find((x) => x.key === o.scenario)!;
            return (
              <Row
                key={o.scenario}
                wide
                label={s.short}
                sub={o.note}
                strong
                value={`${o.share}%`}
                title={`${s.label}: ${o.share}% of Exa's rows also in DataForSEO`}
              >
                <Fill to={o.share / 100} skin="win" />
              </Row>
            );
          })}
        </Cell>
      </Cells>
    </Frame>
  );
}

function ShopifyChart() {
  const max = Math.max(...SHOPIFY.rows.map((r) => r.rows));
  return (
    <Frame
      title="Online brands: a filter beats a prompt"
      caption="Query: “US sustainable apparel brands with their own Shopify store.” Verified means the domain serves a live Shopify store."
      legend={
        <>
          <Swatch skin="win">Verified Shopify brands</Swatch>
          <Swatch skin="faint">Other rows</Swatch>
        </>
      }
      note={`Crustdata already held ${SHOPIFY.exaAlsoInCrustdata} of the 26 brands Exa verified, and lists ${format.int(SHOPIFY.crustdataPool)} US apparel companies with Shopify detected.`}
    >
      <Cells>
        <Cell heading="Verified brands per search" aside="cost in pipe0 credits">
          {SHOPIFY.rows.map((r) => (
            <Row
              key={r.name}
              wide
              label={r.name}
              sub={`${r.time} · ${r.cost}`}
              strong={r.name.startsWith("Exa")}
              value={`${r.verified} / ${r.rows}`}
              title={`${r.name}: ${r.verified} verified of ${r.rows} rows`}
            >
              <Fill to={r.rows / max} skin="faint" />
              <Fill to={r.verified / max} skin="win" />
            </Row>
          ))}
        </Cell>
      </Cells>
    </Frame>
  );
}

function ExhibitorsChart() {
  return (
    <Frame
      title="A public directory: how much of it each tool returns"
      caption={`Each track is the full official list of ${format.int(EXHIBITORS.official)} Natural Products Expo West 2026 exhibitors.`}
      legend={
        <>
          <Swatch skin="win">Exa</Swatch>
          <Swatch skin="lose">Research agent with list reading</Swatch>
        </>
      }
      note="An agent that writes every row itself tops out at a few hundred. Copying the whole list needs a tool that reads the directory page directly, and finding that page is the hard part."
    >
      <Cells>
        <Cell heading="Exhibitors returned" aside="share of the official list">
          {EXHIBITORS.rows.map((r) => {
            const share = Math.min(r.found / EXHIBITORS.official, 1);
            const self = r.name.startsWith("Exa");
            return (
              <Row
                key={r.name}
                wide
                label={r.name}
                sub={r.sub}
                strong={self}
                value={r.value}
                valueSub={`${(share * 100).toFixed(share < 0.1 ? 1 : 0)}%`}
                title={`${r.name}: ${r.value} of ${format.int(EXHIBITORS.official)} exhibitors`}
              >
                <Fill to={share} skin={self ? "win" : "lose"} />
              </Row>
            );
          })}
        </Cell>
      </Cells>
    </Frame>
  );
}

/* ---- Fit matrix ----------------------------------------------------- */

const FIT_STYLE: Record<Fit, { icon: ReactNode; className: string }> = {
  best: {
    icon: <Check aria-hidden className="size-3" />,
    className: "border-emerald-600/25 bg-emerald-50 text-emerald-800",
  },
  good: {
    icon: <Check aria-hidden className="size-3" />,
    className: "border-[var(--rule-strong)] bg-fd-background text-fd-foreground",
  },
  mixed: {
    icon: <TriangleAlert aria-hidden className="size-3" />,
    className: "border-amber-600/25 bg-amber-50 text-amber-800",
  },
  weak: {
    icon: <TriangleAlert aria-hidden className="size-3" />,
    className: "border-amber-600/25 bg-amber-50 text-amber-800",
  },
  none: {
    icon: <X aria-hidden className="size-3" />,
    className: "border-[var(--rule)] text-fd-muted-foreground",
  },
  untested: {
    icon: <CircleDashed aria-hidden className="size-3" />,
    className: "border-dashed border-[var(--rule-strong)] text-fd-muted-foreground",
  },
};

function FitMatrix({ highlight }: { highlight?: Vendor }) {
  return (
    <Frame
      title="Which tool for which list"
      caption="Company databases are Crustdata and Amplemarket, searched with their filters."
      note="One run per scenario. “Not tested” means we didn't measure it, not that it fails."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-[var(--well)] text-[12px] text-fd-muted-foreground">
              <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">
                Job
              </th>
              {FIT_COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "border-l border-[var(--rule)] px-3 py-2.5 font-medium",
                    c.key === highlight && "text-fd-foreground",
                  )}
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIT_MATRIX.map((row) => (
              <tr key={row.job} className="border-t border-[var(--rule)] align-top">
                <th scope="row" className="px-4 py-3 font-medium text-fd-foreground sm:px-5">
                  {row.job}
                </th>
                {FIT_COLUMNS.map((c) => {
                  const cell = row.cells[c.key];
                  const style = FIT_STYLE[cell.fit];
                  return (
                    <td
                      key={c.key}
                      className={cn(
                        "border-l border-[var(--rule)] px-3 py-3",
                        c.key === highlight && "bg-fd-primary/[0.035]",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-[4px] border px-1.5 py-0.5 text-[11.5px] font-medium",
                          style.className,
                        )}
                      >
                        {style.icon}
                        {FIT_LABEL[cell.fit]}
                      </span>
                      <span className="mt-1.5 block text-[12px] leading-snug text-fd-muted-foreground">
                        {cell.why}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}
