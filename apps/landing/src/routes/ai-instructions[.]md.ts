import { aiInstructionsMarkdown } from "@/lib/ai-instructions";

export const revalidate = false;

/** /ai-instructions as plain markdown, for crawlers and agents. */
export function GET() {
  return new Response(aiInstructionsMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
