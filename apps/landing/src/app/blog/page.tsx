import { BLOG_DESCRIPTION } from "@/app/blog/blog-utils";
import type { Metadata } from "next";
import { BlogIndexView } from "./index-view";

export const metadata: Metadata = {
  title: "Blog — Data Enrichment & Sales Automation",
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

/** Every published post; sections live at /blog/category/[category]. */
export default function BlogIndex() {
  return <BlogIndexView />;
}
