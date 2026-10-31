import { getLegalPage } from "@/lib/legal.functions";
import { seo } from "@/lib/seo";
import { getMDXComponents } from "@/mdx-components";
import { createFileRoute } from "@tanstack/react-router";
import browserCollections from "collections/browser";

const content = browserCollections.legal.createClientLoader({
  id: "legal",
  component({ default: Mdx }) {
    return (
      <article className="legal-document mx-auto flex w-full max-w-[720px] flex-col px-6 py-16 md:py-20">
        <div className="prose min-w-0 flex-1">
          <Mdx components={getMDXComponents({})} />
        </div>
      </article>
    );
  },
});

export const Route = createFileRoute("/_marketing/resources/legal/$")({
  loader: async ({ params }) => {
    const page = await getLegalPage(
      (params._splat ?? "").split("/").filter(Boolean),
    );
    await content.preload(page.path);
    return page;
  },
  head: ({ loaderData: page }) =>
    page
      ? seo({
          title: page.title,
          description: page.description,
          path: page.url,
          image: "/resources/opengraph-image-5fam9d",
          inherited: true,
        })
      : {},
  component: LegalPage,
});

function LegalPage() {
  return content.useContent(Route.useLoaderData().path);
}
