import type { ManagedCredits } from "@pipe0/base";

/**
 * A billing def / search cost as far as pricing display cares. Typed
 * STRUCTURALLY (not against @pipe0/base's unions) so this compiles on the
 * currently pinned base and needs no change when the base that introduces
 * `userConnectionCredits` ships.
 *
 * `userConnectionCredits` (base >= 1.1) is the "platform-paid BYO" variant:
 * the provider bills pipe0's developer app even though the call runs on the
 * user's own connection (e.g. X's pay-per-use API), so the user pays real
 * per-unit credits instead of the flat custom-connection usage fee —
 * `credits` is null on those entries, but they are NOT free.
 */
type CostLike = {
  credits?: ManagedCredits | number | null;
  userConnectionCredits?: ManagedCredits | number | null;
};

/**
 * The per-unit price to DISPLAY for a billing def or search cost: managed
 * credits when present, otherwise the platform-paid user-connection credits.
 * Returns null only for genuinely unpriced (free BYO) entries. Tolerates the
 * legacy plain-number credits shape.
 */
export function effectiveCredits(cost: CostLike): ManagedCredits | null {
  const picked = cost.credits ?? cost.userConnectionCredits ?? null;
  if (picked == null) return null;
  return typeof picked === "number" ? { default: picked } : picked;
}

/** Whether the price comes from the platform-paid user-connection variant. */
export function isPlatformPaid(cost: CostLike): boolean {
  return cost.credits == null && cost.userConnectionCredits != null;
}
