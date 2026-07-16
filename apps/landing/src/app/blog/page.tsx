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

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest posts from the pipe0 blog",
};

const PAGE_SIZE = 8;
const NEWEST = "newest";

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const posts = sortedPosts();
  const categories = usedCategories(posts);

  const activeCategory =
    (params.category && categoryFromSlug(params.category)) || NEWEST;

  const filtered =
    activeCategory === NEWEST
      ? posts
      : posts.filter((post) => post.data.category === activeCategory);

  // The hero is the freshest editors' pick (falling back to the newest
  // post); everything else flows into the grid.
  const hero = filtered.find((p) => p.data.highlight) ?? filtered[0];
  const rest = filtered.filter((p) => p !== hero);

  const pageCount = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
    pageCount,
  );
  const paged = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hrefFor = (p: number) =>
    activeCategory === NEWEST
      ? `/blog?page=${p}`
      : `/blog?category=${categorySlug(activeCategory)}&page=${p}`;

  const tabs = [
    { key: NEWEST, label: "Newest", href: "/blog" },
    ...categories.map((category) => ({
      key: category,
      label: category,
      href: `/blog?category=${categorySlug(category)}`,
    })),
  ];

  return (
    // Same container as the HomeLayout header: --fd-layout-width + px-4
    <main className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-12 md:py-14">
      <div className="flex flex-col gap-9 md:flex-row md:items-start md:gap-12">
        {/* Masthead rail — title, standfirst, and the tag nav */}
        <aside className="md:sticky md:top-24 md:w-[200px] md:shrink-0">
          <h1 className="font-blog text-[38px] leading-none font-bold tracking-[-0.01em] text-fd-foreground md:text-[46px]">
            Blog<span className="text-fd-primary">.</span>
          </h1>
          <p className="mt-3.5 text-[13.5px] leading-relaxed text-fd-muted-foreground text-pretty">
            Updates, guides, and thoughts from the pipe0 team.
          </p>
          <nav
            aria-label="Blog post groups"
            className="mt-5 flex flex-wrap gap-x-5 border-t border-fd-border pt-3.5 md:mt-6 md:flex-col md:gap-0 md:pt-4"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                className={cn(
                  "py-1.5 text-sm transition-colors",
                  tab.key === activeCategory
                    ? "font-semibold text-fd-primary"
                    : "text-fd-muted-foreground hover:text-fd-foreground",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {hero && page === 1 && (
            <>
              <FeaturedPost post={hero} />
              <hr className="mt-10 border-fd-border" />
            </>
          )}

          <PostGrid posts={paged} />

          {pageCount > 1 && (
            <Pagination page={page} pageCount={pageCount} hrefFor={hrefFor} />
          )}
        </div>
      </div>
    </main>
  );
}

function FeaturedPost({ post }: { post: BlogPage }) {
  return (
    <Link
      href={post.url}
      className="group flex flex-wrap items-center gap-8 lg:gap-10"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={postCover(post, 4 / 3)}
        alt=""
        className="aspect-[4/3] w-full min-w-0 flex-[1.15_1_340px] rounded-xl object-cover ring-1 ring-fd-foreground/10 transition-opacity group-hover:opacity-90"
      />
      <div className="flex flex-[1_1_280px] flex-col gap-3.5">
        <h2 className="font-blog text-[27px] font-bold leading-[1.15] tracking-[-0.01em] text-fd-foreground text-pretty md:text-[32px]">
          {post.data.title}
        </h2>
        {post.data.excerpt && (
          <p className="font-blog text-[17px] leading-[1.55] text-fd-muted-foreground text-pretty">
            {post.data.excerpt}
          </p>
        )}
        <PostByline post={post} size="md" />
      </div>
    </Link>
  );
}

function PostGrid({ posts }: { posts: BlogPage[] }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.url} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: BlogPage }) {
  return (
    <Link href={post.url} className="group flex flex-col gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={postCover(post, 1.5)}
        alt=""
        className="aspect-[3/2] w-full rounded-xl object-cover ring-1 ring-fd-foreground/10 transition-opacity group-hover:opacity-90"
      />
      <h3 className="font-blog mt-1 text-[21.5px] font-bold leading-[1.22] tracking-[-0.005em] text-fd-foreground text-pretty transition-colors group-hover:text-fd-primary">
        {post.data.title}
      </h3>
      {post.data.excerpt && (
        <p className="font-blog -mt-0.5 line-clamp-2 text-[14.5px] leading-[1.55] text-fd-muted-foreground">
          {post.data.excerpt}
        </p>
      )}
      <PostByline post={post} size="sm" />
    </Link>
  );
}

function PostByline({ post, size }: { post: BlogPage; size: "sm" | "md" }) {
  const author = post.data.authors?.[0];

  return (
    <div className="flex items-center gap-2 text-[12.5px]">
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full bg-fd-muted font-semibold text-fd-muted-foreground",
          size === "md" ? "size-6 text-[9.5px]" : "size-5 text-[8.5px]",
        )}
      >
        {author ? authorInitials(author.name) : "p0"}
      </span>
      <span className="font-medium text-fd-foreground">
        {author?.name ?? "pipe0 team"}
      </span>
      {post.data.date && (
        <span className="text-fd-muted-foreground">
          · {formatDate(post.data.date)}
        </span>
      )}
    </div>
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
