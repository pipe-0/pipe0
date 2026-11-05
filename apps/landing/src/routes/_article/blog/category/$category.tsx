import { BlogIndexView } from "@/components/blog/index-view";
import { breadcrumbJsonLd, jsonLd } from "@/components/seo/json-ld";
import { seo } from "@/lib/seo";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_article/blog/category/$category")({
  loader: async ({ params }) => {
    const { blogCategory } = await import("@/lib/blog");
    const view = blogCategory(params.category);
    if (!view) throw notFound();
    return view;
  },
  head: ({ loaderData: view }) =>
    view
      ? {
          ...seo({
            title: `${view.activeCategory} — Blog`,
            description: view.description,
            path: view.path,
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
