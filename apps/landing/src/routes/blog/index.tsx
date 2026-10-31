import { BLOG_DESCRIPTION } from "@/components/blog/blog-utils";
import { BlogIndexView } from "@/components/blog/index-view";
import { breadcrumbJsonLd, jsonLd } from "@/components/seo/json-ld";
import { getBlogIndex } from "@/lib/blog.functions";
import { seo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/")({
  loader: () => getBlogIndex(),
  head: () => ({
    ...seo({
      title: "Blog — Data Enrichment & Sales Automation",
      description: BLOG_DESCRIPTION,
      path: "/blog",
      inherited: true,
      alternates: { "application/rss+xml": "/blog/rss.xml" },
    }),
    scripts: [
      jsonLd(
        breadcrumbJsonLd([
          { name: "pipe0", url: "/" },
          { name: "Blog", url: "/blog" },
        ]),
      ),
    ],
  }),
  component: BlogIndex,
});

/** Every published post; sections live at /blog/category/[category]. */
function BlogIndex() {
  return <BlogIndexView view={Route.useLoaderData()} />;
}
