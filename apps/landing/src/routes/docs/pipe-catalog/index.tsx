import { PipeCatalogIndexPage } from "@/components/features/docs/pipe-catalog-index-page";
import { getDocsPage } from "@/lib/docs.functions";
import { docsHead } from "@/lib/docs-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/pipe-catalog/")({
  loader: () => getDocsPage(["pipe-catalog"]),
  head: ({ loaderData }) => docsHead(loaderData),
  component: Page,
});

function Page() {
  return <PipeCatalogIndexPage nav={Route.useLoaderData().nav} />;
}
