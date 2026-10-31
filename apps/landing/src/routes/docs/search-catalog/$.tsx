import { SearchEntryPage } from "@/components/features/docs/search-entry-page";
import { getDocsPage } from "@/lib/docs.functions";
import { docsHead, splatSlugs } from "@/lib/docs-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/search-catalog/$")({
  loader: ({ params }) =>
    getDocsPage({ data: ["search-catalog", ...splatSlugs(params._splat)] }),
  head: ({ loaderData }) => docsHead(loaderData),
  component: Page,
});

function Page() {
  return <SearchEntryPage searchId={Route.useLoaderData().searchId!} />;
}
