import { HighVolumePriceCell } from "@/components/high-volume-price";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OperationRow } from "@/lib/catalog-entry.server";

/**
 * Per-operation billing table. Shared by the pipe and search catalog headers:
 * a usage-metered search bills the same operations a pipe does, so its
 * operations render here rather than in a second table.
 *
 * Four fixed columns don't fit a phone: there the grid is provider and cost
 * only, and billing and connection move to a line under the provider.
 */
const COLS =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:grid-cols-[minmax(0,1fr)_140px_140px_120px]";

export function ProviderTable({ rows }: { rows: OperationRow[] }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--rule)]">
      <div className={`${COLS} border-b border-[var(--rule)] bg-[var(--well)] px-3 py-2 text-[12px] font-medium text-muted-foreground`}>
        <span>Provider</span>
        <span className="max-sm:hidden">Billing</span>
        <span className="max-sm:hidden">Connection</span>
        <span className="text-right">Cost</span>
      </div>
      <div className="divide-y divide-[var(--rule)]">
        {rows.map(({ operation, provider, billing, connections, note, price }) => (
          <div
            key={operation}
            className={`${COLS} px-3 py-2 text-sm hover:bg-muted/30 transition-colors`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Avatar
                className="size-7 rounded-md"
                style={{ backgroundColor: provider.tileColor }}
              >
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
                  title={operation}
                >
                  {operation}
                </div>
                <div className="text-[12px] text-muted-foreground sm:hidden">
                  {billing} · {connections.join(", ")}
                </div>
              </div>
            </div>
            <div className="text-muted-foreground max-sm:hidden">{billing}</div>
            <div className="text-muted-foreground max-sm:hidden">
              {connections.join(", ")}
            </div>
            <div className="text-right tabular-nums">
              {/* `note` states the UNIT a usage-metered rate is charged in
                  ("per 100 input tokens", "per page the agent reads"). The
                  number alone is unreadable without it. */}
              {note ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-default border-b border-dotted border-muted-foreground/50">
                      <HighVolumePriceCell price={price} unit="credits" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">{note}</TooltipContent>
                </Tooltip>
              ) : (
                <HighVolumePriceCell price={price} unit="credits" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
