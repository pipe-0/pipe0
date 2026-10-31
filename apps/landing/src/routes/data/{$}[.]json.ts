import {
  getAuthorPage,
  getBlogCategory,
  getBlogIndex,
  getBlogPost,
} from "@/lib/blog.functions";
import { getCompare } from "@/lib/compare/compare.functions";
import { getDocsPage, getDocsTree } from "@/lib/docs.functions";
import { getLatestLegalUrl, getLegalPage } from "@/lib/legal.functions";
import {
  getCatalogDocPaths,
  getProviderTiles,
} from "@/lib/marketing.functions";
import { getReview, getReviewsIndex } from "@/lib/reviews.functions";
import { getSiteFrame } from "@/lib/site.functions";
import { createFileRoute, isNotFound } from "@tanstack/react-router";

/** The file behind each `readData()` call. scripts/prerender-pages.ts lists them. */
const files: Record<string, (key: string[]) => unknown> = {
  "site-frame": () => getSiteFrame(),
  "docs-tree": () => getDocsTree(),
  docs: (slugs) => getDocsPage(slugs),
  "blog-index": () => getBlogIndex(),
  "blog-category": ([slug]) => getBlogCategory(slug!),
  "blog-post": ([slug]) => getBlogPost(slug!),
  author: ([slug]) => getAuthorPage(slug!),
  "reviews-index": () => getReviewsIndex(),
  review: ([slug]) => getReview(slug!),
  legal: (slugs) => getLegalPage(slugs),
  "legal-latest": ([family]) => getLatestLegalUrl(family!),
  compare: ([slug]) => getCompare(slug!),
  "provider-tiles": () => getProviderTiles(),
  "catalog-doc-paths": () => getCatalogDocPaths(),
};

export const Route = createFileRoute("/data/{$}.json")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [name = "", ...key] = params._splat?.split("/") ?? [];
        try {
          const read = files[name];
          if (!read) return new Response(null, { status: 404 });
          return Response.json(await read(key));
        } catch (error) {
          if (isNotFound(error)) return new Response(null, { status: 404 });
          throw error;
        }
      },
    },
  },
});
