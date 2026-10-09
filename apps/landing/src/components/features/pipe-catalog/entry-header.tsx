"use client";

import { ProviderTile } from "@/components/features/pipe-catalog/catalog-list-row";
import { TextLink } from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { cn, copyToClipboard } from "@/lib/utils";
import type { ProviderName } from "@pipe0/base";
import { Copy } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { toast } from "sonner";

/**
 * The head of every catalog detail page — pipes and searches alike, so the
 * two catalogs read as one product: provider tile, title (struck through when
 * deprecated), badge and versions, one line of description, then a metadata
 * row with the copyable id, the price, and the providers.
 */
export function EntryHeader({
  id,
  label,
  description,
  providers,
  badge,
  deprecated,
  versions,
  price,
  idLabel,
}: {
  id: string;
  label: string;
  description: string;
  providers: readonly ProviderName[];
  badge?: ReactNode;
  deprecated?: boolean;
  versions: { displayValue: string; link: string; isDeprecated: boolean }[];
  /** Already formatted, e.g. "from 0.25 cr / result". */
  price: ReactNode;
  idLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <ProviderTile providers={providers} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1
              className={cn(
                "text-[30px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground",
                deprecated && "line-through",
              )}
            >
              {label}
            </h1>
            {badge}
            {versions.length > 1 && (
              <div className="ml-auto text-[13px] text-muted-foreground">
                {versions.map((e, index) => (
                  <Fragment key={e.link + index}>
                    <TextLink
                      className={cn("text-[13px]", e.isDeprecated && "line-through")}
                      href={e.link}
                    >
                      {e.displayValue}
                    </TextLink>
                    {index < versions.length - 1 && ", "}
                  </Fragment>
                ))}
              </div>
            )}
          </div>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1.5 rounded-[7px] border border-[var(--rule-strong)] bg-[var(--well)] py-1 pl-2.5 pr-1.5">
          <span className="truncate font-mono text-[12.5px] text-foreground">
            {id}
          </span>
          <Button
            size="icon"
            variant="ghost"
            aria-label={idLabel}
            className="size-5 shrink-0 opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100"
            onClick={() => {
              copyToClipboard(id);
              toast("Copied");
            }}
          >
            <Copy className="size-3" />
          </Button>
        </div>
        <span>{price}</span>
        {providers.length > 1 && (
          <span>
            {providers.length} providers
          </span>
        )}
      </div>
    </div>
  );
}

/** Accordion section label: one weight, a quiet count or hint beside it. */
export function SectionTriggerLabel({
  label,
  count,
  hint,
}: {
  label: string;
  count?: number | string;
  hint?: string;
}) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-[13px] font-normal tabular-nums text-muted-foreground">
          {count}
        </span>
      )}
      {hint && (
        <span className="text-[13px] font-normal text-muted-foreground">
          {hint}
        </span>
      )}
    </span>
  );
}
