// No imports: the client grid uses this, so it must not pull in the
// content loader.

/** "3.4", always one decimal, so 4 reads as "4.0". */
export function formatScore(score: number): string {
  return score.toFixed(1);
}
