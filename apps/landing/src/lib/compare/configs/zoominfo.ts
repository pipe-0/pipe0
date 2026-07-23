import type { CompareConfig } from "../types";

export const zoominfoConfig: CompareConfig = {
  slug: "pipe0-vs-zoominfo",
  competitor: "ZoomInfo",
  metaTitle: "pipe0 vs ZoomInfo: Data Enrichment Compared",
  metaDescription:
    "Compare pipe0 and ZoomInfo for B2B data: annual contracts vs usage-based credits, one database vs 50+ provider waterfalls, plus spreadsheet, API, and MCP access.",
  llmsLine:
    "Enterprise B2B database vs usage-priced multi-provider enrichment",
  heroSubtitle:
    "ZoomInfo is the enterprise reference database for US B2B data, sold on annual contracts. pipe0 is an agentic GTM workspace on usage-based credits: 50+ providers in waterfalls, with agents and schedules keeping CRM enrichment and signal engines running instead of exporting lists that age.",
  table: {
    footnote:
      "Verified July 2026 against ZoomInfo's public docs. Contract terms vary; ZoomInfo does not publish list prices.",
    groups: [
      {
        label: "Platform",
        rows: [
          {
            feature: "Spreadsheet enrichment UI",
            pipe0: { v: "yes", note: "Sheets, up to 2M rows" },
            competitor: { v: "no" },
          },
          {
            feature: "Public API",
            pipe0: { v: "yes", note: "included on every plan" },
            competitor: { v: "yes", note: "enterprise add-on" },
          },
          {
            feature: "AI agents over MCP",
            pipe0: { v: "yes", note: "Claude Code, ChatGPT, Cursor" },
            competitor: { v: "no" },
          },
          {
            feature: "Point-in-time recovery",
            pipe0: { v: "yes", note: "undo, restore points, time travel" },
            competitor: { v: "no" },
          },
        ],
      },
      {
        label: "Data & coverage",
        rows: [
          {
            feature: "Data sources",
            pipe0: { v: "text", text: "50+ providers in waterfalls" },
            competitor: { v: "text", text: "ZoomInfo's own database" },
          },
          {
            feature: "Org charts and intent signals",
            pipe0: { v: "no" },
            competitor: { v: "yes" },
          },
        ],
      },
      {
        label: "Pricing",
        rows: [
          {
            feature: "Pricing",
            pipe0: { v: "text", text: "Usage-based credits, from $49/mo" },
            competitor: { v: "text", text: "Annual contract, not published" },
          },
          {
            feature: "Self-serve start",
            pipe0: { v: "yes", note: "20 free credits, no card" },
            competitor: { v: "no", note: "sales-led" },
          },
        ],
      },
    ],
  },
  differences: {
    heading: "Contract database or metered waterfall.",
    cards: [
      {
        title: "Usage pricing, not procurement",
        body: "ZoomInfo starts with a sales call and an annual commitment. pipe0 starts with 20 free credits, then bills per successful enrichment from $49/mo. A failed lookup costs nothing, and re-running a finished sheet costs nothing.",
        link: { label: "See pricing", href: "/pricing" },
      },
      {
        title: "Coverage that compounds",
        body: "Every database is strong somewhere and thin elsewhere; ZoomInfo's strength is US enterprise. A waterfall across findymail, Prospeo, Hunter, Crustdata, and 30 more providers falls through until someone has the answer, which is what holds up outside the US.",
        link: { label: "Browse the pipe catalog", href: "/docs/pipe-catalog" },
      },
      {
        title: "A workspace, not an export",
        body: "Database exports go stale in your CRM. In pipe0 the same engine runs as Sheets, a REST API, and an MCP server, so scheduled workflows and agents keep CRM enrichment, lead routing, and signal engines converging instead of aging. One toolset instead of a database plus sync and enrichment add-ons.",
        link: { label: "Read the Sheets docs", href: "/docs/sheets" },
      },
    ],
  },
  theirEdge: {
    intro:
      "ZoomInfo is the incumbent for a reason, and for large US-focused sales organizations several of its strengths have no real substitute.",
    points: [
      "Deep US enterprise coverage with org charts",
      "Intent signals and buyer-interest data",
      "The compliance posture large procurement teams require",
      "A brand security reviews already know",
    ],
    pickThem:
      "You are a US-focused enterprise sales org that needs org charts, intent data, and a vendor your procurement team has already approved.",
    pickUs:
      "You want to start today without a contract, your pipeline extends beyond US enterprise, or you need enrichment inside sheets, your product, or your AI agents.",
  },
  faqs: [
    {
      q: "Is pipe0 a ZoomInfo alternative?",
      a: "For data enrichment, yes. pipe0 finds emails, phones, and company data by waterfalling 50+ providers instead of querying one database. It does not replace ZoomInfo's org charts or intent signals.",
    },
    {
      q: "How much does ZoomInfo cost compared to pipe0?",
      a: "ZoomInfo sells annual contracts that are orders of magitude more expensive than pipe0. pipe0 is usage-based from $49/mo.",
    },
    {
      q: "Does pipe0 have better data than ZoomInfo?",
      a: "No single vendor wins everywhere, including ZoomInfo. pipe0's waterfall model means coverage is the union of many providers, which typically holds up better outside US enterprise segments. Test on your own list; marketing claims do not survive contact with real data.",
    },
    {
      q: "Can AI agents use pipe0 or ZoomInfo?",
      a: "pipe0 ships an MCP server, so Claude Code, ChatGPT, and Cursor can search, enrich, and schedule work directly. ZoomInfo does not offer an MCP server; its API is an enterprise add-on.",
    },
  ],
  related: [
    { label: "ZoomInfo alternatives", href: "/blog/zoominfo-alternatives" },
    { label: "Best MCP servers for GTM", href: "/blog/best-mcp-servers-gtm" },
    { label: "pipe0 vs Clay", href: "/compare/pipe0-vs-clay" },
  ],
  cta: {
    title: "Start without the sales call.",
    subtitle: "The first 20 credits are on us. No credit card required.",
  },
};
