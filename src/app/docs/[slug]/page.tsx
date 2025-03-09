import { TableOfContents } from "@/components/features/docs/table-of-contents";
import { SidebarLayout } from "@/components/features/docs/sidebar-layout";
import { getDocPages, getDocPageBySlug } from "@/lib/docs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export const dynamicParams = false;

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: DocPageProps): Promise<Metadata> {
  const params = await props.params;
  const docPage = await getDocPageBySlug(params.slug);

  if (!docPage) {
    return {
      title: "Documentation Not Found",
    };
  }

  return {
    title: `${docPage.title} | Documentation`,
    description: docPage.description,
  };
}

export async function generateStaticParams() {
  const docPages = await getDocPages();

  return docPages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function DocPage(props: DocPageProps) {
  const params = await props.params;
  const docPage = await getDocPageBySlug(params.slug);

  if (!docPage) {
    notFound();
  }

  return (
    <SidebarLayout sidebar={<TableOfContents />}>
      <div className="space-y-6">
        <Breadcrumb className="">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/docs">Documentation</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{docPage.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            {docPage.title}
          </h1>
        </div>
        <div>{docPage.content}</div>
      </div>
    </SidebarLayout>
  );
}
