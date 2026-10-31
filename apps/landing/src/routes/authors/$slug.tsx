import { AuthorAvatar } from "@/components/blog/author-avatar";
import { PostFeed } from "@/components/blog/post-feed";
import { PreferredSourceButton } from "@/components/blog/preferred-source-button";
import {
  breadcrumbJsonLd,
  jsonLd,
  profilePageJsonLd,
} from "@/components/seo/json-ld";
import { authorUrl, getAuthorBySlug } from "@/lib/authors";
import { getAuthorPage } from "@/lib/blog.functions";
import { seo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";

export const Route = createFileRoute("/authors/$slug")({
  loader: ({ params }) => getAuthorPage(params.slug),
  head: ({ loaderData }) => {
    const author = loaderData && getAuthorBySlug(loaderData.slug);
    if (!author) return {};
    const newest = loaderData.newest
      .map((date) => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    return {
      ...seo({
        title: `${author.name}, ${author.jobTitle}`,
        description: author.bio,
        path: authorUrl(author),
        ogType: "profile",
        image: author.avatar,
        siteName: false,
        twitterCard: "summary",
      }),
      scripts: [
        jsonLd(
          profilePageJsonLd(author, {
            dateModified: newest?.toISOString().slice(0, 10),
          }),
        ),
        jsonLd(
          breadcrumbJsonLd([
            { name: "pipe0", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: author.name, url: authorUrl(author) },
          ]),
        ),
      ],
    };
  },
  component: AuthorPage,
});

function AuthorPage() {
  const { slug, posts } = Route.useLoaderData();
  const author = getAuthorBySlug(slug)!;

  return (
    <>
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
            <PostFeed posts={posts} />
          </section>
        )}
      </main>
    </>
  );
}
