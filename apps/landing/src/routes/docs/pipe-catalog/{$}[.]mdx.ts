import { splatSlugs } from "@/lib/docs-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/pipe-catalog/{$}.mdx")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { docsMarkdown } = await import("@/lib/docs-markdown.server");
        return docsMarkdown(["pipe-catalog", ...splatSlugs(params._splat)]);
      },
    },
  },
});
