import { legal } from "@/lib/source";

/** Version folders are date-stamped `YYYYMMDD`, which sorts chronologically. */
const VERSION_SLUG = /^\d{8}$/;

/**
 * The newest published version of a legal document family — `privacy-policy`,
 * `terms-of-service`. Every version stays reachable at its own dated URL; this
 * is what the undated alias resolves to.
 *
 * Ordered on the version SLUG rather than the frontmatter `date`: the slug is
 * what the URL exposes, and the two have already drifted apart once
 * (`privacy-policy/20250404` carries `date: 2025-03-07`).
 */
export function latestLegalVersion(family: string) {
  const versions = legal.getPages().flatMap((page) => {
    const [head, version, ...rest] = page.slugs;
    if (head !== family || rest.length > 0) return [];
    if (!version || !VERSION_SLUG.test(version)) return [];
    return [{ page, version }];
  });

  versions.sort((a, b) => b.version.localeCompare(a.version));
  return versions[0]?.page;
}
