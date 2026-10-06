import type { CompareConfig } from "../types";

export const deeplineConfig: CompareConfig = {
  slug: "pipe0-vs-deepline",
  competitor: "Deepline",
  metaTitle: "pipe0 vs Deepline: Agent Enrichment Compared",
  metaDescription:
    "Compare pipe0 and Deepline for GTM enrichment with AI agents: small blocks vs plays, sheets, and our 20-record test: 18 vs 12 mobiles found, 17s vs 145s, 14¢ vs 41¢ per mobile.",
  llmsLine:
    "Composable building blocks and sheets vs plays, tested on speed, coverage, and cost",
  heroSubtitle:
    "Deepline gives agents plays: prebuilt workflows, or custom ones built on Deepline's server, run through its CLI, API, or MCP server. pipe0 gives agents small blocks they compose on their own, and sheets when the result needs a home. In our test of 20 records, pipe0 returned a mobile number in 17 seconds. Deepline took about two and a half minutes.",
  table: {
    footnote:
      "Verified October 2026 against Deepline's public pricing page. Test figures are from our 20-record test in September 2026; Deepline's prices may have changed since.",
    groups: [
      {
        label: "Platform",
        rows: [
          {
            feature: "How agents connect",
            pipe0: { v: "text", text: "MCP server and REST API" },
            competitor: { v: "text", text: "CLI with skill files, API, SDK, MCP" },
          },
          {
            feature: "Public API",
            pipe0: { v: "yes" },
            competitor: { v: "yes" },
          },
          {
            feature: "Unit of work",
            pipe0: {
              v: "text",
              text: "Single pipes and searches, composed freely",
            },
            competitor: { v: "text", text: "Prebuilt and custom plays" },
          },
          {
            feature: "Spreadsheet tables",
            pipe0: { v: "yes", note: "Sheets, up to 2M rows" },
            competitor: { v: "text", text: "Not advertised" },
          },
          {
            feature: "Schedules",
            pipe0: { v: "yes" },
            competitor: {
              v: "yes",
              note: "15 scheduled plays on pay as you go",
            },
          },
          {
            feature: "CRM sync",
            pipe0: { v: "yes", note: "HubSpot, Salesforce, and more" },
            competitor: { v: "partial", note: "Growth plan and up" },
          },
        ],
      },
      {
        label: "Our test",
        rows: [
          {
            feature: "Mobiles found (20 records)",
            pipe0: { v: "text", text: "18" },
            competitor: { v: "text", text: "12" },
          },
          {
            feature: "Time per mobile",
            pipe0: { v: "text", text: "17 seconds" },
            competitor: { v: "text", text: "2.5 to 4 minutes" },
          },
          {
            feature: "Cost per mobile",
            pipe0: { v: "text", text: "14¢" },
            competitor: { v: "text", text: "41¢, read from our balance" },
          },
          {
            feature: "Cost per work email",
            pipe0: { v: "text", text: "4.5¢" },
            competitor: { v: "text", text: "6.6¢" },
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
              text: "Credits from $49/mo, bills on success only",
            },
            competitor: {
              v: "text",
              text: "$0/mo plus usage, or $395/mo Growth with $200 usage",
            },
          },
          {
            feature: "Free tier",
            pipe0: { v: "yes", note: "20 credits, no card" },
            competitor: { v: "text", text: "Pay as you go, no minimum" },
          },
        ],
      },
    ],
  },
  differences: {
    heading: "Blocks, not plays.",
    cards: [
      {
        title: "Blocks the agent composes",
        body: "pipe0 exposes small pipes and searches with fixed inputs and outputs. An agent strings them together for whatever the request is. With Deepline, anything outside a prebuilt play means creating a custom play on Deepline's server first, which took longer in our test and was harder for the agent to reason about.",
        link: {
          label: "Read the full Deepline test",
          href: "/blog/deepline-alternatives",
        },
      },
      {
        title: "17 seconds instead of minutes",
        body: "Asked for one phone number from a LinkedIn URL, Deepline pulled the whole profile and reasoned about it before answering, 2.5 to 4 minutes per record. pipe0 returned the number in 17 seconds. Both used the same agent at the same effort setting.",
      },
      {
        title: "Verification inside the waterfall",
        body: "Deepline has the agent verify each result after the fact, which is careful but slow and billed as agent time. pipe0 orders its waterfalls by measured agreement with premium providers and verifies inside the pipe, so the check costs a lookup, not a reasoning session.",
        link: {
          label: "What is waterfall enrichment?",
          href: "/blog/what-is-waterfall-enrichment",
        },
      },
    ],
  },
  theirEdge: {
    intro:
      "Deepline is thorough by design, and it has grown into scheduling and monitoring.",
    points: [
      "An automatic verification step after each enrichment",
      "Prebuilt plays for common GTM jobs",
      "Scheduled plays and live monitors, with CRM sync on the Growth plan",
      "A pay-as-you-go plan with no monthly fee",
    ],
    pickThem:
      "You live in the terminal, like plays you can version and schedule, and prefer an agent that double-checks every answer even when it takes minutes.",
    pickUs:
      "You want answers in seconds, more numbers found per dollar, and tables your team and your agent can both look at.",
  },
  faqs: [
    {
      q: "Is pipe0 a Deepline alternative?",
      a: "Yes. Both give AI agents GTM enrichment. Deepline organizes the work into plays; pipe0 gives the agent single pipes and searches to compose, with sheets when the data needs a home.",
    },
    {
      q: "Is pipe0 faster than Deepline?",
      a: "Yes, in our test. Finding a mobile number from a LinkedIn URL took 17 seconds with pipe0 and 2.5 to 4 minutes with Deepline, on 20 records with the same agent and effort setting.",
    },
    {
      q: "How much does Deepline cost per enrichment?",
      a: "Deepline lists phone finding from $0.17 per result on its pricing page. In our September 2026 test we paid 41 cents per mobile number and 6.6 cents per work email, measured from the account balance. pipe0 averaged 14 cents and 4.5 cents.",
    },
    {
      q: "Does Deepline have an MCP server?",
      a: "Yes. Deepline ships a CLI with skill files, a REST API, an SDK, and a remote MCP server. Our September 2026 test used the CLI.",
    },
  ],
  related: [
    {
      label: "Stateless or stateful: GTM data for agents",
      href: "/blog/gtm-data-for-agents-stateless-stateful",
    },
    { label: "pipe0 vs Treg", href: "/compare/pipe0-vs-treg" },
    { label: "pipe0 vs Landbase", href: "/compare/pipe0-vs-landbase" },
  ],
  cta: {
    title: "Try the 17-second version.",
    subtitle: "The first 20 credits are on us. No credit card required.",
  },
};
