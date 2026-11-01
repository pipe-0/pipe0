import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat-index.json")({
  server: {
    handlers: {
      GET: async () => (await import("@/lib/text/chat-index.server")).GET(),
    },
  },
});
