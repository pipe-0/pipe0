import { buttonVariants } from "@/components/ui/button";
import { blog } from "@/lib/source";
import { cn } from "@/lib/utils";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "./page.client";

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const page = blog.getPage([slug]);
  if (!page) notFound();

  const { body: Mdx } = await page.data.load();

  return (
    <article className="mx-auto flex w-full max-w-[720px] flex-col px-6 py-16 md:py-20">
      <div className="mb-8 flex flex-row gap-6 text-sm">
        {page.data.authors && page.data.authors.length > 0 && (
          <div>
            <p className="mb-1 text-fd-muted-foreground">Written by</p>
            <p className="font-medium">
              {page.data.authors.map((a) => a.name).join(", ")}
            </p>
          </div>
        )}
        {page.data.date && (
          <div>
            <p className="mb-1 text-fd-muted-foreground">Published</p>
            <p className="font-medium">
              {new Date(page.data.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">
        {page.data.title}
      </h1>
      {page.data.description && (
        <p className="mt-3 text-fd-muted-foreground">{page.data.description}</p>
      )}

      <div className="prose mt-8 min-w-0 flex-1">
        <div className="not-prose mb-8 flex flex-row gap-2">
          <ShareButton url={page.url} />
          <Link
            href="/blog"
            className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
          >
            Back
          </Link>
        </div>

        <Mdx components={getMDXComponents({})} />
      </div>
    </article>
  );
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
    description: page.data.description,
  };
}
