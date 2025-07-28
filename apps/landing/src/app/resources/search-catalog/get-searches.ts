import {
  PipeId,
  SearchId,
  getSearchEntry,
  pipeCatalog,
} from "@pipe0/client-sdk";
import { normalizePages } from "nextra/normalize-pages";
import { getPageMap } from "nextra/page-map";

export type SearchEntry = {
  name: string;
  type: string;
  route: string;
  children: {
    name: string;
    route: string;
    frontMatter: {
      title: string;
      searchId: SearchId;
      root: string;
      filePath: string;
      description?: string;
      vendor?: string;
      other?: {
        searchId: SearchId;
      };
    };
  }[];
};

export async function getSearchEntries() {
  const { directories } = normalizePages({
    list: await getPageMap("/resources/search-catalog"),
    route: "/resources/search-catalog",
  }) as unknown as { directories: SearchEntry[] };
  return directories
    .filter(
      (searchEntry) =>
        searchEntry.name !== "index" && searchEntry.type !== "page"
    )
    .map((p) => {
      return {
        ...p,
        children: p.children
          .filter((e) => e.name !== "index")
          .map((c) => {
            const searchId =
              c.frontMatter.other?.searchId || c.frontMatter.searchId;
            const catalogEntry = getSearchEntry(searchId);

            if (!catalogEntry) {
              throw new Error(
                `Search "${searchId}" not found in searchMetaCatalog`
              );
            }

            return {
              ...c,
              ...catalogEntry,
            };
          }),
      };
    })
    .sort((a, b) => +a.name - +b.name);
}

export type SearchEntryMap = Record<SearchId, SearchEntry["children"][number]>;

export async function getSearchEntryMap() {
  const result = {} as SearchEntryMap;

  const { directories } = normalizePages({
    list: await getPageMap("/resources/search-catalog"),
    route: "/resources/search-catalog",
  }) as unknown as { directories: SearchEntry[] };

  directories.forEach((p) => {
    p.children?.forEach((c) => {
      if (c.frontMatter.other?.searchId) {
        result[c.frontMatter.other.searchId] = c;
      }
    });
  });

  return result;
}
