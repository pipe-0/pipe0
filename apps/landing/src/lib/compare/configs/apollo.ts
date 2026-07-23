import type { CompareConfig } from "../types";

export const apolloConfig: CompareConfig = {
  slug: "pipe0-vs-apollo",
  competitor: "Apollo",
  metaTitle: "pipe0 vs Apollo.io: Data Enrichment & GTM Automation Compared",
  metaDescription:
    "Compare pipe0 and Apollo.io: an agentic GTM workspace with 50+ provider waterfalls vs an outreach platform with one owned database. Tables, APIs, MCP, and pricing.",
  llmsLine:
    "Outreach platform with one database vs agentic GTM workspace with 50+ providers",
  heroSubtitle:
    "Apollo is an outreach platform: one owned database with automation built around sequencing. pipe0 is an agentic workspace for the entire GTM motion, where CRM enrichment, lead routing, and signal engines run as scheduled workflows that agents and humans operate on the same tables.",
  table: {
    footnote:
      "Verified July 2026 against Apollo's public docs and pricing page.",
    groups: [
      {
        label: "Platform",
        rows: [
          {
            feature: "Data sources",
            pipe0: { v: "text", text: "50+ providers and waterfalls" },
            competitor: { v: "text", text: "Apollo's own database" },
          },
          {
            feature: "Spreadsheet enrichment UI",
            pipe0: { v: "yes", note: "Sheets, up to 2M rows" },
            competitor: {
              v: "no",
              note: "list views, not an enrichment table",
            },
          },
          {
            feature: "Public API",
            pipe0: { v: "yes", note: "pipes, searches, and actions" },
            competitor: { v: "yes", note: "Apollo data, rate-limited by plan" },
          },
          {
            feature: "AI agents over MCP",
            pipe0: { v: "yes", note: "Claude Code, ChatGPT, Cursor, 37 tools" },
            competitor: { v: "no" },
          },
        ],
      },
      {
        label: "Automation",
        rows: [
          {
            feature: "Automation scope",
            pipe0: {
              v: "text",
              text: "CRM enrichment, lead routing, signal engines, scheduled reports",
            },
            competitor: { v: "text", text: "Sequences and outreach workflows" },
          },
          {
            feature: "Email sequences and dialer",
            pipe0: {
              v: "no",
              note: "pipes hand off to lemlist, Amplemarket, Gmail",
            },
            competitor: { v: "yes", note: "built in" },
          },
          {
            feature: "Point-in-time recovery",
            pipe0: { v: "yes" },
            competitor: { v: "no" },
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
              text: "Usage-based credits, from $49/mo, no seats",
            },
            competitor: { v: "text", text: "Per seat, credits on top" },
          },
          {
            feature: "Free tier",
            pipe0: { v: "yes", note: "20 credits, no card" },
            competitor: { v: "yes", note: "generous free seat" },
          },
        ],
      },
    ],
  },
  differences: {
    heading: "An outreach tool or a GTM workspace.",
    cards: [
      {
        title: "Waterfalls beat any single source",
        body: "Apollo's coverage is Apollo's database. A pipe0 waterfall tries several providers per lookup and stops at the first hit, so coverage compounds where single databases thin out: Europe, niche titles, small companies. You pay for the provider that delivered.",
        link: { label: "Browse the pipe catalog", href: "/docs/pipe-catalog" },
      },
      {
        title: "Every GTM workflow, not a few",
        body: "Enrich your CRM on a schedule, route leads round-robin, watch for signups and fire alerts, deliver a report every Monday. The jobs teams otherwise split across reverse-ETL tools like Hightouch or Polytomic, CRM enrichment add-ons, and separate data vendors run in one place.",
        link: { label: "Schedule runs", href: "/docs/sheets/schedules" },
      },
      {
        title: "Agents and humans, one workspace",
        body: "An agent builds the workflow over MCP; you open the same sheet and watch cells fill. Take over anytime: every agent action lands in the shared history with undo, so handing work between chat and table costs nothing.",
        link: { label: "Work with AI agents", href: "/docs/sheets/ai-agents" },
      },
      {
        title: "An enrichment table, not a list view",
        body: "pipe0 Sheets holds up to 2 million rows where columns run pipes, with cell-level statuses and point-in-time recovery. Apollo's lists filter its database; they are not a workspace for composing enrichment.",
        link: { label: "Read the Sheets docs", href: "/docs/sheets" },
      },
    ],
  },
  theirEdge: {
    intro:
      "Apollo bundles more of the outreach funnel than pipe0 does, and its self-serve database is the largest in the category.",
    points: [
      "Sequences, a dialer, and meeting booking in the same product",
      "A genuinely useful free plan for small teams",
    ],
    pickThem:
      "You want one per-seat tool and a single-provider database.",
    pickUs:
      "You want the whole GTM data motion automated: CRM enrichment, routing, and signals running on schedules, coverage from waterfalls instead of one database, and agents doing the work over MCP.",
  },
  faqs: [
    {
      q: "Is pipe0 an Apollo alternative?",
      a: "For data enrichment and GTM automation, yes. pipe0 replaces Apollo's enrichment with waterfalls across 50+ providers and runs workflows Apollo does not cover, like CRM enrichment and lead routing. For sequencing and dialing it is not: pipe0 hands enriched lists to outreach tools rather than sending email itself.",
    },
    {
      q: "Does Apollo have an API?",
      a: "Yes. Apollo offers a REST API for its own database, rate-limited by plan. The difference is scope: pipe0's API queries 50+ providers in waterfalls instead of one database, and bills only on returned results.",
    },
    {
      q: "Can I use Apollo and pipe0 together?",
      a: "Yes, and teams do. A common setup keeps Apollo for sequencing while pipe0 enriches and routes the lists first, so emails and phone numbers come from waterfalls instead of a single source.",
    },
    {
      q: "Can pipe0 replace reverse-ETL tools like Hightouch or Polytomic?",
      a: "For enrichment-driven CRM sync it can: scheduled sheets enrich records and write them back to HubSpot, Salesforce, or Attio without a separate sync tool. It is not a general-purpose warehouse sync platform; Postgres and Databricks connect as sources today.",
    },
  ],
  related: [
    { label: "pipe0 vs Clay", href: "/compare/pipe0-vs-clay" },
    { label: "Clay alternatives", href: "/blog/clay-alternatives" },
    { label: "ZoomInfo alternatives", href: "/blog/zoominfo-alternatives" },
  ],
  cta: {
    title: "Automate the whole motion.",
    subtitle: "The first 20 credits are on us. No credit card required.",
  },
};
