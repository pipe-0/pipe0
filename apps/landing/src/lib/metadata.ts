import type { Metadata } from "next";

interface CreateMetadataOptions {
  /** Templated by the root layout into "%s | pipe0". Omit to inherit the root default. */
  title?: string;
  description?: string;
  /** Route path starting with "/" — becomes the canonical URL and og:url via metadataBase. */
  path: string;
  ogType?: "website" | "article";
  /**
   * OG image path. Defaults to the root opengraph-image route: defining
   * `openGraph` on a page replaces the inherited object wholesale, so the
   * file-convention image must be restated or it is lost.
   */
  image?: string;
  noIndex?: boolean;
}

/** Shared page metadata: canonical, OpenGraph, and Twitter card in one place. */
export function createMetadata({
  title,
  description,
  path,
  ogType = "website",
  image = "/opengraph-image",
  noIndex,
}: CreateMetadataOptions): Metadata {
  return {
    ...(title !== undefined && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      url: path,
      title,
      description,
      siteName: "pipe0",
      images: [image],
    },
    twitter: { card: "summary_large_image" },
    ...(noIndex && { robots: { index: false, follow: true } }),
  };
}
