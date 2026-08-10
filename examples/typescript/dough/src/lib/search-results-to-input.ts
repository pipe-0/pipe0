import type { ExpandedFieldValue, PipesInput, SearchResponse } from "@pipe0/base";

export function searchResultsToInput(res: SearchResponse): PipesInput[] {
  return res.results.map((row, idx) => {
    const out: PipesInput = { id: idx };
    for (const [name, field] of Object.entries(row)) {
      if (field) out[name] = field as ExpandedFieldValue;
    }
    return out;
  });
}
