import { getDocsPage, getDocsTree } from "@/lib/docs.functions";
import {
  getCatalogDocPaths,
  getProviderTiles,
} from "@/lib/marketing.functions";
import { createFileRoute, isNotFound } from "@tanstack/react-router";

/** The file behind each `readData()` call. scripts/prerender-pages.ts lists them. */
const files: Record<string, (key: string[]) => unknown> = {
  "docs-tree": () => getDocsTree(),
  docs: (slugs) => getDocsPage(slugs),
  "provider-tiles": () => getProviderTiles(),
  "catalog-doc-paths": () => getCatalogDocPaths(),
};

export const Route = createFileRoute("/data/{$}.json")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [name = "", ...key] = params._splat?.split("/") ?? [];
        try {
          const read = files[name];
          if (!read) return new Response(null, { status: 404 });
          return Response.json(await read(key));
        } catch (error) {
          if (isNotFound(error)) return new Response(null, { status: 404 });
          throw error;
        }
      },
    },
  },
});
