import {
  CATEGORY_DESCRIPTIONS,
  categorySlug,
  formatDate,
  lastRevised,
  postCover,
  usedCategories,
  type Category,
} from "@/components/blog/blog-utils";
import type { FeedPost } from "@/components/blog/post-feed";
import { authorDisplayName, getAuthorBySlug } from "@/lib/authors";
import { blog, type BlogPage } from "@/lib/collections.server";
import { plainPage } from "@/lib/content.server";

/** Published posts, newest first. Drafts never leave the repo. */
export function sortedPosts(): BlogPage[] {
  return blog
    .getPages()
    .filter((p) => p.data.draft !== true)
    .sort(
      (a, b) =>
        new Date(b.data.date ?? 0).getTime() -
        new Date(a.data.date ?? 0).getTime(),
    );
}

/** Related reading — editors' picks far outweigh topical overlap; newest wins ties. */
export function relatedPosts(current: BlogPage, count: number): BlogPage[] {
  const posts = sortedPosts().filter((p) => p.url !== current.url);
  const currentTags = new Set(
    (current.data.tags ?? []).map((t) => t.toLowerCase()),
  );
  const score = (p: BlogPage) =>
    (p.data.highlight ? 4 : 0) +
    ((p.data.tags ?? []).some((t) => currentTags.has(t.toLowerCase()))
      ? 2
      : 0) +
    (p.data.category === current.data.category ? 1 : 0);
  // Stable sort — posts stay newest-first within the same score.
  return posts.sort((a, b) => score(b) - score(a)).slice(0, count);
}

/** Published posts by one author, newest first. Matches the frontmatter name. */
export function postsByAuthor(authorKey: string): BlogPage[] {
  const key = authorKey.toLowerCase();
  return sortedPosts().filter((p) =>
    p.data.authors?.some((a) => a.name.trim().toLowerCase() === key),
  );
}

export function toFeedPost(post: BlogPage, ratio: number): FeedPost {
  const author = post.data.authors?.[0];
  return {
    url: post.url,
    title: post.data.title,
    excerpt: post.data.excerpt,
    cover: postCover(post, ratio),
    authorName: author ? authorDisplayName(author.name) : "pipe0 team",
    authorMeta:
      [
        author?.title ?? null,
        post.data.date ? formatDate(post.data.date) : null,
      ]
        .filter(Boolean)
        .join(" · ") || undefined,
    category: post.data.category,
  };
}

/** What the blog index needs, for /blog or one category. */
export function blogIndexData(activeCategory?: Category) {
  const posts = sortedPosts();
  const filtered = activeCategory
    ? posts.filter((post) => post.data.category === activeCategory)
    : posts;

  // The hero is the view's freshest editors' pick (falling back to the
  // newest post); everything else flows into the grid, newest first.
  const hero = filtered.find((p) => p.data.highlight) ?? filtered[0];
  const rest = filtered.filter((p) => p !== hero);

  return {
    activeCategory,
    description: activeCategory
      ? CATEGORY_DESCRIPTIONS[activeCategory]
      : undefined,
    path: activeCategory
      ? `/blog/category/${categorySlug(activeCategory)}`
      : "/blog",
    postCount: filtered.length,
    updated: filtered
      .map(lastRevised)
      .sort((a, b) => b.getTime() - a.getTime())[0]
      ?.toISOString(),
    chips: [
      { key: "all", label: "All", count: posts.length, href: "/blog" },
      ...usedCategories(posts).map((category) => ({
        key: category as string,
        label: category as string,
        count: posts.filter((p) => p.data.category === category).length,
        href: `/blog/category/${categorySlug(category)}`,
      })),
    ],
    hero: hero && toFeedPost(hero, 16 / 9),
    feed: rest.map((p) => toFeedPost(p, 2)),
  };
}

export type BlogIndexData = ReturnType<typeof blogIndexData>;

export function blogPostData(slug: string) {
  const page = blog.getPage([slug]);
  // Drafts 404 like missing pages.
  if (!page || page.data.draft === true) return undefined;
  return {
    post: plainPage(page),
    related: relatedPosts(page, 2).map(plainPage),
  };
}

export function authorPageData(slug: string) {
  const author = getAuthorBySlug(slug);
  if (!author) return undefined;
  const posts = postsByAuthor(author.key);
  return {
    slug: author.slug,
    posts: posts.map((p) => toFeedPost(p, 2)),
    newest: posts.map((p) => p.data.updated ?? p.data.date),
  };
}
