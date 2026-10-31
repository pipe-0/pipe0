import { createIsomorphicFn } from "@tanstack/react-start";
import { readData } from "./static-data";

/** Data the site frame needs on every page: footer links and the year. */
export const getSiteFrame = createIsomorphicFn()
  .server(async () => {
    const { sortedReviews } = await import("./reviews.server");
    return {
      reviews: sortedReviews()
        .map((r) => ({ name: r.data.tool.name, url: r.url }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      year: new Date().getFullYear(),
    };
  })
  .client(() => readData("site-frame"));
