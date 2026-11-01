import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) =>
        (await import("@/lib/chat/chat.server")).handleChat(request),
    },
  },
});
