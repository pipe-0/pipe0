import type { CompareConfig } from "../types";

export const tregConfig: CompareConfig = {
  slug: "pipe0-vs-treg",
  competitor: "Treg",
  metaTitle: "pipe0 vs Treg: GTM Data for AI Agents Compared",
  metaDescription:
    "Compare pipe0 and Treg (treg.to) for agent enrichment: curated waterfalls vs cheapest-first routing, 94% vs 72% mobile coverage in our benchmark, and sheets, schedules, and webhooks.",
  llmsLine:
    "Curated waterfalls plus a stateful home vs a stateless, pay-per-call tool gateway",
  heroSubtitle:
    "Treg gives an agent one key for 3,800+ API endpoints and routes every lookup to the cheapest provider first. pipe0 gives it fewer blocks, built for GTM, with waterfalls ordered by measured accuracy. On the same 150 LinkedIn profiles, pipe0 found 94% of mobile numbers. The four Treg phone providers we benchmarked found 72%.",
  table: {
    footnote:
      "Verified October 2026 against treg.to and its public pricing. Coverage figures come from pipe0's provider benchmark (150 profiles, August 2026); see the FAQ for the method.",
    groups: [
      {
        label: "Platform",
        rows: [
          {
            feature: "AI agents over MCP",
            pipe0: { v: "yes" },
            competitor: { v: "yes", note: "plus a CLI and plain HTTP" },
          },
          {
            feature: "Public API",
            pipe0: { v: "yes", note: "pipes, searches, and actions" },
            competitor: { v: "yes" },
          },
          {
            feature: "Spreadsheet tables",
            pipe0: { v: "yes", note: "Sheets, up to 2M rows" },
            competitor: { v: "no" },
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
              text: "3,800+ endpoints: SEO, ads, social, enrichment",
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
              text: "Cheapest first, falls through on a miss",
            },
          },
          {
            feature: "Mobile coverage, our benchmark",
            pipe0: { v: "text", text: "94% (141 of 150)" },
            competitor: {
              v: "text",
              text: "72% across 4 of its 16 phone providers",
            },
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
              text: "Pay per call at provider list price, no markup",
            },
          },
          {
            feature: "Cost per mobile found, our benchmark",
            pipe0: { v: "text", text: "About 12¢" },
            competitor: { v: "text", text: "About 14¢ (simulated routing)" },
          },
          {
            feature: "Free tier",
            pipe0: { v: "yes", note: "20 credits, no card" },
            competitor: { v: "yes", note: "$1.00 of credit, no card" },
          },
        ],
      },
    ],
  },
  differences: {
    heading: "Where the data goes next.",
    cards: [
      {
        title: "The first provider decides accuracy",
        body: "A waterfall stops at the first answer, so a cheap provider that guesses wrong hides the right answer further down. In our work email benchmark, one of the cheapest sources we tested disagreed with Amplemarket and Crustdata on 33 of 46 shared answers; Prospeo disagreed on 5 of 50. pipe0 puts providers like Prospeo first because they are cheap and agree with premium data, not because they are cheapest.",
        link: {
          label: "Why cheapest-first waterfalls fail",
          href: "/blog/cheapest-first-waterfall",
        },
      },
      {
        title: "Premium sources outside the catalog",
        body: "Cheap phone providers mostly find the same people. In our benchmark, Amplemarket or Crustdata also found 61 of the 62 numbers that LeadMagic, Prospeo, and Aviato found, plus 80 numbers those three missed. Neither premium source is in Treg's phone catalog. pipe0 is the only meta provider allowed to offer Amplemarket data, which is most of the gap between 94% and 72%.",
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
      "One key for SEO, ads, social, media generation, and enrichment, not just GTM",
      "Every call priced at the provider's own rate with no markup",
      "Open source, with your own provider keys usable for free",
      "Measured success rates and prices published per provider",
    ],
    pickThem:
      "Your agent needs Semrush, ad libraries, and social scrapers next to contact data, and every job is a one-off call you pay for by the request.",
    pickUs:
      "GTM data is the job, coverage and accuracy matter more than the cheapest call, and some lists need to keep running after the conversation ends.",
  },
  faqs: [
    {
      q: "Is pipe0 a Treg alternative?",
      a: "Yes, for GTM data. Both give AI agents people and company enrichment over MCP and an API. Treg covers far more categories, such as SEO and ads. pipe0 covers GTM only, with curated waterfalls, premium sources such as Amplemarket, and sheets, schedules, and webhooks when the data needs a home.",
    },
    {
      q: "How was the 94% vs 72% mobile coverage measured?",
      a: "We ran 150 LinkedIn profiles through each provider in August 2026. Four of Treg's 16 phone providers are in that benchmark: Aviato, LeadMagic, Wiza, and Prospeo. We simulated Treg's cheapest-first routing over them at Treg's list prices, which found 72%. pipe0's waterfall found 94%. The other 12 Treg phone providers were not tested, and the profile list was pre-filtered for resolvable people, so absolute rates run high.",
    },
    {
      q: "Is Treg cheaper than pipe0?",
      a: "Per call, often yes. Per number found, they come out close: about 14 cents with Treg's cheapest-first routing over the benchmarked providers, about 12 cents with pipe0's waterfall. The bigger difference is how many numbers you get back.",
    },
    {
      q: "Does Treg store data or run schedules?",
      a: "No. Treg is stateless: each call returns data to your agent and the work ends there. It can replay a paid response, but it has no tables, schedules, or inbound webhooks.",
    },
  ],
  related: [
    {
      label: "Stateless or stateful: GTM data for agents",
      href: "/blog/gtm-data-for-agents-stateless-stateful",
    },
    { label: "pipe0 vs Deepline", href: "/compare/pipe0-vs-deepline" },
    { label: "pipe0 vs Landbase", href: "/compare/pipe0-vs-landbase" },
  ],
  cta: {
    title: "Ask your agent for a list.",
    subtitle: "The first 20 credits are on us. No credit card required.",
  },
};
