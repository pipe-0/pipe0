import { SHADOWED_POST } from "@/components/blog/blog-utils";
import { type InferPageType, loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import {
  blog as blogPosts,
  legal as legalPages,
  reviews as reviewPages,
} from "collections/server";

export const blog = loader(
  toFumadocsSource(
    blogPosts.filter((post) => post.info.path !== SHADOWED_POST),
    [],
  ),
  { baseUrl: "/blog" },
);

export const reviews = loader(toFumadocsSource(reviewPages, []), {
  baseUrl: "/reviews",
});

export const legal = loader(toFumadocsSource(legalPages, []), {
  baseUrl: "/resources/legal",
});

export type BlogPage = InferPageType<typeof blog>;
export type ReviewPage = InferPageType<typeof reviews>;
