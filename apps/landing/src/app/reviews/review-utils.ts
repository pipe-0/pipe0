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
