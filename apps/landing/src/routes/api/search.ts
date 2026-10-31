import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async () =>
        (await import("@/lib/text/search-index.server")).staticGET(),
    },
  },
});
