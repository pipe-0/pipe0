import { resolveRedirect } from "@/lib/redirects";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";
import { isMarkdownPreferred } from "fumadocs-core/negotiation";

/** The asset layer only knows paths in this form and redirects anything else. */
const encodePath = (path: string) =>
  path
    .split("/")
    .map((part) => encodeURIComponent(decodeURIComponent(part)))
    .join("/");

function markdownTwin(path: string) {
  if (path === "/docs" || path.startsWith("/docs/")) return `${path}.mdx`;
  if (/^\/blog\/[^/]+$/.test(path)) return `${path}.md`;
  return undefined;
}

/**
 * Serves prerendered files at the URL that was asked for. Catalog canonicals
 * carry raw colons, and on its own the asset layer would 307 them to %3A.
 */
async function serveAsset(request: Request, url: URL) {
  const twin = isMarkdownPreferred(request)
    ? markdownTwin(url.pathname)
    : undefined;
  const target = new URL(encodePath(twin ?? url.pathname) + url.search, url);
  const asset = await env.ASSETS.fetch(new Request(target, request));
  if (asset.status !== 200 && asset.status !== 304) return undefined;

  const response = new Response(asset.body, asset);
  // One URL, two representations.
  if (markdownTwin(url.pathname)) response.headers.set("Vary", "Accept");
  // The extension alone would give text/mdx and application/xml.
  if (target.pathname.endsWith(".mdx")) {
    response.headers.set("Content-Type", "text/markdown");
  } else if (target.pathname === "/blog/rss.xml") {
    response.headers.set("Content-Type", "application/rss+xml; charset=utf-8");
  }
  return response;
}

export default createServerEntry({
  async fetch(request, opts) {
    const url = new URL(request.url);

    const redirect = resolveRedirect(url);
    if (redirect) {
      return new Response(null, {
        status: redirect.status,
        headers: { Location: redirect.location },
      });
    }

    if (
      (request.method === "GET" || request.method === "HEAD") &&
      !url.pathname.startsWith("/_serverFn")
    ) {
      const asset = await serveAsset(request, url);
      if (asset) return asset;
    }

    return handler.fetch(request, opts);
  },
});
