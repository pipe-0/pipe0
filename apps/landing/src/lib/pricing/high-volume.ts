import {
  isHighVolumeEligible,
  listTiers,
  type ManagedCredits,
} from "@pipe0/base";

/**
 * The lowest per-operation price an operation can reach: the deepest declared
 * high-volume tier when eligible, otherwise the standard price. Use this for
 * "starting from" / lowest-cost figures in the catalog.
 */
export function lowestManagedCredit(credits: ManagedCredits): number {
  if (!isHighVolumeEligible(credits)) return credits.default;
  const tiers = listTiers(credits);
  const deepest = tiers[tiers.length - 1];
  return deepest ? deepest.credits : credits.default;
}

/**
 * Whether an operation declares usable high-volume tiers. Re-exported from
 * @pipe0/base for readability at call sites and to tolerate a null price.
 */
export function hasHighVolume(
  credits: ManagedCredits | null | undefined,
): boolean {
  return !!credits && isHighVolumeEligible(credits);
}
