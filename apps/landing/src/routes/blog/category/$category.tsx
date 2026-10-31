import { BlogIndexView } from "@/components/blog/index-view";
import { breadcrumbJsonLd, jsonLd } from "@/components/seo/json-ld";
import { getBlogCategory } from "@/lib/blog.functions";
import { seo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/category/$category")({
  loader: ({ params }) => getBlogCategory({ data: params.category }),
  head: ({ loaderData: view }) =>
    view
      ? {
          ...seo({
            title: `${view.activeCategory} — Blog`,
            description: view.description,
            path: view.path,
            inherited: true,
          }),
          scripts: [
            jsonLd(
              breadcrumbJsonLd([
                { name: "pipe0", url: "/" },
                { name: "Blog", url: "/blog" },
                { name: view.activeCategory!, url: view.path },
              ]),
            ),
          ],
        }
      : {},
  component: BlogCategory,
});

function BlogCategory() {
  return <BlogIndexView view={Route.useLoaderData()} />;
}
