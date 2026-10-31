import { docsMarkdown } from "@/lib/docs-markdown.server";
import { splatSlugs } from "@/lib/docs-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/{$}.mdx")({
  server: {
    handlers: {
      GET: ({ params }) => docsMarkdown([...splatSlugs(params._splat)]),
    },
  },
});
