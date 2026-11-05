import { legalFile } from "@/lib/legal";
import { seo } from "@/lib/seo";
import { getMDXComponents } from "@/components/mdx";
import { createFileRoute, notFound } from "@tanstack/react-router";
import browserCollections from "collections/browser";

const content = browserCollections.legal.createClientLoader({
  id: "legal",
  component({ default: Mdx }) {
    return (
      <article className="legal-document mx-auto flex w-full max-w-[720px] flex-col px-6 py-16 md:py-20">
        <div className="prose min-w-0 flex-1">
          <Mdx components={getMDXComponents()} />
        </div>
      </article>
    );
  },
});

export const Route = createFileRoute("/resources/legal/$")({
  loader: async ({ params }) => {
    const path = legalFile(params._splat ?? "");
    if (!path) throw notFound();
    const { frontmatter } = await content.preload(path);
    return {
      path,
      url: `/resources/legal/${params._splat}`,
      title: frontmatter.title,
      description: frontmatter.description,
    };
  },
  head: ({ loaderData: page }) =>
    page
      ? seo({
          title: page.title,
          description: page.description,
          path: page.url,
          image: "/resources/opengraph-image-5fam9d",
        })
      : {},
  component: LegalPage,
});

function LegalPage() {
  return content.useContent(Route.useLoaderData().path);
}
