import { reviews, type ReviewPage } from "@/lib/source";

export const REVIEWS_DESCRIPTION =
  "Hands-on reviews of sales data and GTM tools: what each one is good at, " +
  "what it costs, and who should skip it. Scored on four fixed criteria, " +
  "with every price and fact sourced and dated.";

/** Drafts render in `next dev` (with a banner) and nowhere else. */
export const SHOW_DRAFTS = process.env.NODE_ENV === "development";

export type CriterionKey = keyof ReviewPage["data"]["scores"];

/**
 * The scoring rubric, in display order. The hub's methodology section
 * prints these verbatim, so a score always points back to its definition.
 */
export const CRITERIA: {
  key: CriterionKey;
  label: string;
  rubric: string;
}[] = [
  {
    key: "easeOfUse",
    label: "Ease of use",
    rubric:
      "How long it takes a sales or ops person to get a first useful " +
      "result without help, and how much of the product they can use " +
      "without a specialist.",
  },
  {
    key: "dataQuality",
    label: "Data quality",
    rubric:
      "Coverage and accuracy of the contact and company data it returns, " +
      "across regions and job titles, not only US tech.",
  },
  {
    key: "pricingValue",
    label: "Pricing value",
    rubric:
      "What a found email or phone number really costs once credits, " +
      "seats, top-ups and expiry are counted, and how predictable the bill " +
      "is.",
  },
  {
    key: "agentAccess",
    label: "API and agent access",
    rubric:
      "How much of the product an API, MCP server or AI agent can use " +
      "without a person clicking in the UI first, and on which plans.",
  },
];

/** Mean of the four criteria, to one decimal. The only overall score. */
export function overallScore(scores: ReviewPage["data"]["scores"]): number {
  const values = CRITERIA.map((c) => scores[c.key].score);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.round(mean * 10) / 10;
}

export { formatScore } from "./score";

export function isVisible(review: ReviewPage): boolean {
  return SHOW_DRAFTS || review.data.draft !== true;
}

/** Visible reviews, best score first, then by name. */
export function sortedReviews(): ReviewPage[] {
  return reviews
    .getPages()
    .filter(isVisible)
    .sort(
      (a, b) =>
        overallScore(b.data.scores) - overallScore(a.data.scores) ||
        a.data.tool.name.localeCompare(b.data.tool.name),
    );
}

/** Reviews that ship in production builds: sitemap, llms.txt, nav links. */
export function publishedReviews(): ReviewPage[] {
  return reviews.getPages().filter((r) => r.data.draft !== true);
}

export function reviewSlug(review: ReviewPage): string {
  return review.slugs[0];
}

/** "$49/mo", "Free" when the cheapest paid plan is $0. */
export function formatStartingPrice(review: ReviewPage): string {
  const { startingAt } = review.data.pricing;
  return startingAt === 0 ? "Free" : `$${startingAt}/mo`;
}

/** Other reviews to read next: same category first, then by score. */
export function relatedReviews(
  current: ReviewPage,
  count: number,
): ReviewPage[] {
  return sortedReviews()
    .filter((r) => r.url !== current.url)
    .sort(
      (a, b) =>
        Number(b.data.tool.category === current.data.tool.category) -
        Number(a.data.tool.category === current.data.tool.category),
    )
    .slice(0, count);
}

/**
 * Printed under every benchmark table, on the page and in the .md twin.
 * Mirrors the caveats in the positioning skill's evidence.md; the
 * agreement caveat only appears when the table shows agreement.
 */
export function benchmarkCaveats(
  benchmark: NonNullable<ReviewPage["data"]["benchmark"]>,
): string[] {
  const hasAgreement = benchmark.rows.some((r) => r.agreement !== undefined);
  const sizes = benchmark.rows.map((r) => r.n);
  const [min, max] = [Math.min(...sizes), Math.max(...sizes)];
  const range = min === max ? `${min} records` : `${min} to ${max} records`;
  return [
    ...(benchmark.notes ?? []),
    `Samples are small, ${range} per test, so treat a few points of difference as noise.`,
    ...(benchmark.rows.some((r) => r.dataset === "profiles")
      ? [
          "The LinkedIn profile set passed one vendor's resolvability filter, so absolute rates run higher than on a typical list. Comparisons between providers stay fair.",
        ]
      : []),
    ...(benchmark.rows.some((r) => r.dataset === "signups")
      ? [
          "The signup set is real pipe0 signup emails with no vendor involved. Name and domain are derived from the email, so those tests measure finding the address format, not finding the company.",
        ]
      : []),
    ...(hasAgreement
      ? [
          "Agreement is the share of results that match what other providers returned for the same person. It is a proxy for accuracy, not ground truth.",
        ]
      : []),
  ];
}

/** The disclosure line under the byline. */
export function disclosureFor(review: ReviewPage): string {
  const { disclosure, relationship, tool } = review.data;
  if (disclosure) return disclosure;
  switch (relationship) {
    case "supplier":
      return `pipe0 buys data from ${tool.name} and uses it in its waterfalls. The scores come from our own benchmark, not from that relationship.`;
    case "neutral":
      return `pipe0 neither competes with nor buys from ${tool.name}.`;
    default:
      return `pipe0 sells data enrichment and competes with ${tool.name} in parts of this review. We say where ${tool.name} is better.`;
  }
}
