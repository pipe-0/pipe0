import { catalogPages } from "@/lib/catalog.server";
import { source, type Page } from "@/lib/source.server";
import { findPath } from "fumadocs-core/page-tree";
import { createSearchAPI } from "fumadocs-core/search/server";

/** The sections above a page, the trail `createFromSource` would derive. */
function breadcrumbs(page: Page) {
  const tree = source.getPageTree();
  const path = findPath(
    tree.children,
    (node) => node.type === "page" && node.url === page.url,
  );
  return path
    ?.slice(0, -1)
    .map((node) => node.name)
    .reduce<string[]>(
      (names, name) =>
        typeof name === "string" && name ? [...names, name] : names,
      [tree.name as string],
    );
}

// Exported once at build time and downloaded by the search dialog, which
// queries it in the browser (`type: "static"` in components/root-provider).
// The dynamic GET would run a function per keystroke and rebuild the index on
// every cold start.
export const { staticGET } = createSearchAPI("advanced", {
  indexes: async () => [
    ...(await Promise.all(
      source.getPages().map(async (page) => ({
        id: page.url,
        url: page.url,
        title: page.data.title,
        description: page.data.description,
        breadcrumbs: breadcrumbs(page),
        structuredData: await page.data.structuredData(),
      })),
    )),
    // Pipe and search catalog entries are over half the docs, and their bodies
    // are generated reference text that the catalog's own filters search
    // better. Index them by title and description only, which keeps the
    // browser download small.
    ...catalogPages.map((page) => ({
      id: page.url,
      url: page.url,
      title: page.title,
      description: page.description,
      breadcrumbs: [
        "Docs",
        page.kind === "pipe" ? "Pipe Catalog" : "Search Catalog",
      ],
      structuredData: { headings: [], contents: [] },
    })),
  ],
});
