import { jsonLd } from "@/components/seo/json-ld";
import type { DocsPageData } from "@/lib/docs.server";
import { seo } from "@/lib/seo";

/** Head for any docs page, from the data its loader returned. */
export function docsHead(page: DocsPageData | undefined) {
  if (!page) return {};
  return {
    ...seo({
      title: page.snippet.title,
      description: page.snippet.description,
      path: page.url,
      image: page.image,
      ogType: null,
      siteName: false,
    }),
    scripts: page.jsonLd.map(jsonLd),
  };
}

export const splatSlugs = (splat: string | undefined) =>
  (splat ?? "").split("/").filter(Boolean);
