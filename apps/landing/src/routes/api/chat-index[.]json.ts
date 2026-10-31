import { getLLMText } from "@/lib/get-llm-text.server";
import { source } from "@/lib/source.server";
import { createFileRoute } from "@tanstack/react-router";

/** Docs text for Ask AI, prerendered so the chat Worker reads a file. */
export const Route = createFileRoute("/api/chat-index.json")({
  server: {
    handlers: {
      GET: async () => {
        const pages = source.getPages();
        const texts = await Promise.all(pages.map(getLLMText));
        return Response.json(
          pages.map((page, i) => ({
            url: page.url,
            title: page.data.title ?? "",
            description: page.data.description ?? "",
            content: texts[i] ?? "",
          })),
        );
      },
    },
  },
});
