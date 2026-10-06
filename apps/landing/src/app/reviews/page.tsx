import { lastRevised } from "@/app/blog/blog-utils";
import { SummarizeActions } from "@/app/blog/[slug]/page.client";
import {
  JsonLd,
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/components/seo/json-ld";
import { appInfo } from "@/lib/const";
import { getBaseUrl } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScorePill, ToolLogo } from "./review-parts";
import {
  CRITERIA,
  REVIEWS_DESCRIPTION,
  formatScore,
  formatStartingPrice,
  overallScore,
  sortedReviews,
} from "./review-utils";
import { ReviewsGrid, type ReviewCard } from "./reviews-grid";

const TITLE = "GTM tool reviews";

export const metadata: Metadata = {
  title: { absolute: "GTM and sales data tool reviews (2026) | pipe0" },
  description: REVIEWS_DESCRIPTION,
  alternates: { canonical: "/reviews" },
  openGraph: {
    type: "website",
    url: "/reviews",
    title: "GTM and sales data tool reviews",
    description: REVIEWS_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
};

function monthYear(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function shortMonth(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * /reviews: what the section is and how fresh it is, a dense grid of every
 * review, one comparison table across all of them, and the scoring method.
 */
export default function ReviewsIndex() {
  const reviews = sortedReviews();
  if (reviews.length === 0) notFound();

  const updated = reviews
    .map(lastRevised)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const cards: ReviewCard[] = reviews.map((r) => ({
    url: r.url,
    name: r.data.tool.name,
    logo: r.data.tool.logo,
    category: r.data.tool.category,
    score: overallScore(r.data.scores),
    verdict: r.data.verdict,
    price: formatStartingPrice(r),
    freePlan: r.data.pricing.freePlan,
    updated: shortMonth(lastRevised(r)),
    draft: r.data.draft === true,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "pipe0", url: "/" },
          { name: "Reviews", url: "/reviews" },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          url: "/reviews",
          name: TITLE,
          description: REVIEWS_DESCRIPTION,
          items: reviews.map((r) => ({
            name: `${r.data.tool.name} review`,
            url: r.url,
          })),
        })}
      />

      <main className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-10 md:py-12">
        <header className="border-b border-fd-border pb-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[13px] text-fd-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-fd-foreground">
              pipe0
            </Link>
            <span aria-hidden>/</span>
            <span className="text-fd-foreground">Reviews</span>
          </nav>

          <h1 className="font-blog mt-4 text-[38px] font-bold leading-[1.05] tracking-[-0.02em] text-fd-foreground md:text-[48px]">
            {TITLE}
          </h1>
          <p className="mt-4 max-w-[680px] text-[16px] leading-relaxed text-fd-muted-foreground text-pretty md:text-[17px]">
            {REVIEWS_DESCRIPTION}
          </p>

          <p className="mt-4 text-[13px] text-fd-muted-foreground">
            Updated{" "}
            <span className="font-medium text-fd-foreground">
              {monthYear(updated)}
            </span>
            {" · "}
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            {" · "}
            <a
              href="#methodology"
              className="underline underline-offset-[3px] transition-colors hover:text-fd-foreground"
            >
              How we score
            </a>
          </p>

          <SummarizeActions
            url={`${getBaseUrl()}/reviews`}
            className="mt-6"
          />
        </header>

        <ReviewsGrid cards={cards} />

        {/* One table across every review: the answer to "which tool is best
            for X" in a shape answer engines can lift whole. */}
        <section aria-labelledby="at-a-glance" className="mt-16">
          <h2
            id="at-a-glance"
            className="font-blog text-[26px] font-semibold tracking-[-0.015em] text-fd-foreground"
          >
            All tools at a glance
          </h2>
          <p className="mt-2 max-w-[680px] text-[15px] leading-relaxed text-fd-muted-foreground">
            Every reviewed tool with its overall score, the four criteria
            behind it, and its cheapest paid plan.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl ring-1 ring-fd-border">
            <table className="w-full min-w-[760px] text-left text-[14px]">
              <thead className="bg-fd-muted text-[13px] text-fd-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Tool
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Overall
                  </th>
                  {CRITERIA.map((c) => (
                    <th
                      key={c.key}
                      scope="col"
                      className="px-4 py-2.5 font-medium"
                    >
                      {c.label}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    From
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Free plan
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.url} className="border-t border-fd-border">
                    <th scope="row" className="px-4 py-3 font-medium">
                      <Link
                        href={r.url}
                        className="inline-flex items-center gap-2.5 text-fd-foreground transition-colors hover:text-fd-primary"
                      >
                        <ToolLogo
                          name={r.data.tool.name}
                          logo={r.data.tool.logo}
                          size={24}
                          className="rounded-md"
                        />
                        {r.data.tool.name}
                      </Link>
                    </th>
                    <td className="px-4 py-3 text-fd-muted-foreground">
                      {r.data.tool.category}
                    </td>
                    <td className="px-4 py-3">
                      <ScorePill score={overallScore(r.data.scores)} />
                    </td>
                    {CRITERIA.map((c) => (
                      <td
                        key={c.key}
                        className="px-4 py-3 tabular-nums text-fd-foreground"
                      >
                        {formatScore(r.data.scores[c.key].score)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-fd-foreground">
                      {formatStartingPrice(r)}
                    </td>
                    <td className="px-4 py-3 text-fd-muted-foreground">
                      {r.data.pricing.freePlan ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Methodology />
      </main>
    </>
  );
}

/** The scoring method. Every review links here. */
function Methodology() {
  return (
    <section
      id="methodology"
      aria-labelledby="methodology-heading"
      className="mt-16 scroll-mt-24 border-t border-fd-border pt-12"
    >
      <div className="max-w-[680px]">
        <h2
          id="methodology-heading"
          className="font-blog text-[26px] font-semibold tracking-[-0.015em] text-fd-foreground"
        >
          How we review
        </h2>
        <p className="mt-3 text-[15.5px] leading-[1.65] text-fd-muted-foreground">
          Every tool is scored from 1 to 5 on the same four criteria, to one
          decimal. The overall score is the plain average of the four, rounded
          to one decimal. We don&apos;t weight it and we don&apos;t adjust it
          by hand, so you can check the math on every page.
        </p>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {CRITERIA.map((c) => (
          <div key={c.key} className="rounded-xl bg-fd-muted px-5 py-4">
            <dt className="font-blog text-[16px] font-semibold text-fd-foreground">
              {c.label}
            </dt>
            <dd className="mt-1.5 text-[14px] leading-relaxed text-fd-muted-foreground">
              {c.rubric}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 max-w-[680px] space-y-4 text-[15.5px] leading-[1.65] text-fd-muted-foreground">
        <p>
          Prices come from each vendor&apos;s public pricing page and carry the
          date we read them. Product facts come from the vendor&apos;s own docs
          and changelog, linked next to each fact. Where we have used a tool
          ourselves, the review says so.
        </p>
        <p>
          For data providers, the data quality score rests on our own
          benchmark: the same 50 to 150 records run through every provider
          we test, with coverage, agreement with other providers, and
          response time counted per test. Each review prints its numbers, the
          run ids, and the caveats: small samples, a pre-filtered profile set
          that runs high in absolute terms, and agreement as a proxy for
          accuracy rather than proof of it.
        </p>
        <p>
          pipe0 sells data enrichment, so many of the tools reviewed here
          compete with us, and others sell us the data our waterfalls run
          on. Each review says which at the top, credits the tool where it is
          better than pipe0, and links to the full side-by-side comparison
          where one exists.
        </p>
        <p>
          We re-check prices and scores when a vendor changes its plans or
          ships something that moves a criterion, and update the date on the
          page when we do. Spotted something out of date? Email{" "}
          <a
            href={`mailto:${appInfo.emails.support}`}
            className="text-fd-foreground underline underline-offset-[3px]"
          >
            {appInfo.emails.support}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
