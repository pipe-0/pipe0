import {
  type InferMetaType,
  type InferPageType,
  loader,
} from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { openapi } from "./openapi";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { catalogIconPlugin } from "./catalog-sidebar-plugin";
import {
  blog as blogPosts,
  docs,
  legal as legalPages,
} from "collections/server";
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
    plugins: [lucideIconsPlugin(), openapi.loaderPlugin(), catalogIconPlugin()],
  },
);

export const blog = loader(toFumadocsSource(blogPosts, []), {
  baseUrl: "/blog",
});

export const legal = loader(toFumadocsSource(legalPages, []), {
  baseUrl: "/resources/legal",
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
export type BlogPage = InferPageType<typeof blog>;
