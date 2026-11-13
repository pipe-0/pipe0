/**
 * The things pipe0 sells. One source, used by the header menu and the
 * footer's Products column so the two can never drift apart.
 */
export const products = [
  {
    href: "/",
    name: "GTM Teams",
    description: "Describe a play. The agent builds a sheet your team can see, change, and trust.",
    /* A still from the scene set (assets/illustrations/scenes_fal.md),
       shown in the header's Products menu. */
    illustration: "/media/website/illustrations/scene-sheets.webp",
  },
  {
    href: "/mcp",
    name: "Coding agents",
    description: "Searches, waterfalls, and sheets inside Claude Code, Cursor, and Codex.",
    illustration: "/media/website/illustrations/scene-mcp.webp",
  },
  {
    href: "/enrichment-api",
    name: "Enrichment & search API",
    description: "Every provider behind one call, for your product and your agents.",
    illustration: "/media/website/illustrations/scene-api.webp",
  },
] as const;
