import { getBasePipeName, getSearchVersion, SearchId } from "@pipe0/ops";

export function getSearchDocsURI(searchId: SearchId) {
  return `/docs/searches/searches-catalog/${getBasePipeName(searchId)}/${getSearchVersion(searchId)}`;
}
