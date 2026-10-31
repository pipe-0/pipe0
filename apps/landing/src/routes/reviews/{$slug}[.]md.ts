import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reviews/{$slug}.md")({
  server: {
    handlers: {
      GET: async ({ params }) =>
        (await import("@/lib/text/review-markdown.server")).GET({ params }),
    },
  },
});
