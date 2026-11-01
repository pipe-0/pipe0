import { pipeCatalog, PipeId, searchCatalog, SearchId } from "@pipe0/base";

type LifecycleEntry = {
  lifecycle?: { deprecatedOn?: string; replacedBy?: string | null } | null;
};

/**
 * Follows `replacedBy` until it reaches an entry that is not deprecated.
 * A deprecated entry often names another deprecated entry
 * (`people:profiles:crustdata@1` → `@2` → `@3`), and an agent that follows one
 * hop lands on a dead id. Returns null when the chain ends without a current
 * entry (no replacement, a missing entry, or a cycle).
 */
function resolveCurrent(
  id: string,
  catalog: Record<string, LifecycleEntry>,
): string | null {
  const seen = new Set<string>([id]);
  let candidate = catalog[id]?.lifecycle?.replacedBy ?? null;
  while (candidate && !seen.has(candidate)) {
    const entry = catalog[candidate];
    if (!entry) return null;
    if (!entry.lifecycle?.deprecatedOn) return candidate;
    seen.add(candidate);
    candidate = entry.lifecycle.replacedBy ?? null;
  }
  return null;
}

export function resolveCurrentPipe(pipeId: PipeId): PipeId | null {
  return resolveCurrent(
    pipeId,
    pipeCatalog as Record<string, LifecycleEntry>,
  ) as PipeId | null;
}

export function resolveCurrentSearch(searchId: SearchId): SearchId | null {
  return resolveCurrent(
    searchId,
    searchCatalog as Record<string, LifecycleEntry>,
  ) as SearchId | null;
}
