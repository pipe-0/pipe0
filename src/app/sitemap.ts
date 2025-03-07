import { getDocPages } from "@/lib/docs";
import { getPipePages } from "@/lib/pipes";
import { getBaseUrl } from "@/lib/utils";
import { MetadataRoute } from "next";

const basePath = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docsPages = await getDocPages();
  const pipePages = await getPipePages();

  return [
    {
      url: basePath + "/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: basePath + "/docs/pipe-catalog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...pipePages
      .filter((p) => p.isPublished)
      .map(({ slug, date }) => {
        return {
          url: `${basePath}/docs/pipe-catalog/${slug}`,
          lastModified: new Date(date),
          priority: 1,
          changeFrequency: "daily",
        } as const;
      }),
    ...docsPages
      .filter((p) => p.isPublished)
      .map(({ slug, date }) => {
        return {
          url: `${basePath}/docs/${slug}`,
          lastModified: new Date(date),
          priority: 1,
          changeFrequency: "daily",
        } as const;
      }),
  ];
}
