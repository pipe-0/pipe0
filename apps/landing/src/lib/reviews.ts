import { lastRevised } from "@/components/blog/blog-utils";
import {
  CRITERIA,
  formatStartingPrice,
  isVisible,
  overallScore,
  type Review,
} from "@/components/reviews/review-utils";
import { contentPages, type Frontmatter } from "@/lib/content";

// Loaders import this module with import(), so these travel in one chunk that
// a page needs only when a client navigation reaches the reviews.
const reviews: Review[] = contentPages(
  "/reviews",
  import.meta.glob<Frontmatter<"reviews">>("./**/index.mdx", {
    base: "/src/content/reviews",
    query: { collection: "reviews", only: "frontmatter" },
    import: "frontmatter",
    eager: true,
  }),
);

/** Visible reviews, best score first, then by name. */
function sortedReviews(): Review[] {
  return reviews
    .filter(isVisible)
    .sort(
      (a, b) =>
        overallScore(b.data.scores) - overallScore(a.data.scores) ||
        a.data.tool.name.localeCompare(b.data.tool.name),
    );
}

/** Reviews that ship in production builds: sitemap, llms.txt, nav links. */
export function publishedReviews(): Review[] {
  return reviews.filter((review) => review.data.draft !== true);
}

/** What a list needs of a review. Each one's full frontmatter is 8 KB. */
function reviewSummary(review: Review) {
  const { tool, verdict, scores, pricing, draft } = review.data;
  return {
    url: review.url,
    tool,
    verdict,
    score: overallScore(scores),
    scores: CRITERIA.map(({ key }) => scores[key].score),
    price: formatStartingPrice(review),
    freePlan: pricing.freePlan,
    revised: lastRevised(review).toISOString(),
    draft: draft === true,
  };
}

export type ReviewSummary = ReturnType<typeof reviewSummary>;

export const reviewsIndex = () => sortedReviews().map(reviewSummary);

export function reviewPage(slug: string) {
  const review = reviews.find((r) => r.slug === slug);
  if (!review || !isVisible(review)) return undefined;
  const { category } = review.data.tool;
  // Other reviews to read next: same category first, then by score.
  const related = sortedReviews()
    .filter((r) => r.url !== review.url)
    .sort(
      (a, b) =>
        Number(b.data.tool.category === category) -
        Number(a.data.tool.category === category),
    )
    .slice(0, 3)
    .map(reviewSummary);
  return { review, related };
}

/** Footer links, A to Z. */
export function reviewLinks() {
  return sortedReviews()
    .map((review) => ({ name: review.data.tool.name, url: review.url }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
