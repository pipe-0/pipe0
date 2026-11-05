import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_article/blog/{$slug}.md")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { blogMarkdown } =
          await import("@/lib/text/blog-markdown.server");
        return blogMarkdown(params.slug);
      },
    },
  },
});
