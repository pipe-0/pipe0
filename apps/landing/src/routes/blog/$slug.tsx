import {
  categorySlug,
  formatDate,
  lastRevised,
  postCover,
} from "@/components/blog/blog-utils";
import { AuthorAvatar } from "@/components/blog/author-avatar";
import { AuthorCard } from "@/components/blog/author-card";
import { BlogCta } from "@/components/blog/blog-cta";
import { PostFaq } from "@/components/blog/post-faq";
import { PostToc } from "@/components/blog/post-toc";
import {
  ShareActions,
  SummarizeActions,
} from "@/components/blog/share-actions";
import { Image } from "@/components/image";
import { SiteLink } from "@/components/link";
import {
  ORG_ID,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLd,
  personRefJsonLd,
} from "@/components/seo/json-ld";
import { authorUrl, getAuthor } from "@/lib/authors";
import { getBlogPost } from "@/lib/blog.functions";
import type { PlainPage } from "@/lib/content";
import { seo } from "@/lib/seo";
import type { BlogPage } from "@/lib/collections.server";
import { getBaseUrl } from "@/lib/utils";
import { getMDXComponents } from "@/mdx-components";
import { createFileRoute, Link } from "@tanstack/react-router";
import browserCollections from "collections/browser";
import type { TOCItemType } from "fumadocs-core/toc";
import { ArrowLeft } from "lucide-react";
import type { MDXProps } from "mdx/types";
import type { FC } from "react";

type Post = PlainPage<BlogPage>;

function Article({
  Mdx,
  toc,
  page,
  related,
}: {
  Mdx: FC<MDXProps>;
  toc: TOCItemType[];
  page: Post;
  related: Post[];
}) {
  const lede = page.data.description ?? page.data.excerpt;
  const authors = page.data.authors ?? [];
  const author = authors[0];
  // The first managed author gets the "Written by" card; guests don't.
  const managedAuthor = authors
    .map((a) => getAuthor(a.name))
    .find((a) => a !== undefined);
  const minutes = page.data.minutes;
  const updated = page.data.updated;
  const shareUrl = `${getBaseUrl()}${page.url}`;
  // Both are opt-in per post; older posts don't carry them and render as
  // before.
  const tldr = page.data.tldr;
  const faq = page.data.faq ?? [];

  return (
    <>
      {/* Repeated property, which head() would dedupe to its last value. */}
      {page.data.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      <main className="mx-auto flex w-full max-w-[980px] items-start gap-11 px-5 pt-8 sm:px-8 md:pt-11">
        {/* Share rail — back to the index, then the share actions */}
        <aside className="sticky top-24 hidden w-9 shrink-0 flex-col items-center gap-1.5 md:flex">
          <Link
            to="/blog"
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

        <article className="min-w-0 flex-1">
          {/* Mobile bar — the rail's actions, folded into one row */}
          <div className="mb-6 flex items-center gap-1.5 md:hidden">
            <Link
              to="/blog"
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

          {/* Centered header — kicker, headline, lede, byline. Media in the
              body breaks out wider than the text, so the header sets the
              text measure. */}
          <header className="mx-auto max-w-[680px] text-center">
            <p className="text-[13px] text-fd-muted-foreground">
              {page.data.date && (
                <time dateTime={new Date(page.data.date).toISOString()}>
                  {formatDate(page.data.date)}
                </time>
              )}
              {page.data.category && (
                <>
                  {" · "}
                  <SiteLink
                    href={`/blog/category/${categorySlug(page.data.category)}`}
                    className="transition-colors hover:text-fd-foreground"
                  >
                    {page.data.category}
                  </SiteLink>
                </>
              )}
              <> · {minutes} min read</>
              {updated && (
                <>
                  {" · "}
                  <span>
                    Updated{" "}
                    <time dateTime={new Date(updated).toISOString()}>
                      {formatDate(updated)}
                    </time>
                  </span>
                </>
              )}
            </p>

            <h1 className="font-blog mt-4 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-fd-foreground text-pretty sm:text-[44px]">
              {page.data.title}
            </h1>

            {lede && (
              <p className="font-blog mt-5 text-[16px] leading-[1.5] text-fd-muted-foreground text-pretty sm:text-[18px]">
                {lede}
              </p>
            )}

            {/* Byline — avatars overlap when a post has several authors */}
            <div className="mt-6 flex items-center justify-center gap-2.5 text-[13px] text-fd-muted-foreground">
              {author ? (
                <>
                  <span className="flex shrink-0 -space-x-1.5">
                    {authors.map((a) => (
                      <AuthorAvatar
                        key={a.name}
                        name={a.name}
                        className="ring-2 ring-fd-background"
                      />
                    ))}
                  </span>
                  <span>
                    {authors.map((a, i) => {
                      const managed = getAuthor(a.name);
                      const label = managed?.name ?? a.name;
                      return (
                        <span key={a.name}>
                          {i > 0 && " · "}
                          {managed ? (
                            <SiteLink
                              href={authorUrl(managed)}
                              rel="author"
                              className="font-medium text-fd-foreground transition-colors hover:text-fd-primary"
                            >
                              {label}
                            </SiteLink>
                          ) : (
                            label
                          )}
                          {a.title && `, ${a.title}`}
                        </span>
                      );
                    })}
                  </span>
                </>
              ) : (
                <>
                  <AuthorAvatar name="pipe0" />
                  <span>The pipe0 team</span>
                </>
              )}
            </div>

            <SummarizeActions url={shareUrl} className="mt-3 justify-center" />
          </header>

          {page.data.cover && (
            <figure className="mt-10 sm:mt-12">
              <Image
                src={page.data.cover}
                alt=""
                sizes="(max-width: 980px) 100vw, 900px"
                priority
                className="w-full object-cover"
              />
            </figure>
          )}

          {/* TL;DR — the post in three sentences, on the text measure. Same
              muted panel as the closing CTA so it reads as an aside, not as
              the first paragraph. */}
          {tldr && (
            <aside
              aria-label="TL;DR"
              className="mx-auto mt-10 max-w-[680px] rounded-2xl bg-fd-muted px-6 py-6 sm:mt-12 sm:px-8 sm:py-7"
            >
              <p className="text-[13px] font-medium text-fd-muted-foreground">
                TL;DR
              </p>
              <p className="font-blog mt-3 text-[18px] leading-[1.45] text-fd-foreground text-pretty sm:text-[20px]">
                {tldr}
              </p>
            </aside>
          )}

          <PostToc items={toc} />

          <div className="prose blog-prose mt-12 min-w-0 sm:mt-16">
            <Mdx components={getMDXComponents({})} />
          </div>

          <PostFaq items={faq} />

          {managedAuthor && <AuthorCard author={managedAuthor} />}

          {/* Keep reading */}
          {related.length > 0 && (
            <footer className="mt-16">
              <h2 className="font-blog text-[22px] font-semibold tracking-[-0.015em] text-fd-foreground">
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

function RelatedCard({ post }: { post: Post }) {
  return (
    <SiteLink href={post.url} className="group flex flex-col">
      <Image
        src={postCover(post, 2)}
        alt=""
        sizes="(max-width: 640px) 100vw, 440px"
        className="aspect-[2/1] w-full object-cover transition-opacity group-hover:opacity-90"
      />
      <p className="font-blog mt-3 text-[17px] font-semibold leading-[1.25] text-fd-foreground text-pretty transition-colors group-hover:text-fd-primary">
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
    </SiteLink>
  );
}

/** Cover when the post has one, otherwise its rendered title card. */
function postShareImage(page: Post): string {
  return page.data.cover ?? `/og/blog/${page.slugs[0]}`;
}

const content = browserCollections.blog.createClientLoader({
  id: "blog",
  component({ default: Mdx, toc }, props: { page: Post; related: Post[] }) {
    return <Article Mdx={Mdx} toc={toc} {...props} />;
  },
});

function BlogPost() {
  const { post, related } = Route.useLoaderData();
  return content.useContent(post.path, { page: post, related });
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const data = await getBlogPost(params.slug);
    await content.preload(data.post.path);
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const page = loaderData.post;
    const lede = page.data.description ?? page.data.excerpt;
    const authors = page.data.authors ?? [];
    const shareUrl = `${getBaseUrl()}${page.url}`;
    const faq = page.data.faq ?? [];
    return {
      ...seo({
        title: page.data.title,
        description: lede,
        path: page.url,
        canonical: page.data.canonicalUrl,
        ogType: "article",
        siteName: false,
        image: postShareImage(page),
        og: {
          "article:published_time": page.data.date
            ? new Date(page.data.date).toISOString()
            : undefined,
          "article:modified_time": lastRevised(page).toISOString(),
          "article:author": authors.map((a) => {
            const managed = getAuthor(a.name);
            return managed ? `${getBaseUrl()}${authorUrl(managed)}` : a.name;
          }),
          "article:section": page.data.category,
        },
        // Plain-markdown twin for answer engines and agents.
        alternates: { "text/markdown": `${page.url}.md` },
      }),
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: page.data.title,
          description: lede,
          ...(page.data.tldr && { abstract: page.data.tldr }),
          articleSection: page.data.category,
          datePublished: page.data.date,
          dateModified: lastRevised(page).toISOString().slice(0, 10),
          url: shareUrl,
          mainEntityOfPage: shareUrl,
          image: `${getBaseUrl()}${postShareImage(page)}`,
          author: authors.length
            ? authors.map((a) => {
                const managed = getAuthor(a.name);
                return managed
                  ? personRefJsonLd(managed)
                  : { "@type": "Person", name: a.name, jobTitle: a.title };
              })
            : { "@id": ORG_ID },
          publisher: { "@id": ORG_ID },
          ...(page.data.tags?.length && { keywords: page.data.tags }),
          inLanguage: "en",
        }),
        jsonLd(
          breadcrumbJsonLd([
            { name: "pipe0", url: "/" },
            { name: "Blog", url: "/blog" },
            ...(page.data.category
              ? [
                  {
                    name: page.data.category,
                    url: `/blog/category/${categorySlug(page.data.category)}`,
                  },
                ]
              : []),
            { name: page.data.title, url: page.url },
          ]),
        ),
        ...(faq.length > 0 ? [jsonLd(faqJsonLd(faq))] : []),
      ],
    };
  },
  component: BlogPost,
});
