import { IntegrationCatalog } from "@/components/features/docs/integration-catalog";
import { SidebarLayout } from "@/components/features/docs/sidebar-layout";
import { QuickLinks } from "@/components/quick-links";
import { getPipePagesAndMetadata } from "@/lib/pipes";
import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pipe Catalog",
  description: "Browse our extensive catalog of integrations",
};

export default async function IntegrationsPage() {
  const pagesAndMeta = await getPipePagesAndMetadata();

  return (
    <SidebarLayout
      sidebar={
        <QuickLinks
          links={[
            { href: "/docs", label: "Documentation" },
            {
              href: "/docs/quick-start",
              label: "Quick Start",
            },
          ]}
        />
      }
    >
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
              <BreadcrumbPage>Pipes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Pipe Catalog
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse and search our extensive catalog of integrations to find the
            perfect solution for your needs.
          </p>
        </div>

        <IntegrationCatalog pagesAndMeta={pagesAndMeta} />
      </div>
    </SidebarLayout>
  );
}
