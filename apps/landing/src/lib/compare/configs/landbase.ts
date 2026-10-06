import type { CompareConfig } from "../types";

export const landbaseConfig: CompareConfig = {
  slug: "pipe0-vs-landbase",
  competitor: "Landbase",
  metaTitle: "pipe0 vs Landbase: GTM Data for AI Agents Compared",
  metaDescription:
    "Compare pipe0 and Landbase for agent enrichment: entry price ($49 vs $499 a month), MCP vs CLI, and our 20-record test: 18 vs 13 mobiles found, 17s vs 62s, 14¢ vs 43¢ per mobile.",
  llmsLine:
    "Usage-based agent enrichment with sheets vs an upmarket CLI for GTM datasets",
  heroSubtitle:
    "Landbase hands agents a set of GTM endpoints through a CLI, priced for teams that start at $499 a month. pipe0 starts at $49, connects over MCP, and moves results into a sheet when a list needs to keep running. On our 20 test records it found five more mobile numbers.",
  table: {
    footnote:
      "Verified October 2026 against Landbase's public pricing page. Test figures are from our 20-record test in September 2026.",
    groups: [
      {
        label: "Platform",
        rows: [
          {
            feature: "How agents connect",
            pipe0: { v: "text", text: "MCP server, nothing to install" },
            competitor: { v: "text", text: "CLI, plus an API and web app" },
          },
          {
            feature: "Spreadsheet tables",
            pipe0: { v: "yes", note: "Sheets, up to 2M rows" },
            competitor: { v: "text", text: "Not advertised" },
          },
          {
            feature: "Schedules and webhooks",
            pipe0: { v: "yes" },
            competitor: { v: "text", text: "Not advertised" },
          },
          {
            feature: "Audience building",
            pipe0: { v: "yes", note: "people and company searches" },
            competitor: { v: "yes", note: "searches are free" },
          },
        ],
      },
      {
        label: "Our test",
        rows: [
          {
            feature: "Mobiles found (20 records)",
            pipe0: { v: "text", text: "18" },
            competitor: { v: "text", text: "13" },
          },
          {
            feature: "Time per mobile",
            pipe0: { v: "text", text: "17 seconds" },
            competitor: { v: "text", text: "62 seconds on average" },
          },
          {
            feature: "Cost per mobile",
            pipe0: { v: "text", text: "14¢" },
            competitor: { v: "text", text: "43¢" },
          },
          {
            feature: "Cost per work email",
            pipe0: { v: "text", text: "4.5¢" },
            competitor: { v: "text", text: "9¢" },
          },
        ],
      },
      {
        label: "Pricing",
        rows: [
          {
            feature: "Entry plan",
            pipe0: { v: "text", text: "$49/mo, 1,600 credits" },
            competitor: { v: "text", text: "$499/mo, 15,000 credits" },
          },
          {
            feature: "List price per verified mobile",
            pipe0: { v: "text", text: "Bills on success only" },
            competitor: { v: "text", text: "$0.33, unverified results free" },
          },
          {
            feature: "Free tier",
            pipe0: { v: "yes", note: "20 credits, no card" },
            competitor: { v: "yes", note: "1,000 credits, no card" },
          },
        ],
      },
    ],
  },
  differences: {
    heading: "Same job, a tenth of the entry price.",
    cards: [
      {
        title: "$49 instead of $499 to start",
        body: "Landbase's smallest plan is $499 a month for 15,000 credits. pipe0 starts at $49 for 1,600 credits and scales on usage. In our test the per-result cost was lower too: 14 cents per mobile number against 43.",
      },
      {
        title: "A home for the list",
        body: "Landbase returns data to the agent. pipe0 can do the same, and when a list should keep running, the agent writes it to a sheet: up to 2M rows, on a schedule, with webhooks and CRM sync. The same records, no export step.",
        link: { label: "Read the Sheets docs", href: "/docs/sheets" },
      },
    ],
  },
  theirEdge: {
    intro:
      "Landbase aims at the whole outbound motion, and its free tier is generous.",
    points: [
      "1,000 free credits that don't expire",
      "Free searches, with charges only for verified contact data",
      "Audience creation and AI qualification in one tool",
      "Published per-action prices",
    ],
    pickThem:
      "You want one vendor for audiences, qualification, and contact data, and a $499 monthly plan fits the budget.",
    pickUs:
      "You want a lower entry price, faster lookups, more numbers found per list, and tables your team and your agent share.",
  },
  faqs: [
    {
      q: "Is pipe0 a Landbase alternative?",
      a: "Yes. Both give AI agents people and company data with enrichment. Landbase works through a CLI and starts at $499 a month; pipe0 works over MCP and an API, starts at $49, and adds sheets, schedules, and webhooks.",
    },
    {
      q: "How much does Landbase cost?",
      a: "Plans start at $499 a month for 15,000 credits, with 1,000 free credits to try it. The pricing page lists $0.033 per verified email and $0.33 per verified mobile. In our test we paid 9 cents per email and 43 cents per mobile on average.",
    },
    {
      q: "Which found more phone numbers, Landbase or pipe0?",
      a: "pipe0, in our test: 18 of 20 mobile numbers against Landbase's 13. Twenty records is a small sample, so run your own list through both.",
    },
  ],
  related: [
    {
      label: "Stateless or stateful: GTM data for agents",
      href: "/blog/gtm-data-for-agents-stateless-stateful",
    },
    { label: "pipe0 vs Deepline", href: "/compare/pipe0-vs-deepline" },
    { label: "pipe0 vs Treg", href: "/compare/pipe0-vs-treg" },
  ],
  cta: {
    title: "Start at $49, or free.",
    subtitle: "The first 20 credits are on us. No credit card required.",
  },
};
