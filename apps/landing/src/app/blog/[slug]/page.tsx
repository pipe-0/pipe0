import {
  displayTag,
  formatDate,
  relatedPosts,
  titleGradient,
} from "@/app/blog/blog-utils";
import { blog, type BlogPage } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs/promises";
import { ShareButton } from "./page.client";

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const page = blog.getPage([slug]);
  if (!page) notFound();

  const { body: Mdx, toc } = await page.data.load();
  const minutes = await readingTime(page.absolutePath);
  const tag = page.data.tags?.[0];
  const lede = page.data.description ?? page.data.excerpt;
  const authors = page.data.authors ?? [];
  const related = relatedPosts(page, 3);

  return (
    <main className="px-4 py-8 sm:px-6 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: page.data.title,
            description: lede,
            datePublished: page.data.date,
            author: authors.map((a) => ({
              "@type": "Person",
              name: a.name,
              jobTitle: a.title,
            })),
          }),
        }}
      />

      {/* The page sheet — the article sits on its own focused panel */}
      <div className="mx-auto w-full max-w-[1200px] rounded-[18px] border bg-fd-card px-5 py-12 shadow-sm sm:px-10 md:py-18">
        <div className="relative mx-auto max-w-[720px]">
          <article className="min-w-0">
            <header>
              {/* Author on top, newspaper-style */}
              <div className="flex items-center gap-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-fd-primary/10 font-serif text-lg font-medium text-fd-primary">
                  {(authors[0]?.name ?? "P").charAt(0)}
                </span>
                <div className="flex flex-col gap-0.5">
                  {tag && (
                    <Link
                      href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}
                      className="text-[12.5px] font-semibold tracking-[0.05em] text-fd-primary uppercase"
                    >
                      {displayTag(tag)}
                    </Link>
                  )}
                  {authors.length > 0 && (
                    <p className="text-sm text-fd-muted-foreground">
                      by{" "}
                      <span className="font-medium text-fd-foreground">
                        {authors.map((a) => a.name).join(", ")}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <h1
                className="mt-7 text-[clamp(32px,5vw,46px)] font-semibold leading-[1.12] tracking-[-0.01em] text-fd-foreground"
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                }}
              >
                {page.data.title}
              </h1>

              {lede && (
                <p className="mt-5 text-[18.5px] leading-relaxed text-fd-muted-foreground">
                  {lede}
                </p>
              )}

              {/* Date · reading time, share tucked to the right */}
              <div className="mt-7 flex items-center justify-between gap-4 border-b border-fd-border pb-5">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fd-muted-foreground">
                  {page.data.date && (
                    <time dateTime={new Date(page.data.date).toISOString()}>
                      {formatDate(page.data.date)}
                    </time>
                  )}
                  {minutes !== null && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" aria-hidden />
                      {minutes} min read
                    </span>
                  )}
                </p>
                <ShareButton url={page.url} />
              </div>
            </header>

            <div className="prose mt-10 min-w-0">
              <Mdx components={getMDXComponents({})} />
            </div>

            {/* Keep reading */}
            {related.length > 0 && (
              <footer className="mt-16 border-t border-fd-border pt-10">
                <h2 className="text-xl font-semibold tracking-tight text-fd-foreground">
                  Keep reading
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-3">
                  {related.map((post) => (
                    <RelatedCard key={post.url} post={post} />
                  ))}
                </div>
              </footer>
            )}
          </article>

          {/* On this page — quiet sticky rail, wide screens only */}
          {toc.length > 1 && (
            <aside className="absolute top-0 left-full ml-8 hidden h-full w-40 xl:block">
              <nav
                aria-label="On this page"
                className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto"
              >
                <p className="text-[11px] font-semibold tracking-[0.1em] text-fd-muted-foreground uppercase">
                  On this page
                </p>
                <ul className="mt-3 flex flex-col gap-2 border-l border-fd-border">
                  {toc
                    .filter((item) => item.depth <= 3)
                    .map((item) => (
                      <li key={item.url}>
                        <a
                          href={item.url}
                          className={
                            "block border-l border-transparent text-[13px] leading-snug text-fd-muted-foreground transition-colors hover:text-fd-foreground " +
                            (item.depth === 3 ? "pl-6" : "pl-3.5")
                          }
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}

function RelatedCard({ post }: { post: BlogPage }) {
  return (
    <Link href={post.url} className="group flex flex-col">
      <div
        className="aspect-[16/10] w-full rounded-lg transition-opacity group-hover:opacity-90"
        style={{ background: titleGradient(post.data.title) }}
        aria-hidden
      />
      <p className="mt-3 text-[14.5px] font-medium leading-snug text-fd-foreground">
        {post.data.title}
      </p>
      {post.data.date && (
        <p className="mt-1.5 text-[13px] text-fd-muted-foreground">
          {formatDate(post.data.date)}
        </p>
      )}
    </Link>
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
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = blog.getPage([slug]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description ?? page.data.excerpt,
    openGraph: {
      type: "article",
      title: page.data.title,
      description: page.data.description ?? page.data.excerpt,
      publishedTime: page.data.date
        ? new Date(page.data.date).toISOString()
        : undefined,
      authors: page.data.authors?.map((a) => a.name),
    },
  };
}
