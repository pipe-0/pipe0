import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/{$slug}.md")({
  server: {
    handlers: {
      GET: async ({ params }) =>
        (await import("@/lib/text/blog-markdown.server")).GET({ params }),
    },
  },
});
