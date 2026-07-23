import type { CompareConfig } from "../types";

export const clayConfig: CompareConfig = {
  slug: "pipe0-vs-clay",
  competitor: "Clay",
  metaTitle: "pipe0 vs Clay: Data Enrichment & Sales Automation Compared",
  metaDescription:
    "Compare pipe0 and Clay for data enrichment and sales automation: spreadsheet UI, API access, row limits, credit billing, recovery, scheduling, and AI agent support.",
  llmsLine: "Factual comparison for data enrichment and sales automation",
  heroSubtitle:
    "Two of the most powerful data enrichment services in modern GTM. pipe0 is an agentic workspace: AI agents and humans operate the same tables, and jobs like CRM enrichment and lead routing run as scheduled workflows. Clay pairs its table with the largest template community in the category.",
  table: {
    footnote: "Verified July 2026 against Clay's public docs and pricing page.",
    groups: [
      {
        label: "Platform",
        rows: [
          {
            feature: "Spreadsheet enrichment UI",
            pipe0: { v: "yes", note: "Sheets, up to 2M rows" },
            competitor: { v: "yes", note: "Tables, 50k rows" },
          },
          {
            feature: "Public API",
            pipe0: { v: "yes", note: "First-class API support for everything" },
            competitor: { v: "no", note: "Complex API available for some plans" },
          },
          {
            feature: "AI agents over MCP",
            pipe0: { v: "yes", note: "Supports every MCP server" },
            competitor: { v: "no", note: "Complex CLI available on some plans" },
          },
          {
            feature: "Stateless enrichment",
            pipe0: { v: "yes", note: "Yes, perform every enrichment in a sheet of stateless" },
            competitor: { v: "no", note: "Creates stateful tables for everything" },
          },
        ],
      },
      {
        label: "Automation",
        rows: [
          {
            feature: "Waterfall enrichment",
            pipe0: {
              v: "yes",
              note: "bills only the provider that returned a result",
            },
            competitor: { v: "yes" },
          },
          {
            feature: "Scheduled workflows",
            pipe0: { v: "yes", note: "cron runs plus emailed reports" },
            competitor: { v: "yes", note: "scheduled table runs" },
          },
          {
            feature: "Point-in-time recovery",
            pipe0: { v: "yes", note: "undo, restore points, time travel" },
            competitor: { v: "no" },
          },
        ],
      },
      {
        label: "Pricing",
        rows: [
          {
            feature: "Pricing model",
            pipe0: { v: "text", text: "Usage-based credits, from $49/mo" },
            competitor: { v: "text", text: "Seat and credit plans" },
          },
          {
            feature: "Free tier",
            pipe0: { v: "yes", note: "20 credits, no card" },
            competitor: { v: "yes" },
          },
        ],
      },
    ],
  },
  differences: {
    heading: "The same job, a different shape.",
    cards: [
      {
        title: "One engine, three surfaces",
        body: "Everything a pipe0 sheet does is also a REST API and an MCP server. Build a spreadsheet, or ship the same enrichment inside your agent or product. Clay's engine is only reachable through its table UI.",
        link: { label: "Read the Sheets docs", href: "/docs/sheets" },
      },
      {
        title: "Point-in-time recovery",
        body: "Every change to a sheet lands in an append-only history. A bad filter, a malformed import, or an agent mistake is one restore away from undone.",
        link: { label: "How recovery works", href: "/docs/sheets/recovery" },
      },
      {
        title: "Agents run the sheet",
        body: "Claude Code or ChatGPT connects over OAuth and gets 50+ tools: create sheets, run enrichment, build reports, manage schedules. You watch the same cells fill in the table and take over anytime; every agent action lands in the shared history with undo.",
        link: { label: "Work with AI agents", href: "/docs/sheets/ai-agents" },
      },
    ],
  },
  theirEdge: {
    intro:
      "Clay has been in the market since 2017 and built the category's ecosystem. For many teams that maturity is worth more than any single feature.",
    points: [
      "The largest template library and community in the category",
      "More native integrations than any newcomer",
      "An established ecosystem of agencies and consultants",
      "Years of edge-case polish in the table UI",
    ],
    pickThem:
      "Your team lives in prebuilt playbooks, buys through an agency, and nobody needs API or agent access.",
    pickUs:
      "You need an API or AI agents on the same engine as the spreadsheet, tables past plan limits, or billing that tracks results instead of attempts.",
  },
  faqs: [
    {
      q: "Is pipe0 a Clay alternative?",
      a: "Yes. pipe0 Sheets does the same job as a Clay table: enrich lists of people and companies across many data providers from a spreadsheet, with waterfalls, conditions, and CRM write-back. pipe0 also exposes the entire engine as a public API and over MCP, which Clay does not.",
    },
    {
      q: "Does Clay have a public API?",
      a: "No. Clay does not offer a public enrichment API. pipe0 is API-first: everything a sheet does is available through REST endpoints, a TypeScript SDK, and an MCP server for AI agents.",
    },
    {
      q: "Can Claude Code or ChatGPT use pipe0?",
      a: "Yes. pipe0 ships an MCP server with 37 tools. Any MCP client, including Claude Code, Claude Desktop, ChatGPT, Cursor, and Codex, connects over OAuth and can create sheets, run enrichments, build reports, and manage schedules.",
    },
    {
      q: "How many rows can a pipe0 sheet hold?",
      a: "A sheet holds up to 2 million rows. The grid virtualizes rendering, large runs proceed in resumable background batches, and idle sheets move to cold storage automatically.",
    },
    {
      q: "Can I move a list from Clay to pipe0?",
      a: "Yes. Export your Clay table as a CSV and import it into a sheet. Map the columns to canonical field names during import, add the pipe columns you need, and run.",
    },
  ],
  related: [
    { label: "Clay alternatives", href: "/blog/clay-alternatives" },
    { label: "Does Clay have an API?", href: "/blog/clay-api" },
    { label: "Pipe0 Sheets docs", href: "/docs/sheets" },
  ],
  cta: {
    title: "Operate at infinite scale.",
    subtitle: "The first 20 credits are on us. No credit card required.",
  },
};
