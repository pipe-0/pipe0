import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => (await import("@/lib/text/sitemap.server")).GET(),
    },
  },
});
