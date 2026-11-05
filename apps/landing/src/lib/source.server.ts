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

// Checked against the list vite.config.ts embeds: on the Worker, a catalog URL
// only gets this far when no prerendered file matched it, and loading the
// catalog to say no costs two seconds and the isolate.
const catalogDocPaths = new Set(__CATALOG_DOC_PATHS__);

export const isCatalogEntry = (slugs: string[]) =>
  catalogDocPaths.has(`/docs/${slugs.join("/")}`);

/** The social card of a docs URL. */
export const docsImage = (url: string) => `/og${url}/image.png`;
