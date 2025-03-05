import { SidebarLayout } from "@/components/features/docs/sidebar-layout";
import { TableOfContents } from "@/components/features/docs/table-of-contents";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPipePageBySlug, getPipePages } from "@/lib/pipes";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface IntegrationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: IntegrationPageProps
): Promise<Metadata> {
  const params = await props.params;
  const integration = await getPipePageBySlug(params.slug);

  if (!integration) {
    return {
      title: "Integration Not Found",
    };
  }
  return {
    title: `${integration.name} Integration`,
    description: integration.description,
  };
}

export async function generateStaticParams() {
  const integrations = await getPipePages();

  return integrations.map((integration) => ({
    slug: integration.slug,
  }));
}

export default async function IntegrationPage(props: IntegrationPageProps) {
  const params = await props.params;
  const integration = await getPipePageBySlug(params.slug);

  if (!integration) {
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
              <BreadcrumbLink asChild>
                <Link href="/docs/pipe-catalog">Pipes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {integration.vendor + " - " + integration.label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            {integration.vendor + " - " + integration.label}
          </h1>

          <p>{integration.description}</p>
        </div>

        <Separator />

        <a className="block" href={`#input-fields`}>
          <h2
            id="input-fields"
            className="group cursor-pointer text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4 relative"
          >
            <span className="absolute -left-6 hidden font-normal text-zinc-400 lg:group-hover:inline">
              #
            </span>
            Input Fields
          </h2>
        </a>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integration.inputFields.map((field) => (
              <TableRow key={field.name}>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {field.description}
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">
                  {field.type}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <a className="block" href={`#output-fields`}>
          <h2
            id="output-fields"
            className="group cursor-pointer text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4 relative"
          >
            <span className="absolute -left-6 hidden font-normal text-zinc-400 lg:group-hover:inline">
              #
            </span>
            Output Fields
          </h2>
        </a>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integration.inputFields.map((field) => (
              <TableRow key={field.name}>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {field.description}
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">
                  {field.type}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Separator />

        <div className="prose prose-lg max-w-none">{integration.content}</div>
      </div>
    </SidebarLayout>
  );
}
