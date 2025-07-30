import { NextConfig } from "next";
import nextra from "nextra";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "imagedelivery.net" }],
    dangerouslyAllowSVG: true,
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
    isExportNode(node, "metadata")
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

const withNextra = nextra({
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePlugins: plugins,
  },
});

export default withNextra(nextConfig);
