import {
  getPipeEntry,
  getStartingCostPerPipesProvider,
  PipeId,
  ProviderName,
} from "@pipe0/base";
import { hasHighVolume, lowestManagedCredit } from "@/lib/pricing/high-volume";

export function getPipeStartingPrice(pipeId: PipeId): number {
  try {
    const starting = getStartingCostPerPipesProvider(pipeId) as Record<
      ProviderName,
      number
    >;
    const values = Object.values(starting);
    if (values.length === 0) return 0;
    return Math.min(...values);
  } catch {
    return 0;
  }
}

/**
 * The lowest per-operation price a pipe can reach once high-volume tiers are
 * factored in, alongside a flag for whether that reflects a genuine discount.
 * Use for the "from X" figures on cards and the detail header; the detail
 * Providers table shows the full per-tier breakdown.
 */
export function getPipeLowestPrice(pipeId: PipeId): {
  lowest: number;
  isDiscounted: boolean;
} {
  const starting = getPipeStartingPrice(pipeId);
  try {
    const defs = Object.values(getPipeEntry(pipeId).billableOperations);
    if (!defs.some((def) => hasHighVolume(def.credits))) {
      return { lowest: starting, isDiscounted: false };
    }
    const floors = defs
      .map((def) => (def.credits ? lowestManagedCredit(def.credits) : null))
      .filter((value): value is number => value !== null);
    const lowest = floors.length ? Math.min(starting, ...floors) : starting;
    return { lowest, isDiscounted: lowest < starting };
  } catch {
    return { lowest: starting, isDiscounted: false };
  }
}
