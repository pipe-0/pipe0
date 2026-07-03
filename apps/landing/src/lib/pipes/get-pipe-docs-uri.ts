import { getPipeEntry, PipeId } from "@pipe0/base";

// The catalog entry's docPath is the canonical URL of the generated page
// (see pipe-catalog-source.tsx, which builds slugs from the same catalog).
// Deriving the link from it keeps links correct across pipe renames.
export function getPipeDocsURI(pipeId: PipeId) {
  return getPipeEntry(pipeId).docPath;
}
