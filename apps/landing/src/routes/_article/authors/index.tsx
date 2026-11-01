import { createFileRoute, notFound } from "@tanstack/react-router";

/** Author pages live at /authors/<slug>; there is no index. */
export const Route = createFileRoute("/_article/authors/")({
  beforeLoad: () => {
    throw notFound();
  },
});
