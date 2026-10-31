import { docsMarkdown } from "@/lib/docs-markdown.server";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs.mdx")({
  server: { handlers: { GET: () => docsMarkdown([]) } },
});
