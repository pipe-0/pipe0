import { getBaseUrl } from "./base-url";

const SITE_NAME = "pipe0";
const SITE_CARD = "/opengraph-image";

export const DEFAULT_TITLE = `${SITE_NAME} | Turn any GTM play into a production system with AI`;

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${getBaseUrl()}${path === "/" ? "" : path}`;

export const SITE_DESCRIPTION =
  "With pipe0, technical and non-technical users build revenue systems at any scale. Morning briefings, always-on plays, signal engines, CRM enrichment, lead routing, and the infrastructure underneath. Replace tools like Clay, n8n, Hightouch, and Polytomic.";

export const pageTitle = (title: string) => `${title} | ${SITE_NAME}`;

/**
 * Tags every page starts from, for the root route. A child route's tag with
 * the same name replaces its parent's, so `seo()` only states what differs.
 */
export const siteMeta = () => [
  { title: DEFAULT_TITLE },
  { name: "description", content: SITE_DESCRIPTION },
  { property: "og:site_name", content: SITE_NAME },
  { property: "og:type", content: "website" },
  { property: "og:image", content: absoluteUrl(SITE_CARD) },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:image", content: absoluteUrl(SITE_CARD) },
];

type SeoOptions = {
  /** Gets the site suffix in <title>. Social tags use it bare. Omit for the site default. */
  title?: string;
  /** Replaces <title> entirely, for titles written for search results. */
  documentTitle?: string;
  description?: string;
  /** Route path, the canonical URL and og:url. Omit for pages with neither. */
  path?: string;
  /** Points near-duplicate pages at the one that should rank. */
  canonical?: string;
  ogType?: "article" | "profile";
  image?: string;
  /** Extra Open Graph properties, such as article:published_time. */
  og?: Record<string, string | string[] | undefined>;
  twitterCard?: string;
  robots?: string;
  keywords?: string;
  /** rel="alternate" links, as type to href. */
  alternates?: Record<string, string>;
};

/** A page's head: title, description, canonical, Open Graph and Twitter card. */
export function seo({
  title,
  documentTitle,
  description,
  path,
  canonical,
  ogType,
  image,
  og = {},
  twitterCard,
  robots,
  keywords,
  alternates = {},
}: SeoOptions) {
  const social = title ?? DEFAULT_TITLE;
  const imageUrl = image && absoluteUrl(image);
  const tag = (property: string, content?: string) =>
    content === undefined ? [] : [{ property, content }];
  const named = (name: string, content?: string) =>
    content === undefined ? [] : [{ name, content }];

  return {
    meta: [
      { title: documentTitle ?? (title ? pageTitle(title) : DEFAULT_TITLE) },
      ...named("description", description),
      ...named("keywords", keywords),
      ...named("robots", robots),
      ...tag("og:title", social),
      ...tag("og:description", description),
      ...tag("og:url", path && absoluteUrl(path)),
      ...tag("og:image", imageUrl),
      ...tag("og:type", ogType),
      ...Object.entries(og).flatMap(([property, value]) =>
        [value].flat().flatMap((content) => tag(property, content)),
      ),
      ...named("twitter:card", twitterCard),
      ...named("twitter:title", social),
      ...named("twitter:description", description),
      ...named("twitter:image", imageUrl),
    ],
    links: [
      ...(path ? [{ rel: "canonical", href: absoluteUrl(canonical ?? path) }] : []),
      ...Object.entries(alternates).map(([type, href]) => ({
        rel: "alternate",
        type,
        href: absoluteUrl(href),
      })),
    ],
  };
}
