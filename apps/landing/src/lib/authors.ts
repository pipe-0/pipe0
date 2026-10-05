import { getBaseUrl } from "@/lib/utils";

/**
 * Blog authors we manage. Frontmatter names an author by `name` (the short
 * form, e.g. "Florian"); a match here supplies the full identity — photo,
 * bio, credentials and the profile links that tie posts to one Person
 * entity in structured data. Anyone not listed falls back to a lettered
 * avatar and a plain name, so a guest post never needs an entry to render.
 */
export type Author = {
  /** The name frontmatter uses. Matched case-insensitively. */
  key: string;
  /** Full name, shown in bylines and structured data. */
  name: string;
  /** URL segment of the author page: /authors/<slug>. */
  slug: string;
  jobTitle: string;
  avatar: string;
  /** Two sentences, first person avoided — it renders under the name. */
  bio: string;
  /** Short, verifiable facts. Each renders as one checked line. */
  credentials: string[];
  /** Where the author worked before, newest first. */
  pastRoles: { org: string; url: string; role: string }[];
  /** Topics for the Person `knowsAbout`. */
  knowsAbout: string[];
  /** Profiles the author controls — the Person `sameAs`. */
  profiles: { label: string; url: string }[];
};

export const AUTHORS: Author[] = [
  {
    key: "Florian",
    name: "Florian Martens",
    slug: "florian-martens",
    jobTitle: "Founder",
    avatar:
      "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/9a5da7c5-b8e7-44fb-5070-f2b1c8842e00/catalogpreview",
    bio: "Florian is the founder of pipe0. He built data pipelines at Cloudflare and joined Cursor as its first Growth Engineering hire, where he built the GTM data platform.",
    credentials: [
      "Founder of pipe0",
      "First Growth Engineering hire at Cursor, built its GTM data platform",
      "Built data pipelines at Cloudflare",
    ],
    pastRoles: [
      { org: "Cursor", url: "https://cursor.com", role: "Growth Engineering" },
      { org: "Cloudflare", url: "https://www.cloudflare.com", role: "Data pipelines" },
    ],
    knowsAbout: [
      "Data enrichment",
      "Data pipelines",
      "Go-to-market data platforms",
      "Growth engineering",
      "B2B contact data",
      "Model Context Protocol",
    ],
    profiles: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/florian-martens-86b224b4/",
      },
      { label: "X", url: "https://x.com/florian_jsx" },
      { label: "GitHub", url: "https://github.com/florianmartens" },
      { label: "Medium", url: "https://florian-martens.medium.com" },
    ],
  },
];

/** The managed author behind a frontmatter name, if any. */
export function getAuthor(name: string): Author | undefined {
  const key = name.trim().toLowerCase();
  return AUTHORS.find(
    (a) => a.key.toLowerCase() === key || a.name.toLowerCase() === key,
  );
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}

/** Avatar URL for a managed author, or undefined for anyone else. */
export function authorAvatar(name: string): string | undefined {
  return getAuthor(name)?.avatar;
}

/** Display name: the full name for managed authors, frontmatter otherwise. */
export function authorDisplayName(name: string): string {
  return getAuthor(name)?.name ?? name;
}

export function authorUrl(author: Author): string {
  return `/authors/${author.slug}`;
}

/**
 * Stable @id so every page references the same Person node. Pinned to the
 * production origin like the Organization @id — an identifier, not a link.
 */
export function authorId(author: Author): string {
  return `https://pipe0.com/authors/${author.slug}#person`;
}

export function authorAbsoluteUrl(author: Author): string {
  return `${getBaseUrl()}${authorUrl(author)}`;
}

/** "Florian Martens" → "FM"; the lettered fallback. */
export function authorInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
