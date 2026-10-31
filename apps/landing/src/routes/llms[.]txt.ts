import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => (await import("@/lib/text/llms.server")).GET(),
    },
  },
});
