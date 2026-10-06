import { apolloConfig } from "./configs/apollo";
import { clayConfig } from "./configs/clay";
import { deeplineConfig } from "./configs/deepline";
import { fullenrichConfig } from "./configs/fullenrich";
import { landbaseConfig } from "./configs/landbase";
import { tregConfig } from "./configs/treg";
import { zoominfoConfig } from "./configs/zoominfo";
import type { CompareConfig } from "./types";

/** Order controls llms.txt and sitemap listing; keep the flagship first. */
export const compareConfigs: CompareConfig[] = [
  clayConfig,
  apolloConfig,
  zoominfoConfig,
  fullenrichConfig,
  tregConfig,
  deeplineConfig,
  landbaseConfig,
];

export function getCompareConfig(slug: string): CompareConfig | undefined {
  return compareConfigs.find((config) => config.slug === slug);
}
