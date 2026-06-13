import {
  allTags,
  displayTag,
  formatDate,
  sortedPosts,
  titleGradient,
} from "@/app/blog/blog-utils";
import type { BlogPage } from "@/lib/source";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest posts from the Pipe0 blog",
};

const PAGE_SIZE = 9;
const NEWEST_COUNT = 3;
const NEWEST = "newest";

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const posts = sortedPosts();
  const tags = allTags(posts);

  const activeTag =
    params.tag && tags.includes(params.tag.toLowerCase())
      ? params.tag.toLowerCase()
      : NEWEST;

  const filtered =
    activeTag === NEWEST
      ? posts
      : posts.filter((post) =>
          (post.data.tags ?? []).some((t) => t.toLowerCase() === activeTag),
        );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
    pageCount,
  );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hrefFor = (p: number) =>
    activeTag === NEWEST
      ? `/blog?page=${p}`
      : `/blog?tag=${encodeURIComponent(activeTag)}&page=${p}`;

  const tabs = [
    { key: NEWEST, label: "Newest", href: "/blog" },
    ...tags.map((tag) => ({
      key: tag,
      label: displayTag(tag),
      href: `/blog?tag=${encodeURIComponent(tag)}`,
    })),
  ];

  return (
    <main className="mx-auto w-full max-w-300 px-6 py-16 md:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-2 text-fd-muted-foreground">
          Updates, guides, and thoughts from the Pipe0 team.
        </p>
      </div>

      {/* Tag tabs — Newest (latest three + the full archive) is the default */}
      <nav
        aria-label="Blog post groups"
        className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b pb-3"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              "text-sm transition-colors",
              tab.key === activeTag
                ? "font-semibold text-fd-foreground"
                : "text-fd-muted-foreground hover:text-fd-foreground",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTag === NEWEST && (
        <>
          <PostGrid posts={posts.slice(0, NEWEST_COUNT)} />
          <hr className="my-14 border-fd-border" />
          <h2 className="mb-8 text-xl font-semibold tracking-tight">All</h2>
        </>
      )}

      <PostGrid posts={paged} />

      {pageCount > 1 && (
        <Pagination page={page} pageCount={pageCount} hrefFor={hrefFor} />
      )}
    </main>
  );
}

function PostGrid({ posts }: { posts: BlogPage[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.url} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: BlogPage }) {
  const tag = post.data.tags?.[0];
  return (
    <Link href={post.url} className="group flex flex-col">
      <div
        className="aspect-square w-full rounded-xl transition-opacity group-hover:opacity-90"
        style={{ background: titleGradient(post.data.title) }}
        aria-hidden
      />
      <p className="mt-4 text-[17px] font-medium leading-snug text-fd-foreground">
        {post.data.title}
      </p>
      <p className="mt-2.5 flex items-center gap-3 text-sm">
        {tag && (
          <span className="font-semibold text-fd-foreground">
            {displayTag(tag)}
          </span>
        )}
        {post.data.date && (
          <span className="text-fd-muted-foreground">
            {formatDate(post.data.date)}
          </span>
        )}
      </p>
    </Link>
  );
}

function Pagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className="rounded-md border px-3 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          ← Previous
        </Link>
      ) : (
        <span className="rounded-md border px-3 py-1.5 text-sm text-fd-muted-foreground/40">
          ← Previous
        </span>
      )}
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "grid size-8 place-items-center rounded-md text-sm transition-colors",
            p === page
              ? "bg-fd-primary font-medium text-fd-primary-foreground"
              : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground",
          )}
        >
          {p}
        </Link>
      ))}
      {page < pageCount ? (
        <Link
          href={hrefFor(page + 1)}
          className="rounded-md border px-3 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded-md border px-3 py-1.5 text-sm text-fd-muted-foreground/40">
          Next →
        </span>
      )}
    </nav>
  );
}
