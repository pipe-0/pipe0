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

const ORG_ID = "https://pipe0.com/#organization";

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
      "https://florian-martens.medium.com",
    ],
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
    alternateName: "pipe0 data enrichment API",
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
