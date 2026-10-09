"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, copyToClipboard, formatCredits } from "@/lib/utils";
import { providerCatalog } from "@pipe0/base";
import { ArrowRight, Copy } from "lucide-react";
import Link from "next/link";
import { useIntentPrefetch } from "@/hooks/use-intent-prefetch";

export type CatalogFieldPill = {
  name: string;
  required?: boolean;
};

export type CatalogFieldList = CatalogFieldPill[] | "dynamic";

type CatalogListRowProps = {
  href: string;
  label: string;
  entryId: string;
  description: string;
  providers: readonly string[];
  inputFields?: CatalogFieldList;
  outputFields?: CatalogFieldList | string[];
  credits: number;
  /**
   * Replaces the credit figure entirely. For entries whose price is not one
   * per-unit number — a usage-metered search bills model tokens plus per-call
   * tools, so its `credits` is 0 and would otherwise render as "Free".
   */
  priceLabel?: string;
  /** When true, prefix the credit figure with "from" — it's a high-volume floor. */
  priceFrom?: boolean;
  billableUnit?: string;
  isNew?: boolean;
  isDeprecated?: boolean;
};

const FIELD_PILL_LIMIT = 3;
const PROVIDER_STACK_LIMIT = 4;

/**
 * The entry's provider tile. With more than one provider it is drawn as a
 * physical stack: blank cards fanned out to the right behind the front one,
 * one per extra provider (up to three), so the count reads at a glance
 * without a "+N" badge.
 */
export function ProviderTile({ providers }: { providers: readonly string[] }) {
  const primary = providers[0];
  const behind = Math.min(Math.max(providers.length - 1, 0), 3);
  const provider = primary
    ? providerCatalog[primary as keyof typeof providerCatalog]
    : undefined;

  return (
    <div
      className="relative shrink-0"
      style={{ width: 44 + behind * 8, height: 44 }}
      title={`${providers.length} provider${providers.length === 1 ? "" : "s"}`}
    >
      {Array.from({ length: behind }, (_, k) => {
        const depth = behind - k; // furthest card first
        return (
          <span
            key={depth}
            aria-hidden
            className="absolute top-0 size-11 rounded-[10px] border border-[var(--rule-strong)] bg-background"
            style={{
              left: depth * 8,
              transform: `rotate(${depth * 5}deg) scale(${1 - depth * 0.06})`,
              transformOrigin: "bottom left",
              backgroundColor: `hsl(228 33% ${100 - depth * 2}%)`,
              boxShadow: "0 1px 2px rgba(14,17,23,0.05)",
            }}
          />
        );
      })}
      <div className="absolute left-0 top-0 flex size-11 items-center justify-center overflow-hidden rounded-[10px] border border-[var(--rule)] bg-background shadow-[0_1px_2px_rgba(14,17,23,0.05)]">
        {provider?.logoUrl ? (
          <Avatar className="size-7 rounded-md">
            <AvatarImage
              src={provider.logoUrl}
              alt={provider.label}
              className="object-contain"
            />
            <AvatarFallback className="rounded-md text-[10px]">
              {(provider.label ?? primary ?? "P").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">P</span>
        )}
      </div>
    </div>
  );
}

/* Grey tones for the tiles, light to slightly darker, cycled per tile. */
const TILE_TONES = [
  "hsl(228 33% 99%)",
  "hsl(228 28% 96.5%)",
  "hsl(228 24% 94%)",
  "hsl(228 22% 91.5%)",
];

/**
 * A card's provider preview: logo tiles in the same material as the stacked
 * entry tile, overlapping to the right in alternating grey tones. When there
 * are more than fit, the row simply runs out past the card's right edge and
 * fades — a preview, not a list. The parent should let it bleed to the edge.
 */
export function ProviderTileStrip({
  providers,
}: {
  providers: readonly string[];
}) {
  if (providers.length === 0) return null;
  const shown = providers.slice(0, 9);
  return (
    <div
      className="flex items-center overflow-hidden py-1 pl-0.5"
      style={{
        maskImage: "linear-gradient(to right, black 72%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, black 72%, transparent 100%)",
      }}
    >
      {shown.map((name, i) => {
        const p = providerCatalog[name as keyof typeof providerCatalog];
        return (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <span
                className="relative grid size-11 shrink-0 place-items-center rounded-[10px] border border-[var(--rule-strong)] shadow-[0_1px_2px_rgba(14,17,23,0.05)]"
                style={{
                  marginLeft: i === 0 ? 0 : -10,
                  zIndex: shown.length - i,
                  backgroundColor: TILE_TONES[i % TILE_TONES.length],
                  transform: `rotate(${i === 0 ? 0 : (i % 2 ? 2.5 : -2)}deg)`,
                }}
              >
                {p?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.logoUrl}
                    alt={p.label}
                    className="size-5 object-contain"
                  />
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    {name.slice(0, 2)}
                  </span>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>{p?.label ?? name}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

function FieldPill({
  children,
  required,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap text-[12px] text-muted-foreground",
        className,
      )}
    >
      {children}
      {required && <span className="text-primary ml-0.5">*</span>}
    </span>
  );
}

function FieldPillRow({
  label,
  fields,
}: {
  label: string;
  fields: CatalogFieldList;
}) {
  if (fields === "dynamic") {
    return (
      <div className="inline-flex items-center gap-1 min-w-0">
        <span className="text-[12px] text-muted-foreground/70">{label}</span>
        <span className="whitespace-nowrap text-[12px] text-primary">
          dynamic
        </span>
      </div>
    );
  }
  if (!fields.length) return null;
  const visible = fields.slice(0, FIELD_PILL_LIMIT);
  const overflow = fields.length - visible.length;
  const overflowNames = fields.slice(FIELD_PILL_LIMIT).map((f) => f.name);

  return (
    <div className="inline-flex min-w-0 items-center gap-1.5">
      <span className="text-[12px] text-muted-foreground/70">{label}</span>
      {visible.map((f, i) => (
        <FieldPill key={f.name} required={f.required}>
          {f.name}
          {i < visible.length - 1 || overflow > 0 ? "," : ""}
        </FieldPill>
      ))}
      {overflow > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default whitespace-nowrap text-[12px] text-muted-foreground">
              +{overflow}
            </span>
          </TooltipTrigger>
          <TooltipContent>{overflowNames.join(", ")}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function normalizeOutputFields(
  fields: CatalogFieldList | string[] | undefined,
): CatalogFieldList {
  if (fields === undefined) return [];
  if (fields === "dynamic") return "dynamic";
  if (typeof fields[0] === "string") {
    return (fields as string[]).map((name) => ({ name }));
  }
  return fields as CatalogFieldPill[];
}

export function CatalogListRow({
  href,
  label,
  entryId,
  description,
  providers,
  inputFields,
  outputFields,
  credits,
  priceLabel,
  priceFrom,
  billableUnit,
  isNew,
  isDeprecated,
}: CatalogListRowProps) {
  const intentPrefetch = useIntentPrefetch(href);
  const inputs = inputFields ?? [];
  const outputs = normalizeOutputFields(outputFields);
  const showFieldRow =
    inputs === "dynamic" ||
    (Array.isArray(inputs) && inputs.length > 0) ||
    outputs === "dynamic" ||
    (Array.isArray(outputs) && outputs.length > 0);
  const providerCount = providers.length;
  const inHasContent =
    inputs === "dynamic" || (Array.isArray(inputs) && inputs.length > 0);
  const outHasContent =
    outputs === "dynamic" || (Array.isArray(outputs) && outputs.length > 0);

  return (
    <Link
      href={href}
      {...intentPrefetch}
      className="group -mx-3 flex gap-4 rounded-[10px] border-b border-[var(--rule)] px-3 py-3.5 transition-colors last:border-b-0 hover:bg-[var(--well)]"
    >
      <ProviderTile providers={providers} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "truncate text-[15px] font-medium tracking-[-0.01em] text-foreground",
              isDeprecated && "line-through",
            )}
          >
            {label}
          </span>
          <span className="hidden truncate text-[12.5px] text-muted-foreground/80 md:inline">
            {entryId.replace(/@\d+$/, "")}
          </span>
          {isNew && (
            <Badge
              variant="default"
              className="shrink-0 bg-primary px-1.5 py-0 text-[10px] leading-none text-white"
            >
              New
            </Badge>
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-[13.5px] text-muted-foreground">
          {description}
        </p>
        {showFieldRow && (
          <div className="hidden md:flex items-center gap-2 mt-1.5 min-w-0 overflow-hidden">
            {inHasContent && <FieldPillRow label="In" fields={inputs} />}
            {inHasContent && outHasContent && (
              <ArrowRight className="size-3 text-muted-foreground/60 shrink-0" />
            )}
            {outHasContent && <FieldPillRow label="Out" fields={outputs} />}
          </div>
        )}
      </div>

      {/* Price: the amount in full ink, its unit underneath. The provider
          count is carried by the stacked tile on the left. */}
      <div className="hidden min-w-[88px] shrink-0 flex-col items-end text-right sm:flex">
        {priceLabel ? (
          <span className="text-[13.5px] text-muted-foreground">{priceLabel}</span>
        ) : credits ? (
          <>
            <span className="text-[15px] font-medium tabular-nums tracking-[-0.01em] text-foreground">
              {priceFrom && (
                <span className="mr-1 text-[12px] font-normal text-muted-foreground">
                  from
                </span>
              )}
              {formatCredits(credits)} cr
            </span>
            <span className="text-[12px] text-muted-foreground">
              per {billableUnit ?? "result"}
            </span>
          </>
        ) : (
          <span className="text-[15px] font-medium text-foreground">Free</span>
        )}
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="size-6 self-start opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          copyToClipboard(entryId);
        }}
      >
        <Copy className="size-3" />
      </Button>
    </Link>
  );
}
