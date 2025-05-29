import { normalizePages } from "nextra/normalize-pages";
import { getPageMap } from "nextra/page-map";

export async function getBlogPosts() {
  const { directories } = normalizePages({
    list: await getPageMap("/blog"),
    route: "/blog",
  });
  return directories
    .filter((pipeEntry) => pipeEntry.name !== "index" && pipeEntry.frontMatter)
    .sort(
      (a, b) => +new Date(b.frontMatter.date) - +new Date(a.frontMatter.date)
    );
}

export async function getTags() {
  const posts = await getBlogPosts();
  const tags = posts.flatMap((post) => {
    return post.frontMatter.tags || [];
  });
  return tags;
}
