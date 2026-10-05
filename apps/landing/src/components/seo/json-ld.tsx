import {
  AUTHORS,
  authorAbsoluteUrl,
  authorId,
  type Author,
} from "@/lib/authors";
import { appInfo } from "@/lib/const";
import { getBaseUrl } from "@/lib/utils";

/** Renders a schema.org JSON-LD script tag. Keep all structured data on this path. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const ORG_ID = "https://pipe0.com/#organization";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "pipe0",
    url: getBaseUrl(),
    logo: `${getBaseUrl()}/logo-light.svg`,
    sameAs: [
      appInfo.links.github,
      appInfo.links.linkedin,
      "https://www.npmjs.com/package/@pipe0/client",
      "https://www.npmjs.com/package/@pipe0/react",
      "https://www.npmjs.com/package/@pipe0/ai-sdk",
    ],
    founder: AUTHORS.filter((a) => a.jobTitle === "Founder").map((a) => ({
      "@id": authorId(a),
    })),
    contactPoint: {
      "@type": "ContactPoint",
      email: appInfo.emails.support,
      contactType: "customer support",
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "pipe0",
    alternateName: "pipe0 revenue systems platform",
    url: getBaseUrl(),
    publisher: { "@id": ORG_ID },
  };
}

export function softwareApplicationJsonLd(opts: { description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "pipe0",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: getBaseUrl(),
    description: opts.description,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0",
      highPrice: "999",
      offerCount: 5,
    },
    publisher: { "@id": ORG_ID },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function videoJsonLd(video: {
  youtubeId: string;
  title: string;
  description: string;
  uploadDate: string;
  duration: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    uploadDate: video.uploadDate,
    duration: video.duration,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${getBaseUrl()}${item.url}` }),
    })),
  };
}

export function techArticleJsonLd(opts: {
  title: string;
  description?: string;
  url: string;
  dateModified?: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: opts.title,
    ...(opts.description && { description: opts.description }),
    url: `${getBaseUrl()}${opts.url}`,
    mainEntityOfPage: `${getBaseUrl()}${opts.url}`,
    ...(opts.dateModified && { dateModified: opts.dateModified.toISOString() }),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

/** The full Person node — emitted on the author page, referenced elsewhere. */
export function personJsonLd(author: Author) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": authorId(author),
    name: author.name,
    url: authorAbsoluteUrl(author),
    image: author.avatar,
    jobTitle: author.jobTitle,
    description: author.bio,
    worksFor: { "@id": ORG_ID },
    alumniOf: author.pastRoles.map((role) => ({
      "@type": "Organization",
      name: role.org,
      url: role.url,
    })),
    knowsAbout: author.knowsAbout,
    sameAs: author.profiles.map((p) => p.url),
  };
}

/**
 * Compact Person reference for article `author` fields — the @id joins it
 * to the full node on the author page; name and url keep it readable for
 * consumers that don't resolve ids.
 */
export function personRefJsonLd(author: Author) {
  return {
    "@type": "Person",
    "@id": authorId(author),
    name: author.name,
    url: authorAbsoluteUrl(author),
    jobTitle: author.jobTitle,
    image: author.avatar,
    sameAs: author.profiles.map((p) => p.url),
  };
}

export function profilePageJsonLd(author: Author, opts: { dateModified?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: authorAbsoluteUrl(author),
    name: `${author.name}, ${author.jobTitle} of pipe0`,
    ...(opts.dateModified && { dateModified: opts.dateModified }),
    mainEntity: personJsonLd(author),
    isPartOf: { "@type": "WebSite", url: getBaseUrl(), name: "pipe0" },
  };
}
