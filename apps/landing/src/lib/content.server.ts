import type { PlainPage } from "./content";

/**
 * A page's frontmatter, ready to be a loader result. Compiled
 * content stays behind: routes render it from the browser collections.
 */
export function plainPage<
  T extends { url: string; slugs: string[]; path: string; data: object },
>(page: T) {
  const data = Object.fromEntries(
    Object.entries(page.data).filter(
      ([key, value]) => typeof value !== "function" && key !== "info",
    ),
  );
  return {
    url: page.url,
    slugs: page.slugs,
    path: page.path,
    data,
  } as PlainPage<T>;
}
