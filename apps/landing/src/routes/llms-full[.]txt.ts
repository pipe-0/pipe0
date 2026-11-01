import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async () => (await import("@/lib/text/llms-full.server")).GET(),
    },
  },
});
