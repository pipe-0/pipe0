import {
  BLOG_DESCRIPTION,
  CATEGORY_DESCRIPTIONS,
} from "@/components/blog/blog-utils";
import { SiteLink } from "@/components/link";
import type { BlogIndexData } from "@/lib/blog.server";
import { cn, getBaseUrl } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Image } from "@/components/image";
import { PostByline, PostFeed, type FeedPost } from "./post-feed";
import { SummarizeActions } from "./share-actions";
import { PreferredSourceButton } from "./preferred-source-button";

/** "Sep 2026" — the index states freshness to the month. */
function monthYear(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The blog index — /blog shows every post, /blog/category/[category] one
 * section. Header first (what the blog is and how fresh it is), then
 * section chips, the editors' pick, and a three-column grid.
 */
export function BlogIndexView({
  view: { activeCategory, path, postCount, updated, chips, hero, feed },
}: {
  view: BlogIndexData;
}) {
  return (
    <>
      {/* Same container as the HomeLayout header: --fd-layout-width + px-4 */}
      <main className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-10 md:py-12">
        <header className="border-b border-fd-border pb-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[13px] text-fd-muted-foreground"
          >
            <Link to="/" className="transition-colors hover:text-fd-foreground">
              pipe0
            </Link>
            <span aria-hidden>/</span>
            {activeCategory ? (
              <>
                <Link
                  to="/blog"
                  className="transition-colors hover:text-fd-foreground"
                >
                  Blog
                </Link>
                <span aria-hidden>/</span>
                <span className="text-fd-foreground">{activeCategory}</span>
              </>
            ) : (
              <span className="text-fd-foreground">Blog</span>
            )}
          </nav>

          <h1 className="font-blog mt-4 text-[38px] font-bold leading-[1.05] tracking-[-0.02em] text-fd-foreground md:text-[48px]">
            {activeCategory ?? "Pipeline"}
          </h1>
          <p className="mt-4 max-w-[680px] text-[16px] leading-relaxed text-fd-muted-foreground text-pretty md:text-[17px]">
            {activeCategory
              ? CATEGORY_DESCRIPTIONS[activeCategory]
              : BLOG_DESCRIPTION}
          </p>

          <p className="mt-4 text-[13px] text-fd-muted-foreground">
            {updated && (
              <>
                Updated{" "}
                <span className="font-medium text-fd-foreground">
                  {monthYear(new Date(updated))}
                </span>
                {" · "}
              </>
            )}
            {postCount} posts
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SummarizeActions url={`${getBaseUrl()}${path}`} />
            <PreferredSourceButton className="md:ml-auto" />
          </div>
        </header>

        <nav aria-label="Blog sections" className="mt-8 flex flex-wrap gap-2">
          {chips.map((chip) => {
            const active =
              (chip.key === "all" && !activeCategory) ||
              chip.key === activeCategory;
            return (
              <SiteLink
                key={chip.key}
                href={chip.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] transition-colors",
                  active
                    ? "bg-fd-primary font-medium text-fd-primary-foreground"
                    : "text-fd-muted-foreground ring-1 ring-fd-border hover:bg-fd-accent hover:text-fd-foreground",
                )}
              >
                {chip.label}
                <span className={active ? "opacity-80" : "opacity-60"}>
                  {chip.count}
                </span>
              </SiteLink>
            );
          })}
        </nav>

        {hero && (
          <>
            <div className="mt-10">
              <FeaturedPost post={hero} />
            </div>
            <hr className="mt-10 border-fd-border" />
          </>
        )}

        <PostFeed key={activeCategory ?? "all"} posts={feed} />
      </main>
    </>
  );
}

function FeaturedPost({ post }: { post: FeedPost }) {
  return (
    <SiteLink
      href={post.url}
      className="group flex flex-wrap items-center gap-8 lg:gap-12"
    >
      <Image
        src={post.cover}
        alt=""
        sizes="(max-width: 1024px) 100vw, 700px"
        priority
        className="aspect-[16/9] w-full min-w-0 flex-[1.1_1_360px] rounded-lg object-cover ring-1 ring-fd-foreground/10 transition-opacity group-hover:opacity-90"
      />
      <div className="flex flex-[1_1_300px] flex-col">
        {post.category && (
          <span className="text-[13px] font-medium text-fd-primary">
            {post.category}
          </span>
        )}
        <h2 className="font-blog mt-1.5 text-[26px] font-bold leading-[1.18] tracking-[-0.01em] text-fd-foreground text-pretty md:text-[30px]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-fd-muted-foreground text-pretty">
            {post.excerpt}
          </p>
        )}
        <PostByline post={post} className="mt-5" />
      </div>
    </SiteLink>
  );
}
