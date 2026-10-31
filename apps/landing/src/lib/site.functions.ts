import { createServerFn } from "@tanstack/react-start";
import { sortedReviews } from "./reviews.server";

/** Data the site frame needs on every page: footer links and the year. */
export const getSiteFrame = createServerFn({ method: "GET" }).handler(() => ({
  reviews: sortedReviews()
    .map((r) => ({ name: r.data.tool.name, url: r.url }))
    .sort((a, b) => a.name.localeCompare(b.name)),
  year: new Date().getFullYear(),
}));
