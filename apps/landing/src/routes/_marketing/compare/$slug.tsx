import { SiteLink } from "@/components/link";
import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";

import { CompareCharts } from "@/components/features/compare/compare-charts";
import { CompareTabs } from "@/components/features/compare/compare-tabs";
import { CompareVideos } from "@/components/features/compare/compare-videos";
import { DifferenceCards } from "@/components/features/compare/difference-cards";
import { TheirEdgePanel } from "@/components/features/compare/their-edge-panel";
import { LandingFaq } from "@/components/landing/landing-faq";
import { Band, SectionHead } from "@/components/grid";
import { CloseBand, LandingShell, PageHero } from "@/components/landing-shell";
import {
  jsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  videoJsonLd,
} from "@/components/seo/json-ld";
import { getCompare } from "@/lib/compare/compare.functions";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/compare/$slug")({
  loader: ({ params }) => getCompare({ data: params.slug }),
  head: ({ loaderData: config }) =>
    config
      ? {
          ...seo({
            title: config.metaTitle,
            documentTitle: config.metaTitle,
            description: config.metaDescription,
            path: `/compare/${config.slug}`,
          }),
          scripts: [
            jsonLd(faqJsonLd(config.faqs)),
            ...(config.media?.videos ?? []).map((video) => jsonLd(videoJsonLd(video))),
            jsonLd(
              breadcrumbJsonLd([
                { name: "pipe0", url: "/" },
                { name: `pipe0 vs ${config.competitor}` },
              ]),
            ),
          ],
        }
      : {},
  component: ComparePage,
});

function ComparePage() {
  const config = Route.useLoaderData();

  return (
    <LandingShell page="product">
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

      {config.charts && (
        <Band>
          <SectionHead title={config.charts.heading} lede={config.charts.lede} />
          <CompareCharts
            charts={config.charts.charts}
            footnote={config.charts.footnote}
          />
        </Band>
      )}

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
                <SiteLink
                  href={link.href}
                  className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                >
                  {link.label}
                </SiteLink>
              </Fragment>
            ))}
          </p>
        )}
      </Band>

      <CloseBand title={config.cta.title} lede={config.cta.subtitle} />
    </LandingShell>
  );
}
