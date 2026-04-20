import { getBasePipeName, getSearchVersion, SearchId } from "@pipe0/elements";

export function getSearchDocsURI(searchId: SearchId) {
  return `/docs/search/search-catalog/${getBasePipeName(searchId)}/${getSearchVersion(searchId)}`;
}
