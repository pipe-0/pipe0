import { getDocPages } from "@/lib/docs";
import { MetadataRoute } from "next";

export function getBaseUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://pipe0.com"
    : "http://localhost:3000";
}

const basePath = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docsPages = await getDocPages();

  return [
    {
      url: basePath + "/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...docsPages
      .filter((p) => p.isPublished)
      .map(({ slug, date }) => {
        return {
          url: `${getBaseUrl()}/docs/${slug}`,
          lastModified: new Date(date),
          priority: 1,
          changeFrequency: "daily",
        } as const;
      }),
  ];
}
