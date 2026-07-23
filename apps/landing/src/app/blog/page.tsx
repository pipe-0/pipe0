import {
  authorInitials,
  categoryFromSlug,
  categorySlug,
  formatDate,
  postCover,
  sortedPosts,
  usedCategories,
} from "@/app/blog/blog-utils";
import type { BlogPage } from "@/lib/source";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { PostByline, PostFeed, type FeedPost } from "./page.client";

export const metadata: Metadata = {
  title: "Blog — Data Enrichment & Sales Automation",
  description:
    "Guides on data enrichment, finding and validating emails, Clay alternatives, and engineering notes from the pipe0 team.",
  alternates: { canonical: "/blog" },
};

function toFeedPost(post: BlogPage, ratio: number): FeedPost {
  const author = post.data.authors?.[0];
  return {
    url: post.url,
    title: post.data.title,
    excerpt: post.data.excerpt,
    cover: postCover(post, ratio),
    authorName: author?.name ?? "pipe0 team",
    initials: author ? authorInitials(author.name) : "p0",
    authorMeta:
      [
        author?.title ? `${author.title}, pipe0` : null,
        post.data.date ? formatDate(post.data.date) : null,
      ]
        .filter(Boolean)
        .join(" · ") || undefined,
  };
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const posts = sortedPosts();
  const categories = usedCategories(posts);

  // Thinking (the first category) is the default view at /blog.
  const activeCategory =
    (params.category && categoryFromSlug(params.category)) || categories[0];

  const filtered = posts.filter(
    (post) => post.data.category === activeCategory,
  );

  // The hero is the category's freshest editors' pick (falling back to the
  // newest post); everything else flows into the grid, newest first.
  const hero = filtered.find((p) => p.data.highlight) ?? filtered[0];
  const rest = filtered.filter((p) => p !== hero);

  const tabs = categories.map((category) => ({
    key: category,
    label: category,
    href:
      category === categories[0]
        ? "/blog"
        : `/blog?category=${categorySlug(category)}`,
  }));

  return (
    // Same container as the HomeLayout header: --fd-layout-width + px-4
    <main className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-12 md:py-14">
      <div className="flex flex-col gap-9 md:flex-row md:items-stretch md:gap-0">
        {/* Masthead rail — title, standfirst, and the category nav */}
        <aside className="md:w-[210px] md:shrink-0 md:pr-8">
          <div className="md:sticky md:top-24">
            <h1 className="font-blog tracking-[-0.01em] text-fd-foreground">
              <span className="block text-[38px] leading-[0.95] font-bold md:text-[44px]">
                Signal
              </span>
              <span className="block text-[29px] leading-[1.15] font-medium italic md:text-[33px]">
                &amp; Noise
              </span>
            </h1>
            <p className="mt-4 text-[13.5px] leading-relaxed text-fd-muted-foreground text-pretty">
              A journal from pipe0 — on data, pipelines, and the craft of
              building software.
            </p>
            <hr className="mt-6 hidden w-10 border-fd-border md:block" />
            <nav
              aria-label="Blog categories"
              className="mt-5 flex flex-wrap gap-x-5 border-t border-fd-border pt-3.5 md:mt-4 md:flex-col md:gap-0 md:border-t-0 md:pt-0"
            >
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={cn(
                    "py-[5px] text-sm transition-colors",
                    tab.key === activeCategory
                      ? "font-semibold text-fd-primary"
                      : "text-fd-muted-foreground hover:text-fd-foreground",
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Hairline between rail and content — gives the whitespace an edge */}
        <div className="min-w-0 flex-1 md:border-l md:border-fd-border md:pl-12">
          {hero && (
            <>
              <FeaturedPost post={toFeedPost(hero, 16 / 9)} />
              <hr className="mt-10 border-fd-border" />
            </>
          )}

          <PostFeed
            key={activeCategory}
            posts={rest.map((p) => toFeedPost(p, 2))}
          />
        </div>
      </div>
    </main>
  );
}

function FeaturedPost({ post }: { post: FeedPost }) {
  return (
    <Link
      href={post.url}
      className="group flex flex-wrap items-center gap-8 lg:gap-12"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.cover}
        alt=""
        className="aspect-[16/9] w-full min-w-0 flex-[1.1_1_360px] rounded-lg object-cover ring-1 ring-fd-foreground/10 transition-opacity group-hover:opacity-90"
      />
      <div className="flex flex-[1_1_300px] flex-col">
        <h2 className="font-blog text-[26px] font-bold leading-[1.18] tracking-[-0.01em] text-fd-foreground text-pretty md:text-[30px]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-fd-muted-foreground text-pretty">
            {post.excerpt}
          </p>
        )}
        <PostByline post={post} className="mt-5" />
      </div>
    </Link>
  );
}
