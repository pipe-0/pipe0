import { AskAiButton } from "@/components/ai/ask-ai-button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  CtaPanel,
  Section,
  SectionHeading,
} from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/metadata";
import { JsonLd, softwareApplicationJsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";
import { providerCatalog } from "@pipe0/base";
import Link from "next/link";

const description =
  "One API for people and company data: search across multiple datasets, then compose 50+ providers into waterfalls that only bill what answers. Built to sit inside your own CRM, ATS or product.";

export const metadata = createMetadata({
  title: "Enrichment & Search API",
  description,
  path: "/enrichment-api",
});

/* Numbers this page leans on. Coverage is the argument, so it leads. */
const stats = [
  {
    figure: "1B+",
    label: "profiles reachable",
    note: "across every dataset the API can query",
  },
  {
    figure: "50+",
    label: "providers behind one call",
    note: "curated, not chained — see the waterfall below",
  },
  {
    figure: "100+",
    label: "enrichments and searches",
    note: "people, companies, email, phone, web, AI",
  },
];

/* Real marks from the provider catalog — the same source the docs use. */
const marqueeRow = [
  "openai",
  "anthropic",
  "crustdata",
  "amplemarket",
  "prospeo",
  "hunter",
  "exa",
  "firecrawl",
  "perplexity",
  "googlemaps",
  "gemini",
  "postgres",
] as const;

function ProviderTile({ id }: { id: string }) {
  const provider = providerCatalog[id as keyof typeof providerCatalog];
  if (!provider?.logoUrl) return null;
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-[12px] border border-border bg-background">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={provider.logoUrl}
        alt={provider.label}
        loading="lazy"
        className="size-6 object-contain"
      />
    </span>
  );
}

/* Two primitives, shown as the calls you actually write. */
const primitives = [
  {
    name: "Searches",
    tagline: "Create records you do not have yet.",
    body: "One query runs across multiple datasets at once instead of one provider at a time — people, companies, job posts, channel members, calendar guests.",
    href: "/docs/search-catalog",
    linkLabel: "Search catalog",
    code: (
      <>
        <span className="text-[#2c37a4]">await</span> pipe0.search.run({"{"}
        {"\n"}  search_id:{" "}
        <span className="text-emerald-700">&quot;people:profiles@3&quot;</span>,
        {"\n"}  payload: {"{"} title:{" "}
        <span className="text-emerald-700">&quot;VP of Sales&quot;</span>,
        location: <span className="text-emerald-700">&quot;DACH&quot;</span> {"}"},
        {"\n"}
        {"}"});
      </>
    ),
  },
  {
    name: "Pipes",
    tagline: "Add properties to records you already have.",
    body: "Stack enrichments, actions and conditions into one composed call. Verification, company data, CRM writes and AI steps are all just pipes.",
    href: "/docs/pipe-catalog",
    linkLabel: "Pipe catalog",
    code: (
      <>
        <span className="text-[#2c37a4]">await</span> pipe0.pipes.run({"{"}
        {"\n"}  pipes: [{"\n"}    {"{"} pipe_id:{" "}
        <span className="text-emerald-700">
          &quot;person:workemail:waterfall@1&quot;
        </span>{" "}
        {"}"},{"\n"}    {"{"} pipe_id:{" "}
        <span className="text-emerald-700">&quot;company:overview@3&quot;</span>{" "}
        {"}"},{"\n"}  ],{"\n"}  input: rows,{"\n"}
        {"}"});
      </>
    ),
  },
];

const docsLinks = [
  {
    href: "/docs",
    title: "Quickstart",
    body: "First authenticated call in a few minutes.",
  },
  {
    href: "/docs/api",
    title: "API reference",
    body: "Every endpoint, generated from the OpenAPI spec.",
  },
  {
    href: "/docs/sdks/typescript-client",
    title: "TypeScript SDK",
    body: "Typed client for pipes, searches and sheets.",
  },
  {
    href: "/docs/sdks/mcp",
    title: "MCP server",
    body: "The same engine, reachable from your agents.",
  },
];

export default function EnrichmentApiPage() {
  return (
    <div className="landing min-h-screen bg-background">
      <JsonLd data={softwareApplicationJsonLd({ description })} />
      <Header page="api" />

      {/* ===== Hero — same shape as the homepage: copy at the shared
              container width, then a wider panel. ===== */}
      <div>
        <Section className="py-[clamp(20px,3.2svh,38px)]">
          <SectionHeading
            as="h1"
            title="Enrichment and search API."
            subtitle="Composable enough to sit underneath a CRM."
          />
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/docs">
              <Button variant="cta" size="xl">
                Read the docs
              </Button>
            </Link>
            <Link href="/docs/pipe-catalog">
              <Button variant="ctaOutline" size="xl">
                Browse the catalog
              </Button>
            </Link>
          </div>
        </Section>

        <section className="mx-auto w-full max-w-[1750px] px-4 sm:px-7">
          <div className="hero-panel border relative flex min-h-[calc(min(100vw-3.5rem,1694px)/2.4)] w-full flex-col justify-center overflow-hidden rounded-[18px] px-5 py-10 sm:px-10">
            <div className="hero-sky pointer-events-none absolute inset-0 z-0" aria-hidden />
            <div className="relative z-10 mx-auto w-full max-w-[820px] overflow-hidden rounded-[12px] border border-[#1c2333]/10 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.06),0_24px_60px_rgba(18,24,74,0.28)]">
              <div className="flex items-center gap-1.5 border-b border-[#1c2333]/8 bg-[#f7f9fc] px-3.5 py-2.5">
                <span className="size-2.5 rounded-full bg-[#1c2333]/15" />
                <span className="size-2.5 rounded-full bg-[#1c2333]/15" />
                <span className="size-2.5 rounded-full bg-[#1c2333]/15" />
                <span className="ml-2 text-[11px] font-medium text-[#5b6478]">
                  enrich.ts
                </span>
              </div>
              <pre className="overflow-x-auto px-5 py-4 font-mono text-[11px] leading-relaxed text-[#2b3350] sm:text-[13.5px]">
                <code>{primitives[1].code}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>

      {/* ===== Coverage — the argument for this product ===== */}
      <Section className="pt-16 sm:pt-24">
        <div className="grid gap-10 border-t border-border pt-12 sm:grid-cols-3 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.figure}>
              <div className="text-[clamp(38px,4.4vw,54px)] font-semibold leading-none tracking-[-0.03em] text-foreground">
                {stat.figure}
              </div>
              <div className="mt-3 text-[15px] font-medium text-foreground">
                {stat.label}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Two primitives ===== */}
      <Section className="pt-20 sm:pt-28">
        <SectionHeading
          title="Two primitives. Everything else composes."
          subtitle="Searches create records. Pipes add properties to them. Every workflow on pipe0 is those two, arranged."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {primitives.map((p) => (
            <div
              key={p.name}
              className="flex flex-col overflow-hidden rounded-[18px] border border-[var(--panel-edge)] bg-[var(--panel)]"
            >
              <div className="px-6 pt-6 sm:px-8 sm:pt-8">
                <h3 className="text-[17px] font-medium text-foreground">
                  {p.name}
                </h3>
                <p className="mt-1 text-[15px] text-muted-foreground">
                  {p.tagline}
                </p>
                <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
              <div className="mt-6 px-6 sm:px-8">
                <div className="overflow-hidden rounded-[12px] border border-[#1c2333]/10 bg-white">
                  <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[11px] leading-relaxed text-[#2b3350] sm:text-[12px]">
                    <code>{p.code}</code>
                  </pre>
                </div>
              </div>
              <div className="mt-auto px-6 py-5 sm:px-8">
                <Link
                  href={p.href}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {p.linkLabel} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Waterfalls and providers ===== */}
      <Section className="pt-20 sm:pt-28">
        <SectionHeading
          title="Curation, not chaining."
          subtitle="We only add providers when they contribute enrichment-coverage. Waterfalls stay short, fast, and reliable."
        />
        <div className="mt-10 overflow-hidden rounded-[18px] border border-[var(--panel-edge)] bg-[var(--panel)] px-6 py-10 sm:px-10">
          <div className="flex flex-wrap justify-center gap-3">
            {marqueeRow.map((id) => (
              <ProviderTile key={id} id={id} />
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-[560px] text-center text-sm leading-relaxed text-muted-foreground">
            Bring your own keys on any plan, or use pipe0&rsquo;s negotiated
            rates. Either way the composition, retries, and billing are one call.
          </p>
        </div>
      </Section>

      {/* ===== Who builds on it ===== */}
      <Section className="pt-20 sm:pt-28">
        <SectionHeading
          title="Built to sit under someone else's product."
          subtitle="CRMs, ATSs, sequencers and sales tools use the API to add Clay-like enrichment inside their own interface."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            {
              title: "CRM builders",
              body: "Keep records current: enrich on create, re-verify on a schedule, write back through the same call.",
            },
            {
              title: "ATS builders",
              body: "Resolve candidates to work emails and phone numbers, and enrich the companies behind them.",
            },
            {
              title: "Sales tools",
              body: "Offer waterfall enrichment as a feature of your own product, billed per result that lands.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-[18px] border border-[var(--panel-edge)] bg-[var(--panel)] px-6 py-7"
            >
              <h3 className="text-[16px] font-medium text-foreground">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Docs ===== */}
      <Section className="pt-20 sm:pt-28">
        <SectionHeading
          title="Start in the docs."
          subtitle="Everything here is documented, versioned and typed."
        />
        {/* A divided list, not the measures pattern used for the interface
            tabs — a rule over a label reads as "selectable", and these are
            plain links. Rows with a title, a line and an arrow say navigation. */}
        <div className="mt-10 overflow-hidden rounded-[18px] border border-[var(--panel-edge)] bg-[var(--panel)]">
          {docsLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "group flex items-center gap-5 px-6 py-5 transition-colors hover:bg-background/70 sm:px-8",
                i > 0 && "border-t border-[var(--panel-edge)]",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-medium text-foreground">
                  {l.title}
                </span>
                <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                  {l.body}
                </span>
              </span>
              <span
                aria-hidden
                className="shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
              >
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-20 sm:pt-28">
        <CtaPanel
          title="Build on it for free."
          note="The first 20 credits are on us. No credit card required."
        />
      </Section>

      <Footer />
      <AskAiButton bound="1750px" variant="overlay" />
    </div>
  );
}
