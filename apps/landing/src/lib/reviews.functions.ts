import { createIsomorphicFn } from "@tanstack/react-start";
import { found, readData } from "./static-data";

export const getReviewsIndex = createIsomorphicFn()
  .server(async () => {
    const { reviewsIndexData } = await import("./reviews.server");
    return found(reviewsIndexData());
  })
  .client(() => readData("reviews-index"));

export const getReview = createIsomorphicFn()
  .server(async (slug: string) => {
    const { reviewData } = await import("./reviews.server");
    return found(reviewData(slug));
  })
  .client((slug) => readData("review", slug));
