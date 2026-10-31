import { blog, type BlogPage } from "@/lib/source.server";

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
