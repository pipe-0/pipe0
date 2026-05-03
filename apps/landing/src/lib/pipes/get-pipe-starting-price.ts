import {
  getStartingCostPerPipesProvider,
  PipeId,
  ProviderName,
} from "@pipe0/base";

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
