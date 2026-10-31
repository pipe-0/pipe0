import { isVisible } from "@/components/reviews/review-utils";
import { plainPage } from "@/lib/content.server";
import { relatedReviews, sortedReviews } from "@/lib/reviews.server";
import { reviews } from "@/lib/source.server";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const getReviewsIndex = createServerFn({ method: "GET" }).handler(() => {
  const all = sortedReviews();
  if (all.length === 0) throw notFound();
  return all.map(plainPage);
});

export const getReview = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data }) => {
    const page = reviews.getPage([data]);
    if (!page || !isVisible(page)) throw notFound();
    return {
      review: plainPage(page),
      related: relatedReviews(page, 3).map(plainPage),
    };
  });
