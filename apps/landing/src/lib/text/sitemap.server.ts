import {
  categorySlug,
  lastRevised,
  usedCategories,
} from "@/components/blog/blog-utils";
import { sortedPosts } from "@/lib/blog.server";
import { publishedReviews } from "@/lib/reviews.server";
import { AUTHORS, authorUrl } from "@/lib/authors";
import { compareConfigs } from "@/lib/compare/registry";
import { blog, legal } from "@/lib/collections.server";
import { source } from "@/lib/source.server";
import { getBaseUrl } from "@/lib/utils";

type Entry = {
  url: string;
  lastModified?: Date;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

const toXml = (entries: Entry[]) =>
  [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries.map(
      (entry) =>
        `<url>\n<loc>${entry.url}</loc>\n${
          entry.lastModified
            ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>\n`
            : ""
        }<changefreq>${entry.changeFrequency}</changefreq>\n<priority>${entry.priority}</priority>\n</url>`,
    ),
    `</urlset>`,
  ].join("\n");

async function entries(): Promise<Entry[]> {
  const baseUrl = getBaseUrl();
  const url = (path: string): string => new URL(path, baseUrl).toString();

  const docPages = await Promise.all(
    source.getPages().map(async (page) => {
      const isVirtual = "_isVirtual" in page.data && page.data._isVirtual;
      // Behind load() on async collections; virtual pages have neither.
      const modified =
        "load" in page.data ? (await page.data.load()).lastModified : undefined;
      return {
        url: url(page.url),
        changeFrequency: "weekly" as const,
        // Authored docs pages carry more weight than generated catalog entries.
        priority: isVirtual ? 0.5 : 0.6,
        ...(modified ? { lastModified: new Date(modified) } : {}),
      };
    }),
  );

  const blogPages = blog
    .getPages()
    .filter((page) => page.data.draft !== true)
    .map((page) => ({
      url: url(page.url),
      changeFrequency: "monthly" as const,
      priority: 0.4,
      lastModified: lastRevised(page),
    }));

  const reviews = publishedReviews();
  const reviewPages = [
    ...(reviews.length > 0
      ? [
          {
            url: url("/reviews"),
            changeFrequency: "weekly" as const,
            priority: 0.6,
            // The hub changes whenever any review does.
            lastModified: new Date(
              Math.max(...reviews.map((r) => lastRevised(r).getTime())),
            ),
          },
        ]
      : []),
    ...reviews.map((page) => ({
      url: url(page.url),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified: lastRevised(page),
    })),
  ];

  const authorPages = AUTHORS.map((author) => ({
    url: url(authorUrl(author)),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const blogCategoryPages = usedCategories(sortedPosts()).map((category) => ({
    url: url(`/blog/category/${categorySlug(category)}`),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const legalPages = legal.getPages().map((page) => ({
    url: url(page.url),
    changeFrequency: "yearly" as const,
    priority: 0.2,
  }));

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: url("/mcp"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: url("/enrichment-api"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: url("/pricing"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/integrations/slack"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: url("/integrations/google-workspace"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: url("/ai-instructions"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/support"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: url("/blog"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: url("/docs"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...compareConfigs.map((config) => ({
      url: url(`/compare/${config.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: url("/resources/api-reference"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/tools/lemlist-api-key-encoder"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...docPages,
    ...blogPages,
    ...blogCategoryPages,
    ...reviewPages,
    ...authorPages,
    ...legalPages,
  ];
}

export async function GET() {
  return new Response(toXml(await entries()), {
    headers: { "Content-Type": "application/xml" },
  });
}
