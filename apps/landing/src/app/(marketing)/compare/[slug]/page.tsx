import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { CompareTabs } from "@/components/features/compare/compare-tabs";
import { CompareVideos } from "@/components/features/compare/compare-videos";
import { DifferenceCards } from "@/components/features/compare/difference-cards";
import { TheirEdgePanel } from "@/components/features/compare/their-edge-panel";
import { LandingFaq } from "@/app/landing-faq";
import { Band, SectionHead } from "@/components/grid";
import { CloseBand, LandingShell, PageHero } from "@/components/landing-shell";
import {
  JsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  videoJsonLd,
} from "@/components/seo/json-ld";
import { compareConfigs, getCompareConfig } from "@/lib/compare/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return compareConfigs.map((config) => ({ slug: config.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const config = getCompareConfig(slug);
  if (!config) notFound();

  return {
    title: { absolute: config.metaTitle },
    description: config.metaDescription,
    alternates: { canonical: `/compare/${config.slug}` },
    openGraph: {
      type: "website",
      title: config.metaTitle,
      description: config.metaDescription,
      url: `/compare/${config.slug}`,
      siteName: "pipe0",
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ComparePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const config = getCompareConfig(slug);
  if (!config) notFound();

  return (
    <LandingShell page="product">
      <JsonLd data={faqJsonLd(config.faqs)} />
      {config.media?.videos.map((video) => (
        <JsonLd key={video.youtubeId} data={videoJsonLd(video)} />
      ))}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "pipe0", url: "/" },
          { name: `pipe0 vs ${config.competitor}` },
        ])}
      />

      <PageHero
        title={`pipe0 vs ${config.competitor}.`}
        lede={config.heroSubtitle}
      />

      {/* ===== Comparison, tabbed ===== */}
      <Band>
        <SectionHead title="Side by side." />
        <CompareTabs
          competitor={config.competitor}
          groups={config.table.groups}
          footnote={config.table.footnote}
        />
      </Band>

      <Band>
        <DifferenceCards
          heading={config.differences.heading}
          cards={config.differences.cards}
        />
      </Band>

      {/* ===== Honest verdict ===== */}
      <Band>
        <TheirEdgePanel competitor={config.competitor} {...config.theirEdge} />
      </Band>

      {config.media && config.media.videos.length > 0 && (
        <Band>
          <CompareVideos
            heading={config.media.heading}
            videos={config.media.videos}
          />
        </Band>
      )}

      <Band>
        <SectionHead title="Common questions." />
        <LandingFaq items={config.faqs} />
        {config.related && config.related.length > 0 && (
          <p className="border-t border-[var(--rule)] px-6 py-5 text-[14.5px] text-muted-foreground sm:px-10 lg:px-12">
            Keep reading:{" "}
            {config.related.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 && <span aria-hidden> · </span>}
                <Link
                  href={link.href}
                  className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                >
                  {link.label}
                </Link>
              </Fragment>
            ))}
          </p>
        )}
      </Band>

      <CloseBand title={config.cta.title} lede={config.cta.subtitle} />
    </LandingShell>
  );
}
