import {
  AvailableVersions,
  CatalogPageLayout,
  TagList,
} from "@/components/features/docs/docs-layout";
import { TextLink } from "@/components/text-link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { getPipeEntry, PipeId, sortPipeCatalogByBasePipe } from "@pipe0/ops";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

const pipesByBasePipes = sortPipeCatalogByBasePipe();

export async function PipePage({
  children,
  pipeId,
}: PropsWithChildren<{
  pipeId: PipeId;
}>) {
  const pipeEntry = getPipeEntry(pipeId);
  const pipeVersions = pipesByBasePipes[pipeEntry.basePipe];

  return (
    <CatalogPageLayout
      backLink="/resources/pipe-catalog"
      sidebar={
        <div className="space-y-3">
          <AvailableVersions
            availableVersions={pipeVersions.map((v) => {
              const versionEntry = getPipeEntry(v.pipeId);
              return {
                displayValue: `@${v.pipeId.split("@")[1]}`,
                link: versionEntry.docPath,
                isDeprecated: !!versionEntry.lifecycle?.deprecatedOn,
              };
            })}
          />
          <TagList tags={pipeEntry.tags} />
        </div>
      }
      breadCrumps={
        <Breadcrumb className="pb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/resources/pipe-catalog">Pipe catalog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pipeId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      {children}
    </CatalogPageLayout>
  );
}
