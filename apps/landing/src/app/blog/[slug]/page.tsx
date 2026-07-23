import {
  authorInitials,
  formatDate,
  postCover,
  relatedPosts,
} from "@/app/blog/blog-utils";
import CalButton from "@/components/cal-button";
import { JsonLd } from "@/components/seo/json-ld";
import { LogoRawSmall } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { appInfo } from "@/lib/const";
import { blog, type BlogPage } from "@/lib/source";
import { cn, getBaseUrl } from "@/lib/utils";
import { getMDXComponents } from "@/mdx-components";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Infinity as InfinityIcon,
  Plus,
  Search,
  Type,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs/promises";
import { ShareActions } from "./page.client";

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const page = blog.getPage([slug]);
  // Drafts 404 like missing pages — dynamicParams would otherwise render them
  // on demand even though generateStaticParams skips them.
  if (!page || page.data.draft === true) notFound();

  const { body: Mdx } = await page.data.load();
  const minutes = await readingTime(page.absolutePath);
  const lede = page.data.description ?? page.data.excerpt;
  const authors = page.data.authors ?? [];
  const author = authors[0];
  const related = relatedPosts(page, 2);
  const shareUrl = `${getBaseUrl()}${page.url}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: page.data.title,
          description: lede,
          articleSection: page.data.category,
          datePublished: page.data.date,
          dateModified: page.data.date,
          url: shareUrl,
          mainEntityOfPage: shareUrl,
          image: `${getBaseUrl()}/opengraph-image`,
          author: authors.map((a) => ({
            "@type": "Person",
            name: a.name,
            jobTitle: a.title,
          })),
          publisher: { "@id": "https://pipe0.com/#organization" },
        }}
      />

      <main className="mx-auto flex w-full max-w-[980px] items-start gap-11 px-5 pt-8 sm:px-8 md:pt-11">
        {/* Share rail — back to the index, then the share actions */}
        <aside className="sticky top-24 hidden w-9 shrink-0 flex-col items-center gap-1.5 md:flex">
          <Link
            href="/blog"
            title="All posts"
            aria-label="All posts"
            className="grid size-8 place-items-center rounded-full text-fd-muted-foreground ring-1 ring-fd-foreground/10 transition-colors hover:bg-fd-accent hover:text-fd-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <span className="my-2 h-px w-3.5 bg-fd-border" aria-hidden />
          <ShareActions
            title={page.data.title}
            url={shareUrl}
            className="flex-col gap-1.5"
          />
        </aside>

        <article className="mx-auto min-w-0 max-w-[680px] flex-1">
          {/* Mobile bar — the rail's actions, folded into one row */}
          <div className="mb-6 flex items-center gap-1.5 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[13px] text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <ArrowLeft className="size-3.5" />
              All posts
            </Link>
            <ShareActions
              title={page.data.title}
              url={shareUrl}
              className="ml-auto"
            />
          </div>

          <header>
            <h1 className="font-blog text-[30px] font-bold leading-[1.12] tracking-[-0.01em] text-fd-foreground text-pretty sm:text-[40px]">
              {page.data.title}
            </h1>

            {lede && (
              <p className="font-blog mt-4 text-[17px] leading-[1.45] text-fd-muted-foreground text-pretty sm:text-[20px]">
                {lede}
              </p>
            )}

            {/* Byline — author identity left, date · reading time right */}
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-fd-border pt-4">
              <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-fd-muted text-xs font-semibold text-fd-muted-foreground">
                {author ? authorInitials(author.name) : "p0"}
              </span>
              <div className="flex flex-col gap-px">
                <span className="text-[13px] font-semibold leading-tight text-fd-foreground">
                  {author
                    ? authors.map((a) => a.name).join(", ")
                    : "The pipe0 team"}
                </span>
                {author?.title && (
                  <span className="text-xs leading-tight text-fd-muted-foreground">
                    {author.title}, pipe0
                  </span>
                )}
              </div>
              <span className="ml-auto text-[12.5px] whitespace-nowrap text-fd-muted-foreground">
                {page.data.date && (
                  <time dateTime={new Date(page.data.date).toISOString()}>
                    {formatDate(page.data.date)}
                  </time>
                )}
                {minutes !== null && <> &nbsp;·&nbsp; {minutes} min read</>}
              </span>
            </div>
          </header>

          <figure className="mt-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={postCover(page, 2)}
              alt=""
              className="aspect-[2/1] w-full rounded-xl object-cover ring-1 ring-fd-foreground/10"
            />
            <figcaption className="mt-2 text-xs text-fd-muted-foreground">
              Cover art generated from the post title.
            </figcaption>
          </figure>

          <div className="prose blog-prose mt-10 min-w-0">
            <Mdx components={getMDXComponents({})} />
          </div>

          {/* Keep reading */}
          {related.length > 0 && (
            <footer className="mt-16">
              <h2 className="font-blog text-[23px] font-bold tracking-[-0.005em] text-fd-foreground">
                Keep reading
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {related.map((post) => (
                  <RelatedCard key={post.url} post={post} />
                ))}
              </div>
            </footer>
          )}
        </article>
      </main>

      <BlogCta />
    </>
  );
}

function RelatedCard({ post }: { post: BlogPage }) {
  return (
    <Link href={post.url} className="group flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={postCover(post, 2)}
        alt=""
        className="aspect-[2/1] w-full rounded-lg object-cover ring-1 ring-fd-foreground/10 transition-opacity group-hover:opacity-90"
      />
      <p className="font-blog mt-3 text-[17px] font-bold leading-[1.25] text-fd-foreground text-pretty transition-colors group-hover:text-fd-primary">
        {post.data.title}
      </p>
      {post.data.excerpt && (
        <p className="mt-1 line-clamp-2 text-[13px] leading-normal text-fd-muted-foreground">
          {post.data.excerpt}
        </p>
      )}
      {post.data.date && (
        <p className="mt-2 text-xs text-fd-muted-foreground">
          {formatDate(post.data.date)}
        </p>
      )}
    </Link>
  );
}

/** Closing CTA — headline, a miniature of the real sheet, one CTA. */
function BlogCta() {
  return (
    <section className="mt-20 border-t border-fd-border">
      {/* Same container as the HomeLayout header: --fd-layout-width + px-4 */}
      <div className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-12 text-center md:py-14">
        <div className="rounded-2xl bg-fd-muted px-5 pt-12 pb-8 sm:px-10 sm:pt-14">
          <h2 className="font-blog text-[24px] font-bold leading-[1.2] tracking-[-0.005em] text-fd-foreground text-pretty sm:text-[30px]">
            Clay-like data enrichment for your apps &amp; agents.{" "}
            <span className="italic">Fast.</span>
          </h2>
          <p className="mt-2.5 text-[14.5px] text-fd-muted-foreground">
            Stack pipes on a sheet and run them over every row.
          </p>

          <MiniSheet />

          <div className="mt-8 flex justify-center">
            <Link
              href={appInfo.links.signupUrl}
              rel="nofollow"
              className={cn(
                buttonVariants({ variant: "cta", size: "xl" }),
                "gap-2.5",
              )}
            >
              <LogoRawSmall className="w-5" />
              Try pipe0
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 border-t border-fd-border pt-4 text-[13px] text-fd-muted-foreground">
            Using pipe0 at work?{" "}
            <CalButton
              variant="link"
              className="h-auto p-0 text-[13px] font-normal text-fd-muted-foreground underline underline-offset-[3px] transition-colors hover:text-fd-foreground"
            >
              Book a demo
            </CalButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Grid templates shared by every sheet row — checkbox · Name · Company · pipe
   column. Company drops out below sm. */
const sheetCols =
  "grid grid-cols-[34px_100px_minmax(0,1fr)] sm:grid-cols-[38px_140px_160px_minmax(0,1fr)]";

function SheetCheckbox() {
  return (
    <span className="grid place-items-center border-r border-fd-border">
      <span className="size-3.5 rounded-[3px] border border-fd-border bg-fd-background" />
    </span>
  );
}

/** Overlapping provider tiles — the waterfall widget from the real app. */
const PROVIDER_TILES = {
  H: "bg-orange-500",
  D: "bg-sky-600",
} as const;

function ProviderTiles({ only }: { only?: keyof typeof PROVIDER_TILES }) {
  const shown = only ? [only] : (["H", "D"] as const);
  return (
    <span className="flex shrink-0 -space-x-1">
      {shown.map((p) => (
        <span
          key={p}
          className={cn(
            "grid size-4 place-items-center rounded-[4px] text-[8px] font-bold text-white ring-2 ring-fd-background",
            PROVIDER_TILES[p],
          )}
        >
          {p}
        </span>
      ))}
    </span>
  );
}

/**
 * A faithful miniature of the dashboard's sheet: selection column,
 * two-tier headers (flat "Input" group, rounded tab for the pipe with its
 * provider tiles), field-type icons, inline statuses, "New empty row".
 */
function MiniSheet() {
  const leafHeader =
    "flex items-center gap-1 border-r border-fd-border px-2 text-xs text-fd-muted-foreground";

  return (
    <div className="mx-auto mt-9 max-w-[780px] overflow-hidden rounded-xl bg-fd-background text-left ring-1 ring-fd-foreground/10">
      {/* Toolbar — selection scope pill, catalog buttons, Run */}
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <span className="flex h-7 items-center gap-1 rounded-md border border-fd-border bg-fd-muted px-2 text-xs text-fd-muted-foreground">
          <InfinityIcon className="size-3.5" />
          selected
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="hidden h-7 items-center gap-1.5 rounded-md bg-fd-secondary px-2.5 text-xs font-medium text-fd-secondary-foreground sm:flex">
            <Database className="size-3" />
            Pipes
          </span>
          <span className="hidden h-7 items-center gap-1.5 rounded-md bg-fd-secondary px-2.5 text-xs font-medium text-fd-secondary-foreground sm:flex">
            <Search className="size-3" />
            Search
          </span>
          <span className="flex h-7 min-w-14 items-center justify-center rounded-md border border-fd-primary bg-fd-primary px-3 text-xs font-medium text-fd-primary-foreground">
            Run
          </span>
        </span>
      </div>

      {/* Tier 0 — column groups: flat "Input", rounded tab for the pipe */}
      <div className={cn(sheetCols, "h-8 items-stretch border-t bg-fd-muted")}>
        <span />
        <span className="flex items-center px-2 text-xs text-fd-muted-foreground sm:col-span-2">
          Input
        </span>
        <span className="-mb-px flex min-w-0 items-center gap-1.5 rounded-t-lg border-x border-t border-fd-border bg-fd-background px-2">
          <ProviderTiles />
          <span className="truncate text-xs text-fd-foreground">
            Find work email
          </span>
        </span>
      </div>

      {/* Tier 1 — field columns with type icons */}
      <div className={cn(sheetCols, "h-8 border-y border-fd-border")}>
        <SheetCheckbox />
        <span className={leafHeader}>
          <Type className="size-3" />
          Name
        </span>
        <span className={cn(leafHeader, "hidden sm:flex")}>
          <Type className="size-3" />
          Company
        </span>
        <span className="flex items-center gap-1 px-2 text-xs text-fd-muted-foreground">
          <Type className="size-3" />
          Work email
        </span>
      </div>

      {/* Rows — completed cells carry the resolving provider's tile */}
      {(
        [
          ["Ada Byrne", "acme.io", "a.byrne@acme.io", "H"],
          ["Leo Costa", "northbeam.co", "l.costa@northbeam.co", "D"],
          ["Mia Chen", "parlor.dev", null, null],
        ] as const
      ).map(([name, company, email, provider]) => (
        <div
          key={name}
          className={cn(
            sheetCols,
            "h-9 items-stretch border-b border-fd-border text-[13px] text-fd-foreground",
          )}
        >
          <SheetCheckbox />
          <span className="flex items-center truncate border-r border-fd-border px-2">
            {name}
          </span>
          <span className="hidden items-center truncate border-r border-fd-border px-2 sm:flex">
            {company}
          </span>
          {email ? (
            <span className="flex min-w-0 items-center gap-1.5 px-2">
              <ProviderTiles only={provider!} />
              <span className="truncate">{email}</span>
            </span>
          ) : (
            <span className="flex items-center px-2 text-fd-muted-foreground">
              Running...
            </span>
          )}
        </div>
      ))}

      {/* Footer — the add-row affordance */}
      <span className="flex items-center gap-1 px-2.5 py-2 text-xs text-fd-muted-foreground">
        <Plus className="size-3.5" />
        New empty row
      </span>
    </div>
  );
}

/** Word-count estimate from the raw MDX, frontmatter stripped. */
async function readingTime(absolutePath?: string): Promise<number | null> {
  if (!absolutePath) return null;
  try {
    const raw = await fs.readFile(absolutePath, "utf8");
    const words = raw
      .replace(/^---[\s\S]*?---/, "")
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return blog
    .getPages()
    .filter((page) => page.data.draft !== true)
    .map((page) => ({
      slug: page.slugs[0],
    }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = blog.getPage([slug]);
  if (!page || page.data.draft === true) notFound();

  return {
    title: page.data.title,
    description: page.data.description ?? page.data.excerpt,
    alternates: {
      canonical: page.data.canonicalUrl ?? page.url,
    },
    openGraph: {
      type: "article",
      url: page.url,
      title: page.data.title,
      description: page.data.description ?? page.data.excerpt,
      publishedTime: page.data.date
        ? new Date(page.data.date).toISOString()
        : undefined,
      section: page.data.category,
      authors: page.data.authors?.map((a) => a.name),
      // Post covers are generated data-URI SVGs, which social scrapers reject.
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image" },
  };
}
