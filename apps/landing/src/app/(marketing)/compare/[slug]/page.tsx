import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { AskAiButton } from "@/components/ai/ask-ai-button";
import { CompareTabs } from "@/components/features/compare/compare-tabs";
import { DifferenceCards } from "@/components/features/compare/difference-cards";
import { TheirEdgePanel } from "@/components/features/compare/their-edge-panel";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CtaPanel, Section } from "@/components/marketing";
import {
  JsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
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
    <div className="landing min-h-screen bg-background">
      <JsonLd data={faqJsonLd(config.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "pipe0", url: "/" },
          { name: `pipe0 vs ${config.competitor}` },
        ])}
      />
      <Header page="product" />

      {/* Two-tier layout: text sections live in a centered narrow block
          (left-aligned inside), rich elements span the wide Section. */}

      {/* ===== Hero: narrow ===== */}
      <Section className="pt-16 sm:pt-24">
        <div className="mx-auto max-w-[920px]">
          <h1 className="max-w-3xl text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground">
            pipe0 vs {config.competitor}.
          </h1>
          <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-muted-foreground sm:text-[18px]">
            {config.heroSubtitle}
          </p>
        </div>
      </Section>

      {/* ===== Comparison, tabbed: full Section width ===== */}
      <Section className="mt-14">
        <CompareTabs
          competitor={config.competitor}
          groups={config.table.groups}
          footnote={config.table.footnote}
        />
      </Section>

      {/* ===== Differences: narrow ===== */}
      <Section className="mt-24">
        <div className="mx-auto max-w-[920px]">
          <DifferenceCards
            heading={config.differences.heading}
            cards={config.differences.cards}
          />
        </div>
      </Section>

      {/* ===== Honest verdict: full Section width ===== */}
      <Section className="mt-20">
        <TheirEdgePanel competitor={config.competitor} {...config.theirEdge} />
      </Section>

      {/* ===== Common questions: narrow ===== */}
      <Section className="mt-16">
        <div className="mx-auto max-w-[920px]">
          <h2 className="text-[clamp(22px,2.4vw,30px)] font-semibold tracking-[-0.02em] text-foreground">
            Common questions.
          </h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {config.faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-base font-semibold text-foreground">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
          {config.related && config.related.length > 0 && (
            <p className="mt-14 text-sm text-muted-foreground">
              Keep reading:{" "}
              {config.related.map((link, i) => (
                <Fragment key={link.href}>
                  {i > 0 && <span aria-hidden> · </span>}
                  <Link
                    href={link.href}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                </Fragment>
              ))}
            </p>
          )}
        </div>
      </Section>

      {/* ===== CTA ===== */}
      <Section className="mt-24">
        <CtaPanel
          title={config.cta.title}
          subtitle={config.cta.subtitle}
          reveal={false}
        />
      </Section>

      <Footer />
      <AskAiButton bound="1280px" variant="overlay" />
    </div>
  );
}
