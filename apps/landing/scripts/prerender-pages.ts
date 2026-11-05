import { globSync, readFileSync } from "node:fs";

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

/** The page of every pipe and search in the installed catalog. */
export async function catalogDocPaths() {
  const { pipeCatalog, searchCatalog } = await import("@pipe0/base");
  return [
    ...Object.values(pipeCatalog).map((entry) => entry.docPath),
    ...Object.values(searchCatalog).map((entry) => entry.docPath),
  ];
}

/**
 * The paths Start cannot find on its own. It discovers routes without params,
 * and a crawl stops at pages nothing links to and never sees files outside an
 * `<a>`, so everything behind a param and every text and data file is listed.
 * verify-build.mjs checks the result against the sitemap, so a new kind of page
 * fails the build rather than go missing.
 *
 * This file loads with the Vite config, so it reads content folders instead of
 * importing app modules, which would restart the dev server on every edit.
 */
export async function prerenderPages() {
  const docs = [
    "/docs/pipe-catalog",
    "/docs/search-catalog",
    ...contentSlugs("docs").map((slug) => (slug ? `/docs/${slug}` : "/docs")),
    ...(await catalogDocPaths()),
  ];

  const posts = publishedSlugs("blog");
  const reviews = publishedSlugs("reviews");
  const categories = ["thinking", "engineering", "sales-data"];
  const legal = contentSlugs("legal");
  const authors = ["florian-martens"];
  // One file per comparison, named after its competitor.
  const compare = globSync("*.ts", { cwd: "src/lib/compare/configs" }).map(
    (file) => `pipe0-vs-${file.replace(/\.ts$/, "")}`,
  );

  // One file per `readData()` key; see src/routes/data/{$}[.]json.ts.
  const data = [
    "docs-tree",
    ...docs.map((path) => path.slice(1)),
    "provider-tiles",
    "catalog-doc-paths",
  ];

  const paths = [
    ...compare.map((slug) => `/compare/${slug}`),
    ...legal.map((slug) => `/resources/legal/${slug}`),
    ...docs,
    ...docs.map((path) => `${path}.mdx`),
    "/blog/rss.xml",
    ...categories.map((category) => `/blog/category/${category}`),
    ...posts.map((slug) => `/blog/${slug}`),
    ...posts.map((slug) => `/blog/${slug}.md`),
    ...reviews.map((slug) => `/reviews/${slug}`),
    ...reviews.map((slug) => `/reviews/${slug}.md`),
    ...authors.map((slug) => `/authors/${slug}`),
    "/sitemap.xml",
    "/llms.txt",
    "/llms-full.txt",
    "/ai-instructions.md",
    "/api/search",
    "/api/chat-index.json",
    "/og-manifest.json",
    ...data.map((key) => `/data/${key}.json`),
  ];
  return [
    ...[...new Set(paths)].map((path) => ({ path })),
    // A layout route with a component, which discovery takes for a page.
    { path: "/resources/legal", prerender: { enabled: false } },
  ];
}
