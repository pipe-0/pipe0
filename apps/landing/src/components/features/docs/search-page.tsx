import { getSearchEntryMap } from "@/app/resources/search-catalog/get-searches";
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
import {
  getSearchEntry,
  getSearchVersion,
  searchCatalog,
  SearchId,
} from "@pipe0/client-sdk";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

function findAllSearchVersions(searchId: SearchId) {
  const searchEntry = getSearchEntry(searchId);
  const res = Object.entries(searchCatalog)
    .map(([searchId, entry]) => ({ searchId: searchId as SearchId, ...entry }))
    .filter((e) => e.baseSearch === searchEntry.baseSearch)
    .sort((a, b) => {
      const versionA = getSearchVersion(a.searchId);
      const versionB = getSearchVersion(b.searchId);

      return versionB - versionA;
    });

  return res;
}

export async function SearchPage({
  children,
  searchId,
}: PropsWithChildren<{ searchId: SearchId }>) {
  const searchCatalogEntry = getSearchEntry(searchId);

  const searchVersions = findAllSearchVersions(searchId);

  const tags = searchCatalogEntry?.tags || [];

  return (
    <CatalogPageLayout
      sidebar={
        <div className="space-y-3">
          <AvailableVersions
            availableVersions={searchVersions.map((v) => {
              const versionEntry = getSearchEntry(v.searchId);
              return {
                displayValue: `@${v.searchId.split("@")[1]}`,
                link: versionEntry.docPath,
                isDeprecated: !!versionEntry.lifecycle?.deprecatedOn,
              };
            })}
          />
          <TagList tags={tags} />
        </div>
      }
      backLink="/resources/search-catalog"
      breadCrumps={
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/resources/pipe-catalog">Search catalog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{searchId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      {children}
    </CatalogPageLayout>
  );
}
