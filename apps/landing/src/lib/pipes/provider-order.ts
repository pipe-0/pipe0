import {
  getDefaultPipeProviders,
  getPipeEntry,
  PipeId,
  ProviderName,
} from "@pipe0/base";

/**
 * The provider sequence a pipe runs when it is called without config. Catalog
 * entries declare `managedProviders` and `billableOperations` in whatever order
 * they were authored in, which is not the order the waterfall calls them —
 * docs should list providers the way the pipe actually runs them.
 */
export function getWaterfallProviderOrder(pipeId: PipeId): ProviderName[] {
  const config = getPipeEntry(pipeId).defaultPayload.config as
    | { providers?: { provider: ProviderName }[] }
    | undefined;
  return config?.providers?.map((entry) => entry.provider) ?? [];
}

/**
 * Orders any provider-keyed list by waterfall position. Providers a pipe offers
 * but does not run by default sort last and keep their catalog order, as do all
 * entries of a pipe that has no waterfall.
 */
export function sortByWaterfallOrder<T>(
  pipeId: PipeId,
  items: readonly T[],
  providerOf: (item: T) => string,
): T[] {
  const order: string[] = getWaterfallProviderOrder(pipeId);
  const rank = (item: T) => {
    const position = order.indexOf(providerOf(item));
    return position === -1 ? order.length : position;
  };
  // Sort is stable, so anything outside the default sequence stays put.
  return [...items].sort((a, b) => rank(a) - rank(b));
}

/**
 * The providers a pipe's docs page lists, ordered by the default waterfall.
 */
export function getPipeProvidersInWaterfallOrder(
  pipeId: PipeId,
): ProviderName[] {
  return sortByWaterfallOrder(
    pipeId,
    getDefaultPipeProviders(pipeId),
    (provider) => provider,
  );
}
