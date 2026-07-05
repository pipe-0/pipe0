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
import { type ProviderName, providerCatalog } from "@pipe0/base";
import { AvatarGroup } from "@pipe0/react";
import { ArrowRight, Copy } from "lucide-react";
import Link from "next/link";

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
  /** When true, prefix the credit figure with "from" — it's a high-volume floor. */
  priceFrom?: boolean;
  billableUnit?: string;
  isNew?: boolean;
  isDeprecated?: boolean;
};

const FIELD_PILL_LIMIT = 3;
const PROVIDER_STACK_LIMIT = 4;

export function ProviderTile({ providers }: { providers: readonly string[] }) {
  const primary = providers[0];
  const remaining = providers.length - 1;
  const provider = primary
    ? providerCatalog[primary as keyof typeof providerCatalog]
    : undefined;

  return (
    <div className="relative shrink-0">
      <div className="flex size-10 items-center justify-center rounded-md bg-muted overflow-hidden">
        {provider?.logoUrl ? (
          <Avatar className="rounded-md size-7">
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
      {remaining > 0 && (
        <span className="absolute -top-1 -left-1 inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground text-[10px] leading-none font-medium px-1 min-w-4 h-4 border border-background">
          +{remaining}
        </span>
      )}
    </div>
  );
}

export function ProviderStack({ providers }: { providers: readonly string[] }) {
  if (providers.length === 0) return null;
  const visible = providers.slice(0, PROVIDER_STACK_LIMIT);
  const overflow = providers.length - visible.length;

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((name) => {
        const p = providerCatalog[name as keyof typeof providerCatalog];
        return (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <Avatar className="size-4 rounded-sm ring-1 ring-background">
                <AvatarImage
                  src={p?.logoUrl}
                  alt={p?.label ?? name}
                  className="object-contain"
                />
                <AvatarFallback className="rounded-sm text-[8px]">
                  {(p?.label ?? name).slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{p?.label ?? name}</TooltipContent>
          </Tooltip>
        );
      })}
      {overflow > 0 && (
        <span className="inline-flex items-center justify-center size-4 rounded-sm ring-1 ring-background bg-muted text-[8px] font-medium text-muted-foreground">
          +{overflow}
        </span>
      )}
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
        "inline-flex items-center font-mono text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground whitespace-nowrap",
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
        <span className="text-[10px] font-medium text-muted-foreground/80 uppercase tracking-wide">
          {label}
        </span>
        <span className="inline-flex items-center font-mono text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary whitespace-nowrap italic">
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
    <div className="inline-flex items-center gap-1 min-w-0">
      <span className="text-[10px] font-medium text-muted-foreground/80 uppercase tracking-wide">
        {label}
      </span>
      {visible.map((f) => (
        <FieldPill key={f.name} required={f.required}>
          {f.name}
        </FieldPill>
      ))}
      {overflow > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center font-mono text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground whitespace-nowrap cursor-default">
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
  priceFrom,
  billableUnit,
  isNew,
  isDeprecated,
}: CatalogListRowProps) {
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
      className="group flex gap-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors -mx-2 px-2 rounded"
    >
      <ProviderTile providers={providers} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "text-sm font-semibold text-foreground truncate",
              isDeprecated && "line-through",
            )}
          >
            {label}
          </span>
          <span className="hidden md:inline font-mono text-xs text-muted-foreground/80 truncate">
            {entryId.replace(/@\d+$/, "")}
          </span>
          {isNew && (
            <Badge
              variant="default"
              className="text-[10px] px-1.5 py-0 leading-none bg-foreground text-background shrink-0"
            >
              New
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {description}
        </p>
        {showFieldRow && (
          <div className="hidden md:flex items-center gap-2 mt-1.5 min-w-0 overflow-hidden">
            {inHasContent && <FieldPillRow label="IN" fields={inputs} />}
            {inHasContent && outHasContent && (
              <ArrowRight className="size-3 text-muted-foreground/60 shrink-0" />
            )}
            {outHasContent && <FieldPillRow label="OUT" fields={outputs} />}
          </div>
        )}
      </div>

      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-right">
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {credits ? (
            <span className="text-xs text-muted-foreground">
              {priceFrom ? "from " : ""}
              {formatCredits(credits)} cr
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Free</span>
          )}
          {billableUnit && credits ? (
            <span className="text-xs text-muted-foreground">
              / {billableUnit}
            </span>
          ) : null}
        </div>
        {providerCount > 0 && (
          <AvatarGroup
            providers={providers as readonly ProviderName[]}
            size="sm"
          />
        )}
        {providerCount > 0 && (
          <span className="text-[10px] text-muted-foreground/70">
            {providerCount} provider{providerCount === 1 ? "" : "s"}
          </span>
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
