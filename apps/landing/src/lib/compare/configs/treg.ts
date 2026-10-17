import type { CompareConfig } from "../types";

export const tregConfig: CompareConfig = {
  slug: "pipe0-vs-treg",
  competitor: "Treg",
  metaTitle: "pipe0 vs Treg: GTM Data for AI Agents Compared",
  metaDescription:
    "Compare pipe0 and Treg (treg.to) for agent enrichment: quality-ordered waterfalls vs cost-ranked routing, 94% vs 85% usable mobile numbers in a live test, and a typed data model vs a relay of raw API responses.",
  llmsLine:
    "Quality-ordered waterfalls and a typed data model vs a pay-per-call gateway that relays raw responses",
  heroSubtitle:
    "Treg gives an agent one token for 4,000+ API endpoints and ranks every waterfall by expected cost per hit. pipe0 gives it fewer blocks, built for GTM, with waterfalls ordered by measured accuracy and a data model an agent can chain into multi-step automations. We ran both live on the same LinkedIn profiles: pipe0 returned a usable mobile number for 94% of people, Treg for 85%, and 12 of Treg's 94 numbers could not be dialled as mobiles.",
  table: {
    footnote:
      "Verified October 2026 against treg.to, its catalog and its open-source code. Benchmark rows are live Treg lookups against pipe0's default waterfall providers on the same LinkedIn profiles; see the FAQ for the method.",
    groups: [
      {
        label: "Platform",
        rows: [
          {
            feature: "AI agents over MCP",
            pipe0: { v: "yes" },
            competitor: { v: "yes", note: "plus a CLI and an llms.txt guide" },
          },
          {
            feature: "What a lookup returns",
            pipe0: { v: "text", text: "Typed fields, the same shape for every provider" },
            competitor: {
              v: "text",
              text: "The provider's raw response, or a few fields on routed lookups",
            },
          },
          {
            feature: "Docs per endpoint",
            pipe0: { v: "yes", note: "typed inputs and outputs for every pipe" },
            competitor: {
              v: "partial",
              note: "input fields and a link to the provider's own docs",
            },
          },
          {
            feature: "Stores your records",
            pipe0: { v: "yes", note: "Sheets, up to 2M rows" },
            competitor: { v: "no", note: "your agent keeps the results" },
          },
          {
            feature: "Schedules and signals",
            pipe0: { v: "yes", note: "cron runs, signals, emailed reports" },
            competitor: { v: "no", note: "every call is one-off" },
          },
          {
            feature: "Inbound webhooks",
            pipe0: { v: "yes", note: "webhook and email inbox streams" },
            competitor: { v: "no" },
          },
          {
            feature: "Open source",
            pipe0: { v: "no" },
            competitor: { v: "yes" },
          },
        ],
      },
      {
        label: "Data",
        rows: [
          {
            feature: "Catalog",
            pipe0: {
              v: "text",
              text: "GTM only: 50+ providers, 100+ enrichments and searches",
            },
            competitor: {
              v: "text",
              text: "4,000+ endpoints from 113 providers: SEO, ads, social, enrichment",
            },
          },
          {
            feature: "Waterfall order",
            pipe0: {
              v: "text",
              text: "Benchmarked for accuracy, reorderable",
            },
            competitor: {
              v: "text",
              text: "Ranked on every call by expected cost per hit",
            },
          },
          {
            feature: "Usable mobile numbers, live test",
            pipe0: { v: "text", text: "94% (91 of 97 people)" },
            competitor: { v: "text", text: "85% (82 of 97 people)" },
          },
          {
            feature: "Mobile numbers clearly wrong",
            pipe0: { v: "text", text: "4 of 95" },
            competitor: { v: "text", text: "12 of 94: invalid, no country code, or landline" },
          },
          {
            feature: "Personal mailboxes returned as work emails",
            pipe0: { v: "text", text: "1 of 101" },
            competitor: { v: "text", text: "8 of 103" },
          },
          {
            feature: "Average time per mobile lookup, live test",
            pipe0: { v: "text", text: "6.8 s" },
            competitor: { v: "text", text: "7.1 s, with a long tail past 1 minute" },
          },
          {
            feature: "Amplemarket data",
            pipe0: {
              v: "yes",
              note: "only meta provider allowed to offer it",
            },
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
              text: "Credits from $49/mo, bills on success only",
            },
            competitor: {
              v: "text",
              text: "Prepaid, each provider's price per hit, no markup",
            },
          },
          {
            feature: "Cost per usable mobile number, live test",
            pipe0: { v: "text", text: "14 to 18¢" },
            competitor: { v: "text", text: "About 11¢" },
          },
          {
            feature: "Free tier",
            pipe0: { v: "yes", note: "20 credits, no card" },
            competitor: { v: "yes", note: "$1.00 of credit, once" },
          },
        ],
      },
    ],
  },
  charts: {
    heading: "What came back.",
    lede: "Live lookups through Treg and pipe0's default waterfalls, on the same LinkedIn profiles.",
    charts: [
      {
        title: "Usable mobile numbers",
        max: 100,
        bars: [
          { label: "pipe0", value: 93.8, ours: true },
          { label: "Treg", value: 84.5 },
        ],
        note: "Share of 97 people with a valid mobile number, after removing clearly wrong ones.",
      },
      {
        title: "Mobile numbers that were clearly wrong",
        max: 15,
        bars: [
          { label: "pipe0", value: 4.2, ours: true },
          { label: "Treg", value: 12.8, worst: true },
        ],
        note: "Invalid, missing a country code, landlines or business lines: 4 of 95 against 12 of 94.",
      },
      {
        title: "Work emails that were personal mailboxes",
        max: 15,
        bars: [
          { label: "pipe0", value: 1.0, display: "1%", ours: true },
          { label: "Treg", value: 7.8, worst: true },
        ],
        note: "Gmail, Yahoo, Hotmail or Outlook addresses returned as work emails: 1 of 101 against 8 of 103.",
      },
      {
        title: "Same person, different answer",
        max: 100,
        bars: [
          { label: "Work emails", value: 37 },
          { label: "Mobile numbers", value: 27 },
        ],
        note: "Of the 94 people where both returned an answer, how often pipe0 and Treg returned different ones.",
      },
    ],
    footnote:
      "October 2026. Treg ran live with its default routing; pipe0's figures replay its default providers' answers on the same people, in the default order. Treg's balance covered 97 people for mobile numbers and 120 for work emails.",
  },
  differences: {
    heading: "Where the data goes wrong, and where it goes next.",
    cards: [
      {
        title: "The cheapest answer is final",
        body: "Treg's waterfall asks the provider with the lowest expected cost per hit first and keeps the first answer it gets. Its first provider is good, but when it misses, the next answer comes from whichever provider is next in price. In our live test, those later providers returned 12 of Treg's 94 mobile numbers that were invalid, missing a country code, or landlines, and 8 of its 103 work emails that were Gmail, Yahoo or Hotmail addresses. pipe0 orders its defaults by how often a provider's answers proved right.",
        link: { label: "Read the Treg review", href: "/reviews/treg" },
      },
      {
        title: "Same person, different answer",
        body: "Coverage only tells you that an answer came back. For the 94 people where both returned a mobile number, pipe0 and Treg disagreed on 25. For work emails they disagreed on 35 of 94. When two sources disagree on the same person, at most one of them is right, and a waterfall that takes the first answer can't tell you which.",
      },
      {
        title: "A relay, not a data model",
        body: "Treg's code is built around the call: billing holds, keys, audit logs, rate limits and a cache of past responses. None of it stores the people or companies you look up, and most calls return the provider's raw JSON. Your agent has to make sense of every vendor's format itself. pipe0 is stateless too, but it wraps retrieval in a data model: typed fields in the same shape for every provider, which an agent can chain into checks, transformations and multi-step automations in one request. Sheets are optional, for lists that need to persist.",
        link: { label: "How pipe0 pipes work", href: "/docs/pipe-catalog" },
      },
      {
        title: "A home when the list needs one",
        body: "With Treg, the story ends when the data reaches your agent. In pipe0 the agent can say \"write this to a pipe0 sheet\" and the same records become a table that holds up to 2M rows, runs on a schedule, and listens to webhooks. Nothing gets rebuilt.",
        link: { label: "Read the Sheets docs", href: "/docs/sheets" },
      },
    ],
  },
  theirEdge: {
    intro:
      "Treg is built for breadth, and it is honest about prices in a market that usually isn't.",
    points: [
      "One token for SEO, ads, social, media generation, and enrichment, not just GTM",
      "Every answer priced at the provider's own rate with no markup, and most misses free",
      "A well-built gateway: an MCP server, a CLI, a cost cap per call, and the provider that answered on every response",
      "Open source, with your own provider keys usable unmetered",
    ],
    pickThem:
      "Your agent needs Semrush, ad libraries, and social scrapers next to contact data, every job is a one-off call you pay for by the request, and you check what comes back.",
    pickUs:
      "GTM data is the job, the numbers and emails go straight into outreach, and some lists need to keep running after the conversation ends.",
  },
  faqs: [
    {
      q: "Is pipe0 a Treg alternative?",
      a: "Yes, for GTM data. Both give AI agents people and company enrichment over MCP and an API. Treg covers far more categories, such as SEO and ads. pipe0 covers GTM only, with quality-ordered waterfalls, premium sources such as Amplemarket, and sheets, schedules, and webhooks when the data needs a home.",
    },
    {
      q: "How was the 94% vs 85% mobile coverage measured?",
      a: "In October 2026 we ran Treg's routed phone lookup live on LinkedIn profiles from pipe0's provider benchmark and compared it with pipe0's default mobile waterfall (Wiza, Surfe, Crustdata) on the same people. Our prepaid Treg balance covered 97 people. We counted only usable numbers: numbers that were invalid, missing a country code, landlines, or business lines were removed, 12 of Treg's 94 and 4 of pipe0's 95.",
    },
    {
      q: "Do pipe0 and Treg return the same contact data?",
      a: "Not always. In our live test, when both found an answer for the same person, they returned different mobile numbers for 27% of people and different work emails for 37%.",
    },
    {
      q: "Does Treg have waterfall enrichment?",
      a: "Yes, for a few lookups such as finding an email or a phone number. Treg tries providers one at a time, ranked on each call by expected cost per hit, and returns the first answer. Every other endpoint calls a single provider.",
    },
    {
      q: "Is Treg cheaper than pipe0?",
      a: "Per lookup, yes. A usable mobile number cost about 11 cents through Treg and 14 to 18 cents through pipe0's waterfall. Treg also returned more numbers you have to throw away: 13% of its mobile numbers were clearly wrong, against 4% for pipe0.",
    },
    {
      q: "Does Treg store data or run schedules?",
      a: "No. Treg relays each call and keeps a cache of past responses, but nothing that stores your records. It has no tables, schedules, or inbound webhooks.",
    },
  ],
  related: [
    { label: "Treg review", href: "/reviews/treg" },
    {
      label: "Stateless or stateful: GTM data for agents",
      href: "/blog/gtm-data-for-agents-stateless-stateful",
    },
    { label: "pipe0 vs Deepline", href: "/compare/pipe0-vs-deepline" },
  ],
  cta: {
    title: "Ask your agent for a list.",
    subtitle: "The first 20 credits are on us. No credit card required.",
  },
};
