/**
 * A SEARCH whose price is variable work rather than a flat charge per
 * result/search/page: LLM tokens plus per-call provider tools, billed
 * imperatively by the runner as the search executes.
 *
 * The presence of `billableOperations` on a search entry is the switch (base
 * >= 1.0.18). On those entries `cost.credits.default` is 0 and is display
 * metadata only — reading it as a price renders "Free" for a search that bills
 * real credits, which is what this predicate exists to prevent. `cost.info`
 * carries the human explanation.
 *
 * Searches only. Every PIPE declares `billableOperations`, so the same test
 * would be true for all of them and mean nothing.
 *
 * Typed STRUCTURALLY rather than against @pipe0/base's unions, matching
 * `effective-credits.ts`, so it compiles on an older pinned base too.
 */
type SearchEntryLike = {
  billableOperations?: Record<string, unknown> | null;
};

export function isUsageMeteredSearch(entry: SearchEntryLike): boolean {
  const ops = entry.billableOperations;
  return ops != null && Object.keys(ops).length > 0;
}

/** Short label for a usage-metered price cell — never a number, never "Free". */
export const USAGE_METERED_LABEL = "Usage-based";
