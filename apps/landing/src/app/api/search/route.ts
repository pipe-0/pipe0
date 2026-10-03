import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import type { StructuredData } from "fumadocs-core/mdx-plugins";

export const revalidate = false;

type IndexedData = {
  title?: string;
  description?: string;
  _virtualType?: string;
  structuredData?: StructuredData | (() => Promise<StructuredData>);
  load?: () => Promise<{ structuredData: StructuredData }>;
};

// Exported once at build time and downloaded by the search dialog, which
// queries it in the browser (`type: "static"` in components/root-provider).
// The dynamic GET would run a function per keystroke and rebuild the index on
// every cold start.
export const { staticGET: GET } = createFromSource(source, {
  async buildIndex(page) {
    const data = page.data as IndexedData;
    // Pipe and search catalog entries are over half the docs, and their
    // bodies are generated reference text that the catalog's own filters
    // search better. Index them by title and description only, which keeps
    // the browser download small.
    const isCatalogEntry =
      data._virtualType === "pipe-entry" ||
      data._virtualType === "search-entry";

    let structuredData: StructuredData | undefined;
    if (isCatalogEntry) structuredData = { headings: [], contents: [] };
    else if (typeof data.structuredData === "function")
      structuredData = await data.structuredData();
    else if (data.structuredData) structuredData = data.structuredData;
    else if (data.load) structuredData = (await data.load()).structuredData;
    if (!structuredData) {
      throw new Error(`No structured data to index for ${page.url}`);
    }

    return {
      // Entries sit after the "Account" separator in the page tree (see
      // catalogEntryTreePlugin), so the derived breadcrumb would read
      // "Documentation > Account". Name their catalog instead.
      ...(isCatalogEntry && {
        breadcrumbs: [
          "Docs",
          data._virtualType === "pipe-entry" ? "Pipe Catalog" : "Search Catalog",
        ],
      }),
      title: data.title ?? page.url,
      description: data.description,
      url: page.url,
      id: page.url,
      structuredData,
    };
  },
});
