import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_article/blog/rss.xml")({
  server: {
    handlers: {
      GET: async () => (await import("@/lib/text/rss.server")).rssFeed(),
    },
  },
});
