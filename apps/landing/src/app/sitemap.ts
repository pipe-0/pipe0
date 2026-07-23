import type { MetadataRoute } from "next";
import { compareConfigs } from "@/lib/compare/registry";
import { source, blog, legal } from "@/lib/source";
import { getBaseUrl } from "@/lib/utils";

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const url = (path: string): string => new URL(path, baseUrl).toString();

  const docPages = source.getPages().map((page) => {
    const isVirtual = "_isVirtual" in page.data && page.data._isVirtual;
    const lastModified =
      "lastModified" in page.data && page.data.lastModified
        ? { lastModified: page.data.lastModified as Date }
        : {};
    return {
      url: url(page.url),
      changeFrequency: "weekly" as const,
      // Authored docs pages carry more weight than generated catalog entries.
      priority: isVirtual ? 0.5 : 0.6,
      ...lastModified,
    };
  });

  const blogPages = blog
    .getPages()
    .filter((page) => page.data.draft !== true)
    .map((page) => ({
      url: url(page.url),
      changeFrequency: "monthly" as const,
      priority: 0.4,
      lastModified: new Date(page.data.date),
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
      url: url("/pricing"),
      changeFrequency: "monthly",
      priority: 0.8,
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
    ...legalPages,
  ];
}
