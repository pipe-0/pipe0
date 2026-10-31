import {
  pipeCatalog,
  providerCatalog,
  searchCatalog,
  type PipeId,
  type ProviderName,
  type SearchId,
} from "@pipe0/base";
import { createServerFn } from "@tanstack/react-start";
import { providerTileColor } from "./provider-tile";

// @pipe0/base weighs about 2 MB. Marketing pages read one or two facts from
// it, so they get those through a server function and leave it out of their
// bundles.

export const getProviderTiles = createServerFn({ method: "GET" })
  .validator((ids: string[]) => ids)
  .handler(({ data }) =>
    data.flatMap((id) => {
      const provider = providerCatalog[id as ProviderName];
      if (!provider?.logoUrl) return [];
      return [
        {
          id,
          label: provider.label,
          logoUrl: provider.logoUrl,
          tileColor: providerTileColor(provider) ?? null,
        },
      ];
    }),
  );

/** Doc paths for the operations the installed catalog has. */
export const getCatalogDocPaths = createServerFn({ method: "GET" })
  .validator((ids: string[]) => ids)
  .handler(({ data }) => {
    const paths: Record<string, string> = {};
    for (const id of data) {
      if (Object.hasOwn(pipeCatalog, id)) {
        paths[id] = pipeCatalog[id as PipeId].docPath;
      } else if (Object.hasOwn(searchCatalog, id)) {
        paths[id] = searchCatalog[id as SearchId].docPath;
      }
    }
    return paths;
  });
