import { docsContent } from "@/components/features/docs/docs-mdx-page";
import { getDocsPage } from "@/lib/docs.functions";
import { docsHead, splatSlugs } from "@/lib/docs-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/$")({
  loader: async ({ params }) => {
    const page = await getDocsPage(splatSlugs(params._splat));
    await docsContent.preload(page.path);
    return page;
  },
  head: ({ loaderData }) => docsHead(loaderData),
  component: Page,
});

function Page() {
  const page = Route.useLoaderData();
  return docsContent.useContent(page.path, { page });
}
