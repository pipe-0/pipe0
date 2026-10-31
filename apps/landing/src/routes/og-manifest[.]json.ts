import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/og-manifest.json")({
  server: {
    handlers: {
      GET: async () => (await import("@/lib/text/og-manifest.server")).GET(),
    },
  },
});
