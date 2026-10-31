import { categoryFromSlug } from "@/components/blog/blog-utils";
import { createIsomorphicFn } from "@tanstack/react-start";
import { found, readData } from "./static-data";

export const getBlogIndex = createIsomorphicFn()
  .server(async () => (await import("./blog.server")).blogIndexData())
  .client(() => readData("blog-index"));

export const getBlogCategory = createIsomorphicFn()
  .server(async (slug: string) => {
    const { blogIndexData } = await import("./blog.server");
    return blogIndexData(found(categoryFromSlug(slug)));
  })
  .client((slug) => readData("blog-category", slug));

export const getBlogPost = createIsomorphicFn()
  .server(async (slug: string) => {
    const { blogPostData } = await import("./blog.server");
    return found(blogPostData(slug));
  })
  .client((slug) => readData("blog-post", slug));

export const getAuthorPage = createIsomorphicFn()
  .server(async (slug: string) => {
    const { authorPageData } = await import("./blog.server");
    return found(authorPageData(slug));
  })
  .client((slug) => readData("author", slug));
