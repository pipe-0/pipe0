import { globSync, readFileSync } from "node:fs";
import { pipeCatalog, searchCatalog } from "@pipe0/base";
import { AUTHORS } from "../src/lib/authors";
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

/** Content slugs of an editorial folder, whose posts sit in numbered groups. */
function publishedSlugs(dir: string) {
  return globSync("**/index.mdx", { cwd: `src/content/${dir}` })
    .filter((file) => {
      const source = readFileSync(`src/content/${dir}/${file}`, "utf8");
      return !/^draft:\s*true\s*$/m.test(source.split(/^---$/m)[1] ?? "");
    })
    .map((file) => file.split("/").at(-2)!);
}

/**
 * Every path the build prerenders. A crawl would miss posts with no inbound
 * link and the text twins, and verify-build.mjs checks this list against the
 * sitemap, so a new kind of page fails the build rather than go missing.
 */
export async function prerenderPages() {
  const docs = [
    "/docs",
    "/docs/pipe-catalog",
    "/docs/search-catalog",
    ...contentSlugs("docs").map((slug) => (slug ? `/docs/${slug}` : "/docs")),
    ...Object.values(pipeCatalog).map((entry) => entry.docPath),
    ...Object.values(searchCatalog).map((entry) => entry.docPath),
  ];

  const posts = publishedSlugs("blog");
  const reviews = publishedSlugs("reviews");

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
    ...docs,
    ...docs.map((path) => `${path}.mdx`),
    "/blog",
    "/blog/rss.xml",
    ...["thinking", "engineering", "sales-data"].map(
      (c) => `/blog/category/${c}`,
    ),
    ...posts.map((slug) => `/blog/${slug}`),
    ...posts.map((slug) => `/blog/${slug}.md`),
    "/reviews",
    ...reviews.map((slug) => `/reviews/${slug}`),
    ...reviews.map((slug) => `/reviews/${slug}.md`),
    ...AUTHORS.map((author) => `/authors/${author.slug}`),
    "/sitemap.xml",
    "/llms.txt",
    "/llms-full.txt",
    "/ai-instructions.md",
    "/api/search",
    "/api/chat-index.json",
    "/og-manifest.json",
  ];
  return [...new Set(paths)].map((path) => ({ path }));
}
