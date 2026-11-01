import {
  CATEGORY_DESCRIPTIONS,
  categoryFromSlug,
  categorySlug,
  formatDate,
  lastRevised,
  postCover,
  SHADOWED_POST,
  usedCategories,
  type Category,
} from "@/components/blog/blog-utils";
import type { FeedPost } from "@/components/blog/post-feed";
import { authorDisplayName, getAuthorBySlug } from "@/lib/authors";
import {
  contentPages,
  type ContentPage,
  type Frontmatter,
} from "@/lib/content";

export type BlogPost = ContentPage<Frontmatter<"blog">>;

// Loaders import this module with import(), so these travel in one chunk that
// a page needs only when a client navigation reaches the blog.
const posts: BlogPost[] = contentPages(
  "/blog",
  import.meta.glob<Frontmatter<"blog">>("./**/index.mdx", {
    base: "/src/content/blog",
    query: { collection: "blog", only: "frontmatter" },
    import: "frontmatter",
    eager: true,
  }),
).filter((post) => post.path !== SHADOWED_POST);

/** Published posts, newest first. */
export function sortedPosts(): BlogPost[] {
  return posts
    .filter((post) => post.data.draft !== true)
    .sort(
      (a, b) =>
        new Date(b.data.date ?? 0).getTime() -
        new Date(a.data.date ?? 0).getTime(),
    );
}

/** Related reading — editors' picks far outweigh topical overlap; newest wins ties. */
function relatedPosts(current: BlogPost, count: number): BlogPost[] {
  const others = sortedPosts().filter((post) => post.url !== current.url);
  const currentTags = new Set(
    (current.data.tags ?? []).map((tag) => tag.toLowerCase()),
  );
  const score = (post: BlogPost) =>
    (post.data.highlight ? 4 : 0) +
    ((post.data.tags ?? []).some((tag) => currentTags.has(tag.toLowerCase()))
      ? 2
      : 0) +
    (post.data.category === current.data.category ? 1 : 0);
  // Stable sort — posts stay newest-first within the same score.
  return others.sort((a, b) => score(b) - score(a)).slice(0, count);
}

function toFeedPost(post: BlogPost, ratio: number): FeedPost {
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

function indexView(activeCategory?: Category) {
  const all = sortedPosts();
  const filtered = activeCategory
    ? all.filter((post) => post.data.category === activeCategory)
    : all;

  // The hero is the view's freshest editors' pick (falling back to the
  // newest post); everything else flows into the grid, newest first.
  const hero = filtered.find((post) => post.data.highlight) ?? filtered[0];
  const rest = filtered.filter((post) => post !== hero);

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
      { key: "all", label: "All", count: all.length, href: "/blog" },
      ...usedCategories(all).map((category) => ({
        key: category as string,
        label: category as string,
        count: all.filter((post) => post.data.category === category).length,
        href: `/blog/category/${categorySlug(category)}`,
      })),
    ],
    hero: hero && toFeedPost(hero, 16 / 9),
    feed: rest.map((post) => toFeedPost(post, 2)),
  };
}

export type BlogIndexData = ReturnType<typeof indexView>;

export const blogIndex = () => indexView();

export function blogCategory(slug: string) {
  const category = categoryFromSlug(slug);
  return category && indexView(category);
}

export function blogPost(slug: string) {
  // Drafts 404 like missing pages.
  const post = posts.find((p) => p.slug === slug && p.data.draft !== true);
  return post && { post, related: relatedPosts(post, 2) };
}

export function authorPage(slug: string) {
  const author = getAuthorBySlug(slug);
  if (!author) return undefined;
  const key = author.key.toLowerCase();
  const written = sortedPosts().filter((post) =>
    post.data.authors?.some((a) => a.name.trim().toLowerCase() === key),
  );
  return {
    slug: author.slug,
    posts: written.map((post) => toFeedPost(post, 2)),
    newest: written.map((post) => post.data.updated ?? post.data.date),
  };
}
