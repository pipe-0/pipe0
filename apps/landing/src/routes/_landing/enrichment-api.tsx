import { seo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LandingProof } from "@/components/landing/landing-proof";
import {
  Band,
  ButtonLink,
  Cell,
  Cells,
  RowLink,
  SectionHead,
} from "@/components/grid";
import { CloseBand, PageHero } from "@/components/landing-shell";
import { jsonLd, softwareApplicationJsonLd } from "@/components/seo/json-ld";
import { getProviderTiles } from "@/lib/marketing.functions";
import { CodeSample } from "@/components/code-sample";
import { Image } from "@/components/image";

const description =
  "One API for people and company data. Search across datasets, then enrich with curated waterfalls across 50+ providers that bill only the provider that found the data. REST, TypeScript SDK, and MCP.";

/* ---- Code samples -------------------------------------------------------
   Both mirror the TypeScript client docs (sdks/typescript-client.mdx):
   `pipes.pipe()` returns records keyed by the input's id, each field as
   { value }; `searches.search()` takes one `search` with a config. */

const enrichCode = `const result = await pipe0.pipes.pipe({
  pipes: [{ pipe_id: "person:workemail:waterfall@1" }],
  input: [{
    id: "1",
    name: "Lena Brandt",
    company_domain: "heliolabs.io",
  }],
});

result.records["1"].fields.work_email.value
// → "lena@heliolabs.io"`;

const searchCode = `const result = await pipe0.searches.search({
  search: {
    search_id: "people:profiles:crustdata@3",
    config: {
      limit: 25,
      filters: {
        current_employment_job_titles: { include: ["Head of RevOps"] },
      },
    },
  },
});`;

/* ---- Content ------------------------------------------------------------ */

const primitives: {
  name: string;
  line: string;
  code: string;
  href: string;
  linkLabel: string;
}[] = [
  {
    name: "Searches create records",
    line: "Find people and companies across prospecting datasets and the systems you already run, like HubSpot, Salesforce, or Postgres.",
    code: searchCode,
    href: "/docs/search-catalog",
    linkLabel: "Search catalog",
  },
  {
    name: "Pipes add properties to them",
    line: "Work emails, mobiles, verification, company data, AI steps, and CRM writes. Stack them in one call.",
    code: enrichCode,
    href: "/docs/pipe-catalog",
    linkLabel: "Pipe catalog",
  },
];

const useCases = [
  {
    title: "CRMs",
    body: "Enrich records on create, re-verify on a schedule, and write back through the same call.",
  },
  {
    title: "ATS and recruiting tools",
    body: "Resolve candidates to work emails and mobiles, and enrich the companies behind them.",
  },
  {
    title: "Sales tools and agents",
    body: "Offer waterfall enrichment inside your own product, billed per result found.",
  },
];

const docsLinks = [
  { href: "/docs", label: "Quickstart: first call in a few minutes" },
  { href: "/docs/api", label: "API reference" },
  { href: "/docs/sdks/typescript-client", label: "TypeScript SDK" },
  { href: "/docs/sdks/mcp", label: "MCP server for agents" },
];

function CodeCard({ code, file }: { code: string; file: string }) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-[10px] border border-[#1c2333]/10 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.04),0_8px_24px_rgba(28,35,80,0.06)]">
      <div className="border-b border-[#1c2333]/8 bg-[#f7f9fc] px-4 py-2 font-mono text-[11px] text-[#5b6478]">
        {file}
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[11.5px] leading-[1.7] text-[#2b3350] sm:text-[12.5px]">
        <CodeSample code={code} />
      </pre>
    </div>
  );
}

export const Route = createFileRoute("/_landing/enrichment-api")({
  loader: () => getProviderTiles(),
  head: () => ({
    ...seo({
      title: "Enrichment & Search API",
      description,
      path: "/enrichment-api",
    }),
    scripts: [jsonLd(softwareApplicationJsonLd({ description }))],
  }),
  component: EnrichmentApiPage,
});

function EnrichmentApiPage() {
  return (
    <>
      <PageHero
        kicker="Enrichment and search API."
        title="Every provider behind one call."
        lede="Search and enrich people and companies from your product, scripts, or agents. Typed inputs and outputs, curated waterfalls, one key, and one bill."
        actions={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink to="/docs">Read the docs</ButtonLink>
            <ButtonLink to="/docs/pipe-catalog" tone="secondary">
              Browse the catalog
            </ButtonLink>
          </div>
        }
      />

      {/* ===== The illustration — the code itself follows in the
              primitives section. A still from the scene set, on the page
              itself like every figure on the site. ===== */}
      <Band>
        <div className="flex justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
          <Image
            src="/media/website/illustrations/scene-api.webp"
            alt="An agent building a tower of blocks, about to add one marked with curly braces"
            width={1000}
            height={750}
            priority
            sizes="(min-width: 1024px) 520px, 80vw"
            className="h-auto w-full max-w-[520px] mix-blend-multiply"
          />
        </div>
      </Band>

      {/* ===== Two primitives ===== */}
      <Band>
        <SectionHead
          title="Two primitives. Everything else composes."
          lede="Every workflow on pipe0 is searches and pipes, arranged. The same ones run in Sheets and over MCP."
        />
        <Cells className="border-t border-[var(--rule)] lg:grid-cols-2">
          {primitives.map((p) => (
            <Cell key={p.name} className="flex flex-col">
              <div className="px-6 pt-10 sm:px-10 lg:px-12">
                <h3 className="text-[clamp(20px,1.7vw,24px)] font-medium tracking-[-0.025em] text-foreground">
                  {p.name}
                </h3>
                <p className="mt-2 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
                  {p.line}
                </p>
              </div>
              <div className="px-6 pb-10 pt-8 sm:px-10 lg:px-12">
                <CodeCard file="pipe0.ts" code={p.code} />
              </div>
              <RowLink to={p.href} className="mt-auto">
                {p.linkLabel}
              </RowLink>
            </Cell>
          ))}
        </Cells>
      </Band>

      {/* ===== Coverage, measured ===== */}
      <Band>
        <SectionHead
          title="Curated waterfalls, measured."
          lede="A provider joins a waterfall only when it finds data the others miss. Same 150 people, two waterfalls."
        />
        <LandingProof />
      </Band>

      {/* ===== Providers ===== */}
      <Band>
        <SectionHead
          title="50+ providers, one key."
          lede="Use pipe0's managed connections, or bring your own keys for a small platform fee per call."
        />
        <ul className="grid grid-cols-2 gap-px border-t border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-4 lg:grid-cols-8">
          {Route.useLoaderData().map((provider) => {
            return (
              <li
                key={provider.id}
                className="flex h-24 flex-col items-center justify-center gap-2 bg-background px-3"
              >
                <img
                  src={provider.logoUrl}
                  alt=""
                  loading="lazy"
                  className="size-6 rounded-md object-contain"
                  style={{ backgroundColor: provider.tileColor ?? undefined }}
                />
                <span className="text-[13px] text-muted-foreground">
                  {provider.label}
                </span>
              </li>
            );
          })}
        </ul>
      </Band>

      {/* ===== Who builds on it ===== */}
      <Band>
        <SectionHead title="Built to sit under your product." />
        <Cells className="border-t border-[var(--rule)] sm:grid-cols-3">
          {useCases.map((c) => (
            <Cell key={c.title} className="px-6 py-10 sm:px-10 lg:px-12">
              <h3 className="text-[18px] font-medium tracking-[-0.015em] text-foreground">
                {c.title}
              </h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </Cell>
          ))}
        </Cells>
      </Band>

      {/* ===== Docs ===== */}
      <Band>
        <SectionHead
          title="Start in the docs."
          lede="Everything here is documented, versioned, and typed."
        />
        <div className="border-t border-[var(--rule)] [&>a:first-child]:border-t-0">
          {docsLinks.map((l) => (
            <RowLink key={l.href} to={l.href}>
              {l.label}
            </RowLink>
          ))}
        </div>
      </Band>

      <CloseBand
        title="Build on it for free."
        lede="Sandbox requests cost nothing, and new accounts get free credits for production calls."
      />
    </>
  );
}
