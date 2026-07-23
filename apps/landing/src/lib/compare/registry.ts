import { apolloConfig } from "./configs/apollo";
import { clayConfig } from "./configs/clay";
import { zoominfoConfig } from "./configs/zoominfo";
import type { CompareConfig } from "./types";

/** Order controls llms.txt and sitemap listing; keep the flagship first. */
export const compareConfigs: CompareConfig[] = [
  clayConfig,
  apolloConfig,
  zoominfoConfig,
];

export function getCompareConfig(slug: string): CompareConfig | undefined {
  return compareConfigs.find((config) => config.slug === slug);
}
