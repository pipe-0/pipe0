import {
  pipeCatalog,
  providerCatalog,
  searchCatalog,
  type PipeId,
  type ProviderName,
  type SearchId,
} from "@pipe0/base";
import { googleWorkspaceProducts } from "./google-workspace";
import { providerTileColor } from "./provider-tile";

/* Real marks from the provider catalog — the same source the docs use. */
const ENRICHMENT_API_PROVIDERS: ProviderName[] = [
  "amplemarket",
  "crustdata",
  "leadmagic",
  "prospeo",
  "hunter",
  "surfe",
  "wiza",
  "zerobounce",
  "exa",
  "firecrawl",
  "perplexity",
  "openai",
  "anthropic",
  "gemini",
  "hubspot",
  "salesforce",
];

export function providerTiles() {
  return ENRICHMENT_API_PROVIDERS.flatMap((id) => {
    const provider = providerCatalog[id];
    if (!provider?.logoUrl) return [];
    return [
      {
        id,
        label: provider.label,
        logoUrl: provider.logoUrl,
        tileColor: providerTileColor(provider) ?? null,
      },
    ];
  });
}

/** Doc paths for the operations the installed catalog has. */
export function catalogDocPaths() {
  const paths: Record<string, string> = {};
  for (const product of googleWorkspaceProducts) {
    for (const { id } of product.operations) {
      if (Object.hasOwn(pipeCatalog, id)) {
        paths[id] = pipeCatalog[id as PipeId].docPath;
      } else if (Object.hasOwn(searchCatalog, id)) {
        paths[id] = searchCatalog[id as SearchId].docPath;
      }
    }
  }
  return paths;
}
