import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs.mdx")({
  server: {
    handlers: {
      GET: async () =>
        (await import("@/lib/docs-markdown.server")).docsMarkdown([]),
    },
  },
});
