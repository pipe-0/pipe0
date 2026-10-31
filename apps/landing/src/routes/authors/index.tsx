import { createFileRoute, notFound } from "@tanstack/react-router";

/** Author pages live at /authors/<slug>; there is no index. */
export const Route = createFileRoute("/authors/")({
  beforeLoad: () => {
    throw notFound();
  },
});
