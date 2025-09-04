import { TextLink } from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getPipeEntry,
  PipeId,
  sortPipeCatalogByBasePipe,
} from "@pipe0/client-sdk";
import { ArrowLeft } from "lucide-react";
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
              const versionEntry = getPipeEntry(e.pipeId);
              if (!versionEntry) return null;
              return (
                <React.Fragment key={e.pipeId}>
                  <TextLink
                    className={cn(
                      "text-sm",
                      pipeEntry.lifecycle?.deprecatedOn && "line-through"
                    )}
                    href={versionEntry.docPath}
                  >
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
          {pipeEntry.tags && pipeEntry.tags.length > 0 && (
            <div className="text-sm">
              {pipeEntry.tags.map((tag, index) => (
                <React.Fragment key={tag}>
                  <TextLink
                    href={`/resources/pipe-catalog?type=tag&value=${encodeURI(
                      tag
                    )}`}
                  >
                    {tag}
                  </TextLink>
                  {index < pipeEntry.tags.length - 1 && ", "}
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
