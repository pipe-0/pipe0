import { lastRevised, postsByAuthor } from "@/app/blog/blog-utils";
import { AuthorAvatar } from "@/app/blog/author-avatar";
import { toFeedPost } from "@/app/blog/index-view";
import { PostFeed } from "@/app/blog/page.client";
import { PreferredSourceButton } from "@/app/blog/preferred-source-button";
import {
  JsonLd,
  breadcrumbJsonLd,
  profilePageJsonLd,
} from "@/components/seo/json-ld";
import { AUTHORS, authorUrl, getAuthorBySlug } from "@/lib/authors";
import { ArrowUpRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function AuthorPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const posts = postsByAuthor(author.key);
  const newest = posts
    .map(lastRevised)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <>
      <JsonLd
        data={profilePageJsonLd(author, {
          dateModified: newest?.toISOString().slice(0, 10),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "pipe0", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: author.name, url: authorUrl(author) },
        ])}
      />

      {/* Same container as the HomeLayout header: --fd-layout-width + px-4 */}
      <main className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-12 md:py-14">
        <header className="mx-auto max-w-[680px]">
          <div className="flex items-center gap-5">
            <AuthorAvatar name={author.key} className="size-20" />
            <div className="min-w-0">
              <h1 className="font-blog text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-fd-foreground sm:text-[40px]">
                {author.name}
              </h1>
              <p className="mt-1 text-[15px] text-fd-muted-foreground">
                {author.jobTitle}, pipe0
              </p>
            </div>
          </div>

          <p className="font-blog mt-7 text-[18px] leading-[1.5] text-fd-foreground text-pretty">
            {author.bio}
          </p>

          <ul className="mt-6 space-y-2">
            {author.credentials.map((credential) => (
              <li
                key={credential}
                className="flex gap-2.5 text-[15px] leading-snug text-fd-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-fd-primary" />
                {credential}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-fd-border pt-6">
            {author.profiles.map((profile) => (
              <a
                key={profile.url}
                href={profile.url}
                target="_blank"
                rel="me noopener noreferrer"
                className="inline-flex items-center gap-1 text-[14px] text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                {profile.label}
                <ArrowUpRight className="size-3.5" />
              </a>
            ))}
            <PreferredSourceButton className="sm:ml-auto" />
          </div>
        </header>

        {posts.length > 0 && (
          <section className="mt-16 border-t border-fd-border pt-10">
            <h2 className="font-blog text-[22px] font-semibold tracking-[-0.015em] text-fd-foreground">
              Posts by {author.name.split(" ")[0]}{" "}
              <span className="text-fd-muted-foreground">· {posts.length}</span>
            </h2>
            <PostFeed posts={posts.map((p) => toFeedPost(p, 2))} />
          </section>
        )}
      </main>
    </>
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return AUTHORS.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const title = `${author.name}, ${author.jobTitle}`;
  return {
    title,
    description: author.bio,
    alternates: { canonical: authorUrl(author) },
    openGraph: {
      type: "profile",
      url: authorUrl(author),
      title,
      description: author.bio,
      images: [author.avatar],
    },
    twitter: { card: "summary" },
  };
}
