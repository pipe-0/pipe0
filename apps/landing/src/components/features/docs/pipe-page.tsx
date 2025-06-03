import {
  getPipeEntries,
  getPipeEntryMap,
} from "@/app/resources/pipe-catalog/get-pipes";
import { TextLink } from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { getPipeVersionFromId } from "@/lib/utils";
import { PipeId, pipeMetaCatalog } from "@pipe0/client-sdk";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

function findAllPipeVersions(pipeId: PipeId) {
  const pipeMetaEntry = pipeMetaCatalog[pipeId];
  const res = Object.entries(pipeMetaCatalog)
    .map(([pipeId, entry]) => ({ pipeId: pipeId as PipeId, ...entry }))
    .filter((e) => e.basePipe === pipeMetaEntry.basePipe)
    .sort((a, b) => {
      const versionA = getPipeVersionFromId(a.pipeId);
      const versionB = getPipeVersionFromId(b.pipeId);

      return versionB - versionA;
    });

  return res;
}

export async function PipePage({
  children,
  pipeId,
}: PropsWithChildren<{ pipeId: PipeId }>) {
  const pipeCatalogEntry = pipeMetaCatalog[pipeId];

  const pipeEntryMap = await getPipeEntryMap();

  const pipeVersions = findAllPipeVersions(pipeId);

  const tags = pipeCatalogEntry?.tags || [];

  return (
    <div className="max-w-[var(--nextra-content-width)] pt-6 pb-24 grid md:grid-cols-[300px_1fr] gap-3 mx-auto px-7">
      <aside className="space-y-8 hidden md:block">
        <div>
          <Link href="/resources/pipe-catalog">
            <Button variant="ghost" className="px-0">
              <ArrowLeft /> Return to Catalog
            </Button>
          </Link>
        </div>
        <div>
          <h3 className="font-semibold text-sm pb-4">Available versions</h3>
          <div>
            {pipeVersions.map((e, index) => {
              const routeEntry = pipeEntryMap[e.pipeId];
              if (!routeEntry) return null;
              return (
                <React.Fragment key={e.pipeId}>
                  <TextLink className="text-sm" href={routeEntry.route}>
                    @{e.pipeId.split("@")[1]}
                  </TextLink>
                  {index < pipeVersions.length - 1 && ", "}
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
                    href={`/resources/pipe-catalog?type=tag&value=${encodeURI(
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
