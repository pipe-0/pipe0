import { blog } from "@/lib/collections.server";
import { getPageImage, source } from "@/lib/source.server";

/**
 * Every social card the build renders. The prerenderer writes text only, so
 * this list reaches scripts/generate-og.tsx, which writes the PNGs.
 */
export function GET() {
  return Response.json([
    ...source.getPages().map((page) => ({
      path: getPageImage(page).url,
      title: page.data.title,
      description: page.data.description,
    })),
    ...blog
      .getPages()
      .filter((page) => page.data.draft !== true)
      .map((page) => ({
        path: `/og/blog/${page.slugs[0]}`,
        title: page.data.title,
        description: page.data.excerpt ?? page.data.description,
      })),
  ]);
}
