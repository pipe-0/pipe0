import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { docs } from "collections/server";
import { openapi } from "./openapi.server";

/** The authored docs. Catalog entries live in catalog.server.ts. */
export const source = loader(docs.toFumadocsSource(), {
  baseUrl: "/docs",
  plugins: [lucideIconsPlugin(), openapi.loaderPlugin()],
});

export type Page = InferPageType<typeof source>;

export const isCatalogEntry = (slugs: string[]) =>
  slugs.length > 1 &&
  (slugs[0] === "pipe-catalog" || slugs[0] === "search-catalog");

/** The social card of a docs URL. */
export const docsImage = (url: string) => `/og${url}/image.png`;
