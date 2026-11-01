import { createFileRoute } from "@tanstack/react-router";
import { aiInstructionsMarkdown } from "@/lib/ai-instructions";

/** /ai-instructions as plain markdown, for crawlers and agents. */
function GET() {
  return new Response(aiInstructionsMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

export const Route = createFileRoute("/ai-instructions.md")({
  server: { handlers: { GET } },
});
