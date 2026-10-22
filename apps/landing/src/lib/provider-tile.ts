import type { ProviderCatalogEntry } from "@pipe0/base";

/**
 * The tile color a provider's logo was drawn on, or undefined for a plain
 * tile. Logos like TypeSafe's are a white glyph that vanishes on a white tile.
 * The site is light-only, so the light variant is the one that applies.
 */
export function providerTileColor(
  provider: Pick<ProviderCatalogEntry, "logoUrl" | "background"> | undefined,
) {
  return provider?.background?.light;
}
