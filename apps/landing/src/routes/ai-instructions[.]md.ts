import { createFileRoute } from "@tanstack/react-router";
import { aiInstructionsMarkdown } from "@/lib/ai-instructions";

/** /ai-instructions as plain markdown, for crawlers and agents. */
export const Route = createFileRoute("/ai-instructions.md")({
  server: {
    handlers: {
      GET: () =>
        new Response(aiInstructionsMarkdown(), {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        }),
    },
  },
});
