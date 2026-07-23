import type { CompareConfig } from "../types";

export const fullenrichConfig: CompareConfig = {
  slug: "pipe0-vs-fullenrich",
  competitor: "FullEnrich",
  metaTitle: "pipe0 vs FullEnrich: Waterfall Enrichment Compared",
  metaDescription:
    "Compare pipe0 and FullEnrich for waterfall enrichment: curated providers vs 20+ vendors, emails and phones vs 100+ enrichments, billing models, and agent access.",
  llmsLine:
    "Curated waterfalls in a full engine vs a focused email and phone waterfall",
  heroSubtitle:
    "FullEnrich finds emails and mobile numbers through a waterfall of 20+ vendors. pipe0 runs curated waterfalls inside a bigger engine: sheets, an API, and AI agents. Which one fits depends on how much of the job you want one tool to do.",
  table: {
    footnote:
      "Verified July 2026 against FullEnrich's public website and pricing page.",
    groups: [
      {
        label: "Platform",
        rows: [
          {
            feature: "Spreadsheet enrichment UI",
            pipe0: { v: "yes", note: "Sheets, up to 2M rows" },
            competitor: { v: "no", note: "upload lists, export results" },
          },
          {
            feature: "Public API",
            pipe0: { v: "yes", note: "pipes, searches, and actions" },
            competitor: { v: "yes" },
          },
          {
            feature: "AI agents over MCP",
            pipe0: {
              v: "yes",
              note: "any MCP client, 100+ enrichments for agents",
            },
            competitor: { v: "yes", note: "Claude via MCP" },
          },
          {
            feature: "Scheduled workflows",
            pipe0: { v: "yes", note: "cron runs plus emailed reports" },
            competitor: { v: "text", text: "Not advertised" },
          },
        ],
      },
      {
        label: "Data",
        rows: [
          {
            feature: "What it enriches",
            pipe0: {
              v: "text",
              text: "Emails, phones, company data, 100+ enrichments",
            },
            competitor: { v: "text", text: "Emails and mobile numbers" },
          },
          {
            feature: "Provider approach",
            pipe0: {
              v: "text",
              text: "50+ curated providers, incl. exclusive Amplemarket data",
            },
            competitor: { v: "text", text: "20+ vendors" },
          },
          {
            feature: "Advertised find rate",
            pipe0: {
              v: "text",
              text: "We don't publish one. Test on your list",
            },
            competitor: { v: "text", text: "80%+ (their claim)" },
          },
        ],
      },
      {
        label: "Pricing",
        rows: [
          {
            feature: "Pricing model",
            pipe0: {
              v: "text",
              text: "Usage-based credits, from $49/mo, bills on success only",
            },
            competitor: { v: "text", text: "Credits, from $29/mo" },
          },
          {
            feature: "Free tier",
            pipe0: { v: "yes", note: "20 credits, no card" },
            competitor: { v: "yes", note: "50 leads, no card" },
          },
        ],
      },
    ],
  },
  differences: {
    heading: "Curation over chaining.",
    cards: [
      {
        title: "Fewer, better providers",
        body: "Source counts are the wrong metric: cheap providers resell the same data. A provider joins a pipe0 waterfall only when it adds unique coverage, and we negotiate custom rates with the strong ones. pipe0 is the only waterfall allowed to serve Amplemarket data. In our pricing comparisons this comes out roughly 7x as cost effective; run your own list and check.",
        link: { label: "Browse the pipe catalog", href: "/docs/pipe-catalog" },
      },
      {
        title: "A waterfall you can see and control",
        body: "Every pipe0 waterfall shows its providers. Reorder them, remove them, or plug in your own API keys for providers you already pay. The chain is your configuration, not a black box.",
        link: {
          label: "What is waterfall enrichment?",
          href: "/blog/what-is-waterfall-enrichment",
        },
      },
      {
        title: "The waterfall is one piece, not the product",
        body: "In pipe0 the same waterfalls run inside sheets that hold up to 2M rows, behind a REST API, and under AI agents over MCP. Enrich a list today, put the refresh on a schedule, and write results back to HubSpot or Salesforce without a second tool.",
        link: { label: "Read the Sheets docs", href: "/docs/sheets" },
      },
    ],
  },
  theirEdge: {
    intro:
      "FullEnrich keeps the job small on purpose, and it does phone numbers particularly well.",
    points: [
      "Mobile-first phone enrichment with US and Canada ownership validation",
      "Triple email verification with a claimed bounce rate under 1%",
      "A $29/mo entry point and 50 free leads to test",
      "A simple product a rep learns in minutes",
    ],
    pickThem:
      "You only need emails and mobile numbers for outreach lists, and you want the smallest tool that does it.",
    pickUs:
      "You want waterfalls plus the sheet, the API, and the agents on one engine, more than contact data, and billing that only charges when a provider delivers.",
  },
  faqs: [
    {
      q: "Is pipe0 a FullEnrich alternative?",
      a: "Yes. Both run waterfall enrichment for emails and phone numbers. pipe0 adds company data and 100+ other enrichments, plus sheets, a public API, and AI agent access over MCP. FullEnrich is the smaller, single-purpose option.",
    },
    {
      q: "Which is cheaper, FullEnrich or pipe0?",
      a: "FullEnrich starts lower at $29/mo against pipe0's $49/mo. On real workloads our pricing comparisons come out roughly 7x as cost effective for pipe0, because waterfalls are curated and you only pay the provider that returned a result. Both have free tiers, so test with your own list.",
    },
    {
      q: "Does FullEnrich have an API?",
      a: "Yes. FullEnrich offers an API and MCP access for Claude. The difference is scope: its waterfall covers emails and mobile numbers, while pipe0's API runs 100+ enrichments and searches, including company data and CRM write-back.",
    },
    {
      q: "What is waterfall enrichment?",
      a: "Querying several data providers in sequence and stopping at the first one that returns a result. It raises find rates because no single provider covers every segment. Good waterfall tools bill only the provider that delivered.",
    },
  ],
  related: [
    {
      label: "Best waterfall enrichment tools",
      href: "/blog/best-waterfall-enrichment-tools",
    },
    {
      label: "What is waterfall enrichment?",
      href: "/blog/what-is-waterfall-enrichment",
    },
    { label: "pipe0 vs Clay", href: "/compare/pipe0-vs-clay" },
  ],
  cta: {
    title: "Waterfalls, and the rest of the job.",
    subtitle: "The first 20 credits are on us. No credit card required.",
  },
};
