import { getSearchEntryMap } from "@/app/resources/search-catalog/get-searches";
import { TextLink } from "@/components/text-link";
import { Button } from "@/components/ui/button";
import {
  getSearchEntry,
  getSearchVersion,
  searchCatalog,
  SearchId,
} from "@pipe0/client-sdk";
import { ArrowLeft } from "lucide-react";
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

  const searchEntryMap = await getSearchEntryMap();

  const searchVersions = findAllSearchVersions(searchId);

  const tags = searchCatalogEntry?.tags || [];

  return (
    <div className="max-w-[var(--nextra-content-width)] pt-6 pb-24 grid md:grid-cols-[300px_1fr] gap-3 mx-auto px-7">
      <aside className="space-y-8 hidden md:block">
        <div>
          <Link href="/resources/search-catalog">
            <Button variant="ghost" className="px-0">
              <ArrowLeft /> Return to Catalog
            </Button>
          </Link>
        </div>
        <div>
          <h3 className="font-semibold text-sm pb-4">Available versions</h3>
          <div>
            {searchVersions.map((e, index) => {
              const routeEntry = searchEntryMap[e.searchId];
              if (!routeEntry) return null;
              return (
                <React.Fragment key={e.searchId}>
                  <TextLink className="text-sm" href={routeEntry.route}>
                    @{e.searchId.split("@")[1]}
                  </TextLink>
                  {index < searchVersions.length - 1 && ", "}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className="max-w-[150px]">
          <h3 className="font-semibold text-sm pb-4">Tags</h3>
          {tags && tags.length > 0 && (
            <div className="text-sm">
              {tags.map((tag, index) => (
                <React.Fragment key={tag}>
                  <TextLink
                    href={`/resources/search-catalog?type=tag&value=${encodeURI(
                      tag
                    )}`}
                  >
                    {tag}
                  </TextLink>
                  {index < tags.length - 1 && ", "}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </aside>
      <section className="">{children}</section>
    </div>
  );
}
