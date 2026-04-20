import {
  getSearchEntry as getOpsEntry,
  getSearchVersion,
  searchCatalog,
  SearchId,
} from "@pipe0/elements";

export type SearchEntry = {
  baseSearch: string;
  route: string;
  children: {
    searchId: SearchId;
    version: number;
    route: string;
  }[];
};

export type SearchEntryMap = Record<SearchId, SearchEntry>;

export async function getSearchEntryMap(): Promise<SearchEntryMap> {
  const searchByBase: Record<string, SearchId[]> = {};

  for (const searchId of Object.keys(searchCatalog) as SearchId[]) {
    const entry = getOpsEntry(searchId);
    if (!searchByBase[entry.baseSearch]) {
      searchByBase[entry.baseSearch] = [];
    }
    searchByBase[entry.baseSearch].push(searchId);
  }

  const map: SearchEntryMap = {} as SearchEntryMap;

  for (const [baseSearch, searchIds] of Object.entries(searchByBase)) {
    const sortedIds = searchIds.sort((a, b) => {
      return getSearchVersion(b) - getSearchVersion(a);
    });

    const children = sortedIds.map((searchId) => {
      const entry = getOpsEntry(searchId);
      return {
        searchId,
        version: getSearchVersion(searchId),
        route: `/docs/search/search-catalog/${entry.baseSearch}/${getSearchVersion(searchId)}`,
      };
    });

    for (const child of children) {
      map[child.searchId] = {
        baseSearch,
        route: child.route,
        children,
      };
    }
  }

  return map;
}
