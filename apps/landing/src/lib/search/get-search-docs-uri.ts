import { getSearchEntry, SearchId } from "@pipe0/base";

// The catalog entry's docPath is the canonical URL of the generated page
// (see search-catalog-source.tsx, which builds slugs from the same catalog).
// Deriving the link from it keeps links correct across search renames.
export function getSearchDocsURI(searchId: SearchId) {
  return getSearchEntry(searchId).docPath;
}
