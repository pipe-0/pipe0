import browserCollections from "collections/browser";

/** Files in the collection, as `dpa/20261014/index.mdx`. */
const files = Object.keys(browserCollections.legal.raw).map((file) =>
  file.slice("./".length),
);

/** The file behind a /resources/legal/<splat> URL. */
export function legalFile(splat: string) {
  const file = `${splat}/index.mdx`;
  return files.includes(file) ? file : undefined;
}

/**
 * URL of the newest published version of a legal document family —
 * `privacy-policy`, `terms-of-service`. Every version stays reachable at its
 * own dated URL; this is what the undated alias resolves to.
 *
 * Ordered on the date-stamped version folder rather than the frontmatter
 * `date`: the folder is what the URL exposes, and the two have already drifted
 * apart once (`privacy-policy/20250404` carries `date: 2025-03-07`).
 */
export function latestLegalUrl(family: string) {
  const version = /^(.+)\/(\d{8})\/index\.mdx$/;
  const [latest] = files
    .flatMap((file) => {
      const match = file.match(version);
      return match?.[1] === family ? [match[2]!] : [];
    })
    .sort((a, b) => b.localeCompare(a));
  if (!latest) throw new Error(`No published version of ${family}`);
  return `/resources/legal/${family}/${latest}`;
}
