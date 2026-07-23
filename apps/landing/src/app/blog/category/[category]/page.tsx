import {
  categoryFromSlug,
  categorySlug,
  sortedPosts,
  usedCategories,
} from "@/app/blog/blog-utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndexView } from "../../index-view";

// Every category page is prerendered; unknown slugs 404 without a render.
export const dynamicParams = false;

export function generateStaticParams() {
  return usedCategories(sortedPosts()).map((category) => ({
    category: categorySlug(category),
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const categories = usedCategories(sortedPosts());
  return {
    title: `${category} — Blog`,
    description: `${category} posts from Signal & Noise, the pipe0 journal on data, pipelines, and the craft of building software.`,
    alternates: {
      // The default category is what /blog itself shows — point its path
      // twin back there so only one URL competes for it.
      canonical:
        category === categories[0] ? "/blog" : `/blog/category/${slug}`,
    },
  };
}

export default async function BlogCategory(props: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await props.params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  return <BlogIndexView activeCategory={category} />;
}
