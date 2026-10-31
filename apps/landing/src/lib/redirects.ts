type Rule = { source: string; destination: string; status: 307 | 308 };

const permanent = (source: string, destination: string): Rule => ({
  source,
  destination,
  status: 308,
});
const temporary = (source: string, destination: string): Rule => ({
  source,
  destination,
  status: 307,
});

// Old URLs have no file, so they reach the Worker and end up here.
const rules: Rule[] = [
  // Blog slugs corrected (2026-08): both paths shipped with a typo in the
  // folder name, so the old URLs stay redirected.
  permanent("/blog/the-history-of-slob", "/blog/the-history-of-slop"),
  permanent(
    "/blog/nextra-use-blog-and-docs-them",
    "/blog/nextra-use-blog-and-docs-theme",
  ),
  // The two 2025 Clay comparison posts were folded into the maintained
  // compare page (2026-10) so one URL ranks for "pipe0 vs Clay".
  permanent("/blog/clay-vs-pipe0", "/compare/pipe0-vs-clay"),
  permanent("/blog/clay-vs-pipe0-2", "/compare/pipe0-vs-clay"),
  // Integration pages moved under /docs/sdks/integrations (2026-10). The
  // Vercel AI SDK and TanStack AI pages were removed afterwards, so their URLs
  // point at the integrations overview.
  temporary("/docs/sdks/ai-sdk", "/docs/sdks/integrations"),
  temporary("/docs/sdks/integrations/ai-sdk", "/docs/sdks/integrations"),
  temporary("/docs/sdks/integrations/tanstack-ai", "/docs/sdks/integrations"),
  permanent("/docs/sdks/slack-agent", "/docs/sdks/integrations/slack-agent"),
  permanent("/docs/pipes/pipes-catalog/:path*", "/docs/pipe-catalog/:path*"),
  permanent("/docs/pipes-catalog/:path*", "/docs/pipe-catalog/:path*"),
  permanent(
    "/docs/search/search-catalog/:path*",
    "/docs/search-catalog/:path*",
  ),
  // Docs restructure (2026-07): flattened pipes/search folders, examples
  // promoted to a top-level section.
  permanent("/docs/pipes/advanced/pipes-concepts", "/docs/pipes/concepts"),
  permanent("/docs/pipes/advanced/pipes-inputs", "/docs/pipes/inputs"),
  permanent(
    "/docs/pipes/advanced/pipes-request-payload",
    "/docs/pipes/request-payload",
  ),
  permanent(
    "/docs/pipes/advanced/pipes-response-object",
    "/docs/pipes/response-object",
  ),
  permanent("/docs/pipes/examples/:slug*", "/docs/examples/:slug*"),
  permanent("/docs/search/examples/:slug*", "/docs/examples/:slug*"),
  permanent("/docs/search/advanced/pagination", "/docs/search/pagination"),
  permanent(
    "/docs/search/advanced/search-request-payload",
    "/docs/search/request-payload",
  ),
  permanent(
    "/docs/search/advanced/search-response-object",
    "/docs/search/response-object",
  ),
  // Pipe renames (catalog 0.5.x): sheet:row:* became row:*:sheet. Colons are
  // escaped because a bare one starts a parameter.
  permanent(
    "/docs/pipe-catalog/sheet\\:row\\:append/:version*",
    "/docs/pipe-catalog/row:append:sheet/:version*",
  ),
  permanent(
    "/docs/pipe-catalog/sheet\\:row\\:expandappend/:version*",
    "/docs/pipe-catalog/row:expandappend:sheet/:version*",
  ),
  // The markdown twins were served from these paths before.
  permanent("/llms.mdx/docs", "/docs.mdx"),
  permanent("/llms.mdx/docs/:path*", "/docs/:path*.mdx"),
  permanent("/llms.mdx/blog/:slug", "/blog/:slug.md"),
  permanent("/llms.mdx/reviews/:slug", "/reviews/:slug.md"),
];

const compiled = rules.map((rule) => ({
  ...rule,
  pattern: new URLPattern(
    { pathname: `${rule.source}{/}?` },
    { ignoreCase: true },
  ),
}));

/** Fills `:name` and `:name*` from a match. An empty `/:name*` drops the slash. */
function fill(destination: string, groups: Record<string, string | undefined>) {
  return destination.replace(/\/:(\w+)\*?/g, (_, name) => {
    const value = groups[name];
    return value ? `/${value}` : "";
  });
}

export function resolveRedirect(url: URL) {
  // Category filters used to be /blog?category=<slug>; they now live at static
  // paths so /blog itself can prerender.
  const category = url.searchParams.get("category");
  if (category && /^\/blog\/?$/i.test(url.pathname)) {
    const rest = new URLSearchParams(url.searchParams);
    rest.delete("category");
    const query = rest.size > 0 ? `?${rest}` : "";
    return { status: 307, location: `/blog/category/${category}${query}` };
  }

  const pathname = decodeURI(url.pathname)
    .replaceAll("%3A", ":")
    .replaceAll("%3a", ":");
  for (const { pattern, destination, status } of compiled) {
    const match = pattern.exec({ pathname });
    if (match) {
      const { groups } = match.pathname;
      return { status, location: `${fill(destination, groups)}${url.search}` };
    }
  }
  return undefined;
}
