import { isVisible, overallScore } from "@/components/reviews/review-utils";
import { plainPage } from "@/lib/content.server";
import { reviews, type ReviewPage } from "@/lib/collections.server";

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

export function reviewsIndexData() {
  const all = sortedReviews();
  return all.length > 0 ? all.map(plainPage) : undefined;
}

export function reviewData(slug: string) {
  const page = reviews.getPage([slug]);
  if (!page || !isVisible(page)) return undefined;
  return {
    review: plainPage(page),
    related: relatedReviews(page, 3).map(plainPage),
  };
}
