import { getBaseUrl } from "./base-url";

const SITE_NAME = "pipe0";
const DEFAULT_TITLE = `${SITE_NAME} | Turn any GTM play into a production system with AI`;

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${getBaseUrl()}${path === "/" ? "" : path}`;

export const SITE_DESCRIPTION =
  "With pipe0, technical and non-technical users build revenue systems at any scale. Morning briefings, always-on plays, signal engines, CRM enrichment, lead routing, and the infrastructure underneath. Replace tools like Clay, n8n, Hightouch, and Polytomic.";

export const pageTitle = (title: string) => `${title} | ${SITE_NAME}`;

type SeoOptions = {
  /** Gets the site suffix in <title>. Social tags use it bare. Omit for the site default. */
  title?: string;
  /** Replaces <title> entirely, for titles written for search results. */
  documentTitle?: string;
  description?: string;
  /** Route path, the canonical URL and og:url. `null` for pages with neither. */
  path: string | null;
  ogType?: "website" | "article" | "profile" | null;
  /** Defaults to the site card. `null` leaves it out. */
  image?: string | null;
  /** Off for pages whose social tags never named the site. */
  siteName?: boolean;
  /** Extra Open Graph properties, such as article:published_time. */
  og?: Record<string, string | string[] | undefined>;
  twitterCard?: string;
  robots?: string;
  /**
   * For pages that set only title, description and canonical: social tags
   * repeat the full title and carry the site card's details, with no og:url.
   */
  inherited?: boolean;
  /** rel="alternate" links, as type to href. */
  alternates?: Record<string, string>;
};

/** A page's head: title, description, canonical, Open Graph and Twitter card. */
export function seo({
  title,
  documentTitle,
  description,
  path,
  ogType = "website",
  image = "/opengraph-image",
  siteName = true,
  og = {},
  twitterCard = "summary_large_image",
  robots,
  inherited,
  alternates = {},
}: SeoOptions) {
  const fullTitle = documentTitle ?? (title ? pageTitle(title) : DEFAULT_TITLE);
  const social = inherited ? fullTitle : (title ?? DEFAULT_TITLE);
  const imageUrl = image === null ? undefined : absoluteUrl(image);
  const tag = (property: string, content?: string) =>
    content === undefined ? [] : [{ property, content }];
  const named = (name: string, content?: string) =>
    content === undefined ? [] : [{ name, content }];

  return {
    meta: [
      { title: fullTitle },
      ...named("description", description),
      ...named("robots", robots),
      ...tag("og:title", social),
      ...tag("og:description", description),
      ...tag("og:url", path === null || inherited ? undefined : absoluteUrl(path)),
      ...(siteName ? tag("og:site_name", SITE_NAME) : []),
      ...tag("og:image", imageUrl),
      ...(inherited
        ? [
            ...tag("og:image:type", "image/png"),
            ...tag("og:image:width", "1200"),
            ...tag("og:image:height", "630"),
            ...tag("og:image:alt", SITE_NAME),
          ]
        : []),
      ...(ogType ? tag("og:type", ogType) : []),
      ...Object.entries(og).flatMap(([property, value]) =>
        [value].flat().flatMap((content) => tag(property, content)),
      ),
      ...named("twitter:card", twitterCard),
      ...named("twitter:title", social),
      ...named("twitter:description", description),
      ...named("twitter:image", imageUrl),
      ...(inherited
        ? [
            ...named("twitter:image:alt", SITE_NAME),
            ...named("twitter:image:type", "image/png"),
            ...named("twitter:image:width", "1200"),
            ...named("twitter:image:height", "630"),
          ]
        : []),
    ],
    links: [
      ...(path === null ? [] : [{ rel: "canonical", href: absoluteUrl(path) }]),
      ...Object.entries(alternates).map(([type, href]) => ({
        rel: "alternate",
        type,
        href: absoluteUrl(href),
      })),
    ],
  };
}
