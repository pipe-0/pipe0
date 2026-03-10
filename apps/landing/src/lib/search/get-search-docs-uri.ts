import { getBasePipeName, getSearchVersion, SearchId } from "@pipe0/ops";

export function getSearchDocsURI(searchId: SearchId) {
  return `/docs/search/search-catalog/${getBasePipeName(searchId)}/${getSearchVersion(searchId)}`;
}
