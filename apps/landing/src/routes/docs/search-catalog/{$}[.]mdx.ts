import { docsMarkdown } from "@/lib/docs-markdown.server";
import { splatSlugs } from "@/lib/docs-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/search-catalog/{$}.mdx")({
  server: {
    handlers: {
      GET: ({ params }) =>
        docsMarkdown(["search-catalog", ...splatSlugs(params._splat)]),
    },
  },
});
