import { sortedPosts, usedCategories } from "@/app/blog/blog-utils";
import type { Metadata } from "next";
import { BlogIndexView } from "./index-view";

export const metadata: Metadata = {
  title: "Blog — Data Enrichment & Sales Automation",
  description:
    "Guides on data enrichment, finding and validating emails, Clay alternatives, and engineering notes from the pipe0 team.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  // Thinking (the first category with posts) is the default view at /blog;
  // the other categories live at /blog/category/[category].
  const categories = usedCategories(sortedPosts());
  return <BlogIndexView activeCategory={categories[0]} />;
}
