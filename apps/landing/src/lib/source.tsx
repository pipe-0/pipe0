import {
  type InferMetaType,
  type InferPageType,
  loader,
  multiple,
} from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { openapiPlugin } from "fumadocs-openapi/server";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { catalogIconPlugin } from "./catalog-sidebar-plugin";
import { blog as blogPosts, docs } from "fumadocs-mdx:collections/server";
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
export const source = loader({
  baseUrl: "/docs",
  source: multiple({
    docs: docs.toFumadocsSource(),
    pipes: createPipeCatalogSource(),
    searches: createSearchCatalogSource(),
  }),
  plugins: [lucideIconsPlugin(), openapiPlugin(), catalogIconPlugin()],
});

export const blog = loader(toFumadocsSource(blogPosts, []), {
  baseUrl: "/blog",
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
export type BlogPage = InferPageType<typeof blog>;
