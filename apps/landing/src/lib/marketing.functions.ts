import { createIsomorphicFn } from "@tanstack/react-start";
import { readData } from "./static-data";

// @pipe0/base weighs about 2 MB. Marketing pages read one or two facts from
// it, so they get those as data and leave it out of their bundles.

export const getProviderTiles = createIsomorphicFn()
  .server(async () => (await import("./marketing.server")).providerTiles())
  .client(() => readData("provider-tiles"));

export const getCatalogDocPaths = createIsomorphicFn()
  .server(async () => (await import("./marketing.server")).catalogDocPaths())
  .client(() => readData("catalog-doc-paths"));
