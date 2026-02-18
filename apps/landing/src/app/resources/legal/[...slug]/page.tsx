import { legal } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function LegalPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await props.params;
  const page = legal.getPage(slug);
  if (!page) notFound();

  const { body: Mdx } = await page.data.load();

  return (
    <article className="mx-auto flex w-full max-w-[720px] flex-col px-6 py-16 md:py-20">
      <div className="prose min-w-0 flex-1">
        <Mdx components={getMDXComponents({})} />
      </div>
    </article>
  );
}

export function generateStaticParams() {
  return legal.getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = legal.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
