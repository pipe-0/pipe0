import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCompareConfig } from "./registry";

/** Each compare page loads its own config rather than bundling all of them. */
export const getCompare = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data }) => {
    const config = getCompareConfig(data);
    if (!config) throw notFound();
    return config;
  });
