import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

const docsTwin = rewritePath("/docs{/*path}", "/docs{/*path}.mdx");
const blogTwin = rewritePath("/blog/:slug", "/blog/:slug.md");

function markdownTwin(path: string) {
  if (/\.mdx?$/.test(path)) return false;
  return docsTwin.rewrite(path) || blogTwin.rewrite(path);
}

/**
 * Prerendered files and public/_redirects, at the URL that was asked for. The
 * asset layer knows catalog paths with their colons encoded and 307s the raw
 * form, which is the canonical one, so colons stay raw on the way out.
 */
async function fetchAsset(request: Request) {
  const url = new URL(request.url);
  const twin = isMarkdownPreferred(request) && markdownTwin(url.pathname);
  url.pathname = (twin || url.pathname).replaceAll(":", "%3A");

  const asset = await env.ASSETS.fetch(new Request(url, request));
  if (asset.status === 404) return undefined;

  const location = asset.headers.get("Location");
  if (!location) return asset;
  const redirect = new Response(asset.body, asset);
  redirect.headers.set("Location", location.replaceAll("%3A", ":"));
  return redirect;
}

/**
 * Category filters used to be /blog?category=<slug>; they now live at static
 * paths so /blog itself can prerender. _redirects cannot match on a query.
 */
function blogCategoryRedirect({ pathname, searchParams }: URL) {
  const category = searchParams.get("category");
  if (!category || !/^\/blog\/?$/i.test(pathname)) return undefined;

  const rest = new URLSearchParams(searchParams);
  rest.delete("category");
  const query = rest.size > 0 ? `?${rest}` : "";
  const slug = encodeURIComponent(category);
  return new Response(null, {
    status: 307,
    headers: { Location: `/blog/category/${slug}${query}` },
  });
}

export default createServerEntry({
  async fetch(request, opts) {
    const redirect = blogCategoryRedirect(new URL(request.url));
    if (redirect) return redirect;

    if (request.method === "GET" || request.method === "HEAD") {
      const asset = await fetchAsset(request);
      if (asset) return asset;
    }

    return handler.fetch(request, opts);
  },
});
