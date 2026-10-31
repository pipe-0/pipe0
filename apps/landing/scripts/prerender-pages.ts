import { globSync } from "node:fs";
import { compareConfigs } from "../src/lib/compare/registry";

/** Slugs of the MDX files under a content folder, without `index`. */
function contentSlugs(dir: string) {
  return globSync("**/*.mdx", { cwd: `src/content/${dir}` }).map((file) =>
    file
      .replace(/\.mdx$/, "")
      .split("/")
      .filter((part) => part !== "index" && !/^\(.*\)$/.test(part))
      .join("/"),
  );
}

/** Every path the build prerenders. Grows with each ported section. */
export async function prerenderPages() {
  const paths = [
    "/",
    "/pricing",
    "/mcp",
    "/enrichment-api",
    "/support",
    "/ai-instructions",
    "/integrations/slack",
    "/integrations/google-workspace",
    "/resources/api-reference",
    "/tools/lemlist-api-key-encoder",
    ...compareConfigs.map((config) => `/compare/${config.slug}`),
    ...contentSlugs("legal").map((slug) => `/resources/legal/${slug}`),
  ];
  return [...new Set(paths)].map((path) => ({ path }));
}
