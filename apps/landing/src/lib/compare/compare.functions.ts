import { createIsomorphicFn } from "@tanstack/react-start";
import { found, readData } from "../static-data";

/** Each compare page loads its own config rather than bundling all of them. */
export const getCompare = createIsomorphicFn()
  .server(async (slug: string) => {
    const { getCompareConfig } = await import("./registry");
    return found(getCompareConfig(slug));
  })
  .client((slug) => readData("compare", slug));
