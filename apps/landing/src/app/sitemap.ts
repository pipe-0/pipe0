import type { MetadataRoute } from "next";
import { source, blog } from "@/lib/source";
import { getBaseUrl } from "@/lib/utils";

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const url = (path: string): string => new URL(path, baseUrl).toString();

  const docPages = source.getPages().map((page) => ({
    url: url(page.url),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const blogPages = blog
    .getPages()
    .filter((page) => page.data.draft !== true)
    .map((page) => ({
      url: url(page.url),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
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
    {
      url: url("/tools/lemlist-api-key-encoder"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...docPages,
    ...blogPages,
  ];
}
