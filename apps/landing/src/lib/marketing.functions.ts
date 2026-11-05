import { createIsomorphicFn } from "@tanstack/react-start";
import type { catalogDocPaths, providerTiles } from "./marketing.server";
import { readData } from "./static-data";

// @pipe0/base weighs about 2 MB. Marketing pages read one or two facts from
// it, so they get those as data and leave it out of their bundles.

export const getProviderTiles = createIsomorphicFn()
  .server(async () => (await import("./marketing.server")).providerTiles())
  .client(() => readData<ReturnType<typeof providerTiles>>("provider-tiles"));

export const getCatalogDocPaths = createIsomorphicFn()
  .server(async () => (await import("./marketing.server")).catalogDocPaths())
  .client(() =>
    readData<ReturnType<typeof catalogDocPaths>>("catalog-doc-paths"),
  );
