"use client";

import { HighVolumePriceCell } from "@/components/high-volume-price";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { effectiveCredits } from "@/lib/pricing/effective-credits";
import { type BillableOperationDef, providerCatalog } from "@pipe0/base";

/**
 * Per-operation billing table. Shared by the pipe and search catalog headers:
 * a usage-metered search bills the same `BillableOperationDef` shape a pipe
 * does, so its operations render here rather than in a second table.
 */
export function ProviderTable({ entries }: { entries: [string, unknown][] }) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_140px_140px_120px] items-center gap-4 px-3 py-2 text-[11px] font-medium tracking-wide text-muted-foreground bg-muted/40 border-b border-border">
        <span>Provider</span>
        <span>Billing Mode</span>
        <span>Connection</span>
        <span className="text-right">Cost</span>
      </div>
      <div className="divide-y divide-border">
        {entries.map(([billableOperation, billableOperationDef]) => {
          const def = billableOperationDef as BillableOperationDef;
          const provider = providerCatalog[def.provider];

          const connections: string[] = [];
          if (provider.hasManagedConnections) connections.push("Managed");
          if (provider.allowsUserConnections) connections.push("User");

          return (
            <div
              key={billableOperation}
              className="grid grid-cols-[minmax(0,1fr)_140px_140px_120px] items-center gap-4 px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="size-7 rounded-md">
                  <AvatarImage
                    src={provider.logoUrl}
                    alt={`${provider.label} logo`}
                  />
                  <AvatarFallback className="rounded-md text-[10px]">
                    {provider.label.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="font-medium leading-tight cursor-default truncate">
                        {provider.label}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{provider.description}</TooltipContent>
                  </Tooltip>
                  <div
                    className="font-mono text-[11px] text-muted-foreground truncate"
                    title={billableOperation}
                  >
                    {billableOperation}
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground">
                {def.mode === "onSuccess"
                  ? "On Success"
                  : def.mode === "always"
                    ? "Always"
                    : "n/a"}
              </div>
              <div className="text-muted-foreground">
                {connections.join(", ")}
              </div>
              <div className="text-right tabular-nums">
                {/* `note` states the UNIT a usage-metered rate is charged in
                    ("per 100 input tokens", "per page the agent reads"). The
                    number alone is unreadable without it. */}
                {def.note ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-default border-b border-dotted border-muted-foreground/50">
                        <HighVolumePriceCell
                          credits={effectiveCredits(def)}
                          unit="credits"
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      {def.note}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <HighVolumePriceCell
                    credits={effectiveCredits(def)}
                    unit="credits"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
