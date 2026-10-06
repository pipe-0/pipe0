import { formatDate, lastRevised } from "@/app/blog/blog-utils";
import { SummarizeActions } from "@/app/blog/[slug]/page.client";
import { AuthorAvatar } from "@/app/blog/author-avatar";
import { AuthorCard } from "@/app/blog/author-card";
import { PreferredSourceButton } from "@/app/blog/preferred-source-button";
import { BlogCta } from "@/app/blog/blog-cta";
import { PostFaq } from "@/app/blog/post-faq";
import {
  JsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  personRefJsonLd,
  softwareReviewJsonLd,
} from "@/components/seo/json-ld";
import { authorUrl, getAuthor, type Author } from "@/lib/authors";
import { reviews, type ReviewPage } from "@/lib/source";
import { getBaseUrl } from "@/lib/utils";
import { getMDXComponents } from "@/mdx-components";
import { ArrowUpRight, Check, Minus, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ScoreBar, ScorePill, ToolLogo } from "../review-parts";
import {
  CRITERIA,
  formatScore,
  formatStartingPrice,
  isVisible,
  overallScore,
  relatedReviews,
} from "../review-utils";

function getReview(slug: string): ReviewPage {
  const page = reviews.getPage([slug]);
  if (!page || !isVisible(page)) notFound();
  return page;
}

/**
 * One review. The layout is fixed so every review answers the same
 * questions in the same place: verdict and scores first, then facts, the
 * prose, pros and cons, pricing, alternatives, and the FAQ.
 */
export default async function Review(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const page = getReview(slug);
  const { body: Mdx, toc } = await page.data.load();
  const d = page.data;
  const tool = d.tool.name;
  const score = overallScore(d.scores);
  const url = `${getBaseUrl()}${page.url}`;
  const revised = lastRevised(page);
  const managedAuthor = d.authors
    .map((a) => getAuthor(a.name))
    .find((a) => a !== undefined);
  const related = relatedReviews(page, 3);
  const disclosure =
    d.disclosure ??
    `pipe0 sells data enrichment and competes with ${tool} in parts of this review. We say where ${tool} is better.`;

  return (
    <>
      <JsonLd
        data={softwareReviewJsonLd({
          url: page.url,
          headline: d.title,
          reviewBody: d.verdict,
          rating: score,
          tool: {
            name: tool,
            url: d.tool.url,
            category: d.tool.category,
            image: d.tool.logo,
          },
          price: d.pricing.startingAt,
          pros: d.pros.map((p) => p.title),
          cons: d.cons.map((c) => c.title),
          authors: d.authors.map((a) => {
            const managed = getAuthor(a.name);
            return managed
              ? personRefJsonLd(managed)
              : { "@type": "Person", name: a.name, jobTitle: a.title };
          }),
          datePublished: new Date(d.date).toISOString().slice(0, 10),
          dateModified: revised.toISOString().slice(0, 10),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "pipe0", url: "/" },
          { name: "Reviews", url: "/reviews" },
          { name: `${tool} review`, url: page.url },
        ])}
      />
      {d.faq.length > 0 && <JsonLd data={faqJsonLd(d.faq)} />}

      {/* Desktop: the review on the left, a sticky rail on the right (tool,
          contents, author). Below lg the rail folds away and the author
          card closes the article instead. */}
      <div className="mx-auto w-full max-w-[1240px] px-5 pt-8 sm:px-8 md:pt-11 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14 xl:gap-20">
      <main className="min-w-0">
        {d.draft && (
          <p className="mb-6 rounded-lg bg-amber-50 px-4 py-2.5 text-[13px] text-amber-900 ring-1 ring-amber-600/20">
            Draft: visible in development only. Remove{" "}
            <code>draft: true</code> to publish.
          </p>
        )}

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[13px] text-fd-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-fd-foreground">
            pipe0
          </Link>
          <span aria-hidden>/</span>
          <Link
            href="/reviews"
            className="transition-colors hover:text-fd-foreground"
          >
            Reviews
          </Link>
          <span aria-hidden>/</span>
          <span className="text-fd-foreground">{tool}</span>
        </nav>

        <header className="mt-6">
          <div className="flex items-center gap-4">
            <ToolLogo name={tool} logo={d.tool.logo} size={52} className="rounded-xl" />
            <p className="text-[13px] text-fd-muted-foreground">
              {d.tool.category}
              {" · "}
              Updated{" "}
              <time dateTime={revised.toISOString()}>
                {formatDate(revised)}
              </time>
            </p>
          </div>

          <h1 className="font-blog mt-5 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-fd-foreground text-pretty sm:text-[44px]">
            {d.title}
          </h1>
          {d.description && (
            <p className="font-blog mt-4 text-[17px] leading-[1.5] text-fd-muted-foreground text-pretty sm:text-[18px]">
              {d.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[13px] text-fd-muted-foreground">
            <span className="flex shrink-0 -space-x-1.5">
              {d.authors.map((a) => (
                <AuthorAvatar
                  key={a.name}
                  name={a.name}
                  className="ring-2 ring-fd-background"
                />
              ))}
            </span>
            <span>
              {d.authors.map((a, i) => {
                const managed = getAuthor(a.name);
                return (
                  <span key={a.name}>
                    {i > 0 && " · "}
                    {managed ? (
                      <Link
                        href={authorUrl(managed)}
                        rel="author"
                        className="font-medium text-fd-foreground transition-colors hover:text-fd-primary"
                      >
                        {managed.name}
                      </Link>
                    ) : (
                      a.name
                    )}
                    {a.title && `, ${a.title}`}
                  </span>
                );
              })}
              {" · "}
              Published{" "}
              <time dateTime={new Date(d.date).toISOString()}>
                {formatDate(d.date)}
              </time>
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-fd-muted-foreground">
            {disclosure}{" "}
            <Link
              href="/reviews#methodology"
              className="underline underline-offset-[3px] transition-colors hover:text-fd-foreground"
            >
              How we review
            </Link>
          </p>
          <SummarizeActions url={url} className="mt-4" />
        </header>

        {/* Verdict card: the whole review in one block. Its first sentence
            is the quotable answer to "is {tool} any good". */}
        <section
          id="verdict"
          aria-label={`${tool} verdict`}
          className="review-verdict mt-10 scroll-mt-24 rounded-2xl bg-fd-muted p-5 sm:p-7"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_minmax(0,300px)]">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-blog text-[52px] font-bold leading-none tracking-[-0.03em] tabular-nums text-fd-foreground">
                  {formatScore(score)}
                </span>
                <span className="text-[17px] text-fd-muted-foreground">
                  / 5
                </span>
              </div>
              <p className="mt-1 text-[13px] text-fd-muted-foreground">
                Our score for {tool}, the average of four criteria
              </p>
              <p className="font-blog mt-5 text-[19px] leading-[1.45] text-fd-foreground text-pretty">
                {d.verdict}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <VerdictList title="Best for" items={d.bestFor} icon="yes" />
                <VerdictList title="Skip it if" items={d.skipIf} icon="no" />
              </div>
            </div>

            <div className="space-y-5">
              {CRITERIA.map((c) => (
                <ScoreBar
                  key={c.key}
                  label={c.label}
                  score={d.scores[c.key].score}
                  why={d.scores[c.key].why}
                />
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-fd-border pt-5 text-[14px]">
            <span className="text-fd-foreground">
              <span className="font-medium">From {formatStartingPrice(page)}</span>{" "}
              <span className="text-fd-muted-foreground">
                {d.pricing.startingAtNote}
              </span>
            </span>
            <span className="text-fd-muted-foreground">
              {d.pricing.freePlan ? "Free plan available" : "No free plan"}
            </span>
            <a
              href={d.tool.url}
              rel="nofollow noopener"
              target="_blank"
              className="inline-flex items-center gap-1 font-medium text-fd-primary sm:ml-auto"
            >
              Visit {tool}
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </section>

        <ReviewSection id="facts" title={`${tool} at a glance`}>
          <dl className="divide-y divide-fd-border rounded-xl ring-1 ring-fd-border">
            {d.facts.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[200px_1fr] sm:gap-4"
              >
                <dt className="text-[14px] text-fd-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="text-[14.5px] text-fd-foreground">
                  {fact.value}
                  {fact.source && (
                    <>
                      {" "}
                      <a
                        href={fact.source}
                        rel="nofollow noopener"
                        target="_blank"
                        className="text-[13px] text-fd-muted-foreground underline underline-offset-[3px] hover:text-fd-foreground"
                      >
                        Source
                      </a>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </ReviewSection>

        <div className="prose blog-prose review-prose mt-4 min-w-0">
          <Mdx components={getMDXComponents({})} />
        </div>

        <ReviewSection id="pros-and-cons" title={`${tool} pros and cons`}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <NoteColumn title="Pros" notes={d.pros} icon="yes" />
            <NoteColumn title="Cons" notes={d.cons} icon="no" />
          </div>
        </ReviewSection>

        <ReviewSection id="pricing" title={`${tool} pricing`}>
          <p className="text-[15.5px] leading-[1.65] text-fd-muted-foreground">
            {d.pricing.freePlan
              ? `${tool} has a free plan. Paid plans start at ${formatStartingPrice(page)} ${d.pricing.startingAtNote}.`
              : `${tool} has no free plan. Paid plans start at ${formatStartingPrice(page)} ${d.pricing.startingAtNote}.`}
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl ring-1 ring-fd-border">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <thead className="bg-fd-muted text-[13px] text-fd-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Plan
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    What you get
                  </th>
                </tr>
              </thead>
              <tbody>
                {d.pricing.plans.map((plan) => (
                  <tr key={plan.name} className="border-t border-fd-border align-top">
                    <th scope="row" className="px-4 py-3 font-medium text-fd-foreground">
                      {plan.name}
                    </th>
                    <td className="px-4 py-3 whitespace-nowrap text-fd-foreground">
                      {plan.price}
                    </td>
                    <td className="px-4 py-3 text-fd-muted-foreground">
                      {plan.includes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {d.pricing.notes && d.pricing.notes.length > 0 && (
            <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-[1.6] text-fd-muted-foreground">
              {d.pricing.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[13px] text-fd-muted-foreground">
            Prices as of {formatDate(d.pricing.asOf)}, from{" "}
            <a
              href={d.pricing.source}
              rel="nofollow noopener"
              target="_blank"
              className="underline underline-offset-[3px] hover:text-fd-foreground"
            >
              {tool}&apos;s pricing page
            </a>
            .
          </p>
        </ReviewSection>

        <ReviewSection id="alternatives" title={`${tool} alternatives`}>
          <div className="overflow-x-auto rounded-xl ring-1 ring-fd-border">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <thead className="bg-fd-muted text-[13px] text-fd-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Alternative
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Pick it when
                  </th>
                </tr>
              </thead>
              <tbody>
                {d.alternatives.map((alt) => (
                  <tr key={alt.name} className="border-t border-fd-border align-top">
                    <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap">
                      <Link
                        href={alt.href}
                        className="text-fd-foreground underline underline-offset-[3px] hover:text-fd-primary"
                      >
                        {alt.name}
                      </Link>
                    </th>
                    <td className="px-4 py-3 text-fd-muted-foreground">
                      {alt.why}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {d.compare && (
            <p className="mt-4 text-[15px] text-fd-muted-foreground">
              Side by side, feature by feature:{" "}
              <Link
                href={d.compare}
                className="text-fd-foreground underline underline-offset-[3px] hover:text-fd-primary"
              >
                pipe0 vs {tool}
              </Link>
              .
            </p>
          )}
        </ReviewSection>

        <PostFaq items={d.faq} />

        {managedAuthor && (
          <div className="lg:hidden">
            <AuthorCard author={managedAuthor} />
          </div>
        )}

        {related.length > 0 && (
          <footer className="mt-16">
            <h2 className="font-blog text-[22px] font-semibold tracking-[-0.015em] text-fd-foreground">
              More reviews
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.url}
                  href={r.url}
                  className="group flex items-center gap-3 rounded-xl p-3 ring-1 ring-fd-border transition-colors hover:bg-fd-accent/60"
                >
                  <ToolLogo name={r.data.tool.name} logo={r.data.tool.logo} />
                  <span className="min-w-0 flex-1 truncate font-medium text-fd-foreground group-hover:text-fd-primary">
                    {r.data.tool.name}
                  </span>
                  <ScorePill score={overallScore(r.data.scores)} />
                </Link>
              ))}
            </div>
          </footer>
        )}
      </main>

      <ReviewRail
        tool={tool}
        logo={d.tool.logo}
        url={d.tool.url}
        score={score}
        author={managedAuthor}
        contents={[
          { id: "verdict", title: "Verdict and scores" },
          { id: "facts", title: `${tool} at a glance` },
          ...toc
            .filter((item) => item.depth === 2)
            .map((item) => ({ id: item.url.slice(1), title: item.title })),
          { id: "pros-and-cons", title: "Pros and cons" },
          { id: "pricing", title: "Pricing" },
          { id: "alternatives", title: "Alternatives" },
          ...(d.faq.length > 0 ? [{ id: "post-faq", title: "FAQ" }] : []),
        ]}
      />
      </div>

      <BlogCta />
    </>
  );
}

/**
 * Desktop rail: the tool and its score with the outbound link, the page
 * contents, and a compact author card with the preferred-source opt-in.
 * Sticky, and scrolls on its own if a short window can't fit it.
 */
function ReviewRail({
  tool,
  logo,
  url,
  score,
  author,
  contents,
}: {
  tool: string;
  logo?: string;
  url: string;
  score: number;
  author?: Author;
  contents: { id: string; title: ReactNode }[];
}) {
  return (
    <aside
      aria-label="Review details"
      className="hidden lg:block"
    >
      <div className="sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col gap-6 overflow-y-auto p-px pb-6">
        <div className="flex items-center gap-3 rounded-xl p-3 ring-1 ring-fd-border">
          <ToolLogo name={tool} logo={logo} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-blog text-[15px] font-semibold text-fd-foreground">
              {tool}
            </p>
            <a
              href={url}
              rel="nofollow noopener"
              target="_blank"
              className="inline-flex items-center gap-1 text-[13px] text-fd-primary"
            >
              Visit site
              <ArrowUpRight className="size-3" />
            </a>
          </div>
          <ScorePill score={score} />
        </div>

        <nav aria-label="On this page">
          <p className="text-[13px] font-medium text-fd-muted-foreground">
            On this page
          </p>
          <ul className="mt-2.5 space-y-0.5 border-l border-fd-border">
            {contents.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="-ml-px block border-l border-transparent py-1 pl-3 text-[13.5px] leading-snug text-fd-muted-foreground transition-colors hover:border-fd-foreground hover:text-fd-foreground"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {author && (
          <div className="rounded-xl bg-fd-muted p-4">
            <p className="text-[13px] font-medium text-fd-muted-foreground">
              Written by
            </p>
            <div className="mt-3 flex items-center gap-3">
              <AuthorAvatar name={author.key} className="size-10" />
              <div className="min-w-0">
                <Link
                  href={authorUrl(author)}
                  rel="author"
                  className="font-blog text-[15px] font-semibold leading-tight text-fd-foreground transition-colors hover:text-fd-primary"
                >
                  {author.name}
                </Link>
                <p className="text-[13px] text-fd-muted-foreground">
                  {author.jobTitle}, pipe0
                </p>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-fd-foreground text-pretty">
              {author.bio}
            </p>
            <PreferredSourceButton wrap className="mt-4 w-full" />
          </div>
        )}
      </div>
    </aside>
  );
}

function ReviewSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-16 scroll-mt-24">
      <h2
        id={id}
        className="font-blog mb-5 text-[23px] font-semibold tracking-[-0.015em] text-fd-foreground"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Mark({ icon }: { icon: "yes" | "no" }) {
  return icon === "yes" ? (
    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-600" />
  ) : (
    <X aria-hidden className="mt-0.5 size-4 shrink-0 text-rose-600" />
  );
}

function VerdictList({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: "yes" | "no";
}) {
  return (
    <div>
      <p className="text-[13px] font-medium text-fd-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-[14.5px] leading-snug text-fd-foreground"
          >
            <Mark icon={icon} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoteColumn({
  title,
  notes,
  icon,
}: {
  title: string;
  notes: { title: string; body: string }[];
  icon: "yes" | "no";
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[13px] font-medium text-fd-muted-foreground">
        {icon === "yes" ? (
          <Check aria-hidden className="size-3.5" />
        ) : (
          <Minus aria-hidden className="size-3.5" />
        )}
        {title}
      </p>
      <div className="mt-3 space-y-5">
        {notes.map((note) => (
          <div key={note.title}>
            <h3 className="font-blog flex gap-2 text-[16.5px] font-semibold leading-snug text-fd-foreground">
              <Mark icon={icon} />
              {note.title}
            </h3>
            <p className="mt-1.5 pl-6 text-[15px] leading-[1.6] text-fd-muted-foreground">
              {note.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Every param is enumerated by generateStaticParams; unknown paths 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return reviews
    .getPages()
    .filter(isVisible)
    .map((page) => ({ slug: page.slugs[0] }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getReview(slug);
  const d = page.data;
  const score = formatScore(overallScore(d.scores));
  const description =
    d.description ?? `${d.tool.name} review: ${score}/5. ${d.verdict}`;

  return {
    title: {
      absolute: `${d.tool.name} review (${lastRevised(page).getFullYear()}): pricing, pros and cons | pipe0`,
    },
    description,
    alternates: {
      canonical: page.url,
      types: { "text/markdown": `${page.url}.md` },
    },
    ...(d.draft && { robots: { index: false, follow: false } }),
    openGraph: {
      type: "article",
      url: page.url,
      title: `${d.tool.name} review: ${score}/5`,
      description,
      publishedTime: new Date(d.date).toISOString(),
      modifiedTime: lastRevised(page).toISOString(),
      authors: d.authors.map((a) => {
        const managed = getAuthor(a.name);
        return managed ? `${getBaseUrl()}${authorUrl(managed)}` : a.name;
      }),
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image" },
  };
}
