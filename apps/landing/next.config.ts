import path from "node:path";
import { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../.."),
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

const DEFAULT_PROPERTY_PROPS = {
  type: "Property",
  kind: "init",
  method: false,
  shorthand: false,
  computed: false,
};

// @ts-expect-error -- fixme
function isExportNode(node, varName: string) {
  if (node.type !== "mdxjsEsm") return false;
  const [n] = node.data.estree.body;

  if (n.type !== "ExportNamedDeclaration") return false;

  const name = n.declaration?.declarations?.[0].id.name;
  if (!name) return false;

  return name === varName;
}

// @ts-expect-error -- fixme
export function createAstObject(obj) {
  return {
    type: "ObjectExpression",
    properties: Object.entries(obj).map(([key, value]) => ({
      ...DEFAULT_PROPERTY_PROPS,
      key: { type: "Identifier", name: key },
      value:
        value && typeof value === "object" ? value : { type: "Literal", value },
    })),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rehypeOpenGraphImage = () => (ast: any) => {
  // @ts-expect-error -- fixme
  const frontMatterNode = ast.children.find((node) =>
    isExportNode(node, "metadata"),
  );
  if (!frontMatterNode) {
    return;
  }
  const { properties } =
    frontMatterNode.data.estree.body[0].declaration.declarations[0].init;
  // @ts-expect-error -- fixme
  const title = properties.find((o) => o.key.value === "title")?.value.value;
  if (!title) {
    return;
  }
  const [prop] = createAstObject({
    openGraph: createAstObject({
      images: `https://pipe0.com/og?title=${title}`,
    }),
  }).properties;
  properties.push(prop);
};

const plugins = [];
if (process.env.NODE_ENV === "production") {
  plugins.push(rehypeOpenGraphImage);
}

const curriedConfig = createMDX({});

export default curriedConfig(nextConfig);
