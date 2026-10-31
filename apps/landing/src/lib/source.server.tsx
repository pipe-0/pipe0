import {
  type InferMetaType,
  type InferPageType,
  loader,
} from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { openapi } from "./openapi.server";
import {
  catalogEntryTreePlugin,
  catalogIconPlugin,
} from "./catalog-sidebar-plugin";
import { docs } from "collections/server";
import { createPipeCatalogSource } from "./pipe-catalog-source";
import { createSearchCatalogSource } from "./search-catalog-source";

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];
  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    pipes: createPipeCatalogSource(),
    searches: createSearchCatalogSource(),
  },
  {
    baseUrl: "/docs",
    plugins: [
      lucideIconsPlugin(),
      openapi.loaderPlugin(),
      catalogIconPlugin(),
      catalogEntryTreePlugin(),
    ],
  },
);

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
