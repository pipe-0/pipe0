/**
 * The two things pipe0 sells. One source, used by the header menu and the
 * footer's Products column so the two can never drift apart.
 */
export const products = [
  {
    href: "/",
    name: "Revenue systems",
    description: "Agentic GTM — sheets, schedules and reports, from Slack or the app.",
  },
  {
    href: "/enrichment-api",
    name: "Enrichment & search API",
    description: "One call across 50+ providers. Built to sit inside your own product.",
  },
] as const;
