import { PipeEntryPage } from "@/components/features/docs/pipe-entry-page";
import { getDocsPage } from "@/lib/docs.functions";
import { docsHead, splatSlugs } from "@/lib/docs-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/pipe-catalog/$")({
  loader: ({ params }) =>
    getDocsPage({ data: ["pipe-catalog", ...splatSlugs(params._splat)] }),
  head: ({ loaderData }) => docsHead(loaderData),
  component: Page,
});

function Page() {
  return <PipeEntryPage pipeId={Route.useLoaderData().pipeId!} />;
}
