import { categoryFromSlug } from "@/components/blog/blog-utils";
import { getAuthor, getAuthorBySlug } from "@/lib/authors";
import {
  blogIndexData,
  postsByAuthor,
  relatedPosts,
  toFeedPost,
} from "@/lib/blog.server";
import { plainPage } from "@/lib/content.server";
import { blog } from "@/lib/source.server";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const getBlogIndex = createServerFn({ method: "GET" }).handler(() =>
  blogIndexData(),
);

export const getBlogCategory = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data }) => {
    const category = categoryFromSlug(data);
    if (!category) throw notFound();
    return blogIndexData(category);
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data }) => {
    const page = blog.getPage([data]);
    // Drafts 404 like missing pages.
    if (!page || page.data.draft === true) throw notFound();
    return {
      post: plainPage(page),
      related: relatedPosts(page, 2).map(plainPage),
    };
  });

export const getAuthorPage = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data }) => {
    const author = getAuthorBySlug(data);
    if (!author) throw notFound();
    const posts = postsByAuthor(author.key);
    return {
      slug: author.slug,
      posts: posts.map((p) => toFeedPost(p, 2)),
      newest: posts.map((p) => p.data.updated ?? p.data.date),
    };
  });
