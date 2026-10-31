import { SearchCatalogIndexPage } from "@/components/features/docs/search-catalog-index-page";
import { getDocsPage } from "@/lib/docs.functions";
import { docsHead } from "@/lib/docs-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/search-catalog/")({
  loader: () => getDocsPage({ data: ["search-catalog"] }),
  head: ({ loaderData }) => docsHead(loaderData),
  component: Page,
});

function Page() {
  const { searchEntryMap, nav } = Route.useLoaderData();
  return <SearchCatalogIndexPage searchEntryMap={searchEntryMap!} nav={nav} />;
}
