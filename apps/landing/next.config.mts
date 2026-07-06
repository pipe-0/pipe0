import path from "node:path";
import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(import.meta.dirname, "../.."),
  },
  // The Ask AI route reads ask-ai-instructions.md at runtime via
  // readFileSync(new URL(...)). NFT usually traces that automatically, but force
  // the include so the file is guaranteed to ship in the serverless function.
  outputFileTracingIncludes: {
    "/api/chat": ["./src/app/api/chat/ask-ai-instructions.md"],
  },
  images: {
    remotePatterns: [{ hostname: "imagedelivery.net" }],
    dangerouslyAllowSVG: true,
  },
  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/docs/pipes/pipes-catalog",
        destination: "/docs/pipe-catalog",
        permanent: true,
      },
      {
        source: "/docs/pipes/pipes-catalog/:path*",
        destination: "/docs/pipe-catalog/:path*",
        permanent: true,
      },
      {
        source: "/docs/pipes-catalog",
        destination: "/docs/pipe-catalog",
        permanent: true,
      },
      {
        source: "/docs/pipes-catalog/:path*",
        destination: "/docs/pipe-catalog/:path*",
        permanent: true,
      },
      {
        source: "/docs/search/search-catalog",
        destination: "/docs/search-catalog",
        permanent: true,
      },
      {
        source: "/docs/search/search-catalog/:path*",
        destination: "/docs/search-catalog/:path*",
        permanent: true,
      },
      // Docs restructure (2026-07): flattened pipes/search folders, examples
      // promoted to a top-level section.
      {
        source: "/docs/pipes/advanced/pipes-concepts",
        destination: "/docs/pipes/concepts",
        permanent: true,
      },
      {
        source: "/docs/pipes/advanced/pipes-inputs",
        destination: "/docs/pipes/inputs",
        permanent: true,
      },
      {
        source: "/docs/pipes/advanced/pipes-request-payload",
        destination: "/docs/pipes/request-payload",
        permanent: true,
      },
      {
        source: "/docs/pipes/advanced/pipes-response-object",
        destination: "/docs/pipes/response-object",
        permanent: true,
      },
      {
        source: "/docs/pipes/examples/:slug*",
        destination: "/docs/examples/:slug*",
        permanent: true,
      },
      {
        source: "/docs/search/examples/:slug*",
        destination: "/docs/examples/:slug*",
        permanent: true,
      },
      {
        source: "/docs/search/advanced/pagination",
        destination: "/docs/search/pagination",
        permanent: true,
      },
      {
        source: "/docs/search/advanced/search-request-payload",
        destination: "/docs/search/request-payload",
        permanent: true,
      },
      {
        source: "/docs/search/advanced/search-response-object",
        destination: "/docs/search/response-object",
        permanent: true,
      },
      // Pipe renames (catalog 0.5.x): sheet:row:* became row:*:sheet.
      // Colons are escaped in `source` (path-to-regexp param marker) and
      // percent-encoded in `destination` (its validator rejects escapes).
      {
        source: "/docs/pipe-catalog/sheet\\:row\\:append/:version*",
        destination: "/docs/pipe-catalog/row%3Aappend%3Asheet/:version*",
        permanent: true,
      },
      {
        source: "/docs/pipe-catalog/sheet\\:row\\:expandappend/:version*",
        destination: "/docs/pipe-catalog/row%3Aexpandappend%3Asheet/:version*",
        permanent: true,
      },
    ];
  },
};

const curriedConfig = createMDX({});

export default curriedConfig(nextConfig);
