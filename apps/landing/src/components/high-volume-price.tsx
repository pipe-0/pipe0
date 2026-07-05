"use client";

import { TextLink } from "@/components/text-link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { hasHighVolume, lowestManagedCredit } from "@/lib/pricing/high-volume";
import { formatCredits } from "@/lib/utils";
import { listTiers, type ManagedCredits } from "@pipe0/base";
import { docsLinkPaths } from "@pipe0/doc-links";
import { Info } from "lucide-react";

/**
 * Cost cell for the pipe/search catalog detail tables. Keeps the standard
 * price as the headline and, when the operation is high-volume eligible, adds a
 * muted "high volume from X" line with a popover breaking down every tier.
 * Alignment is inherited from the parent cell (right-aligned for pipes,
 * left-aligned for searches).
 */
export function HighVolumePriceCell({
  credits,
  unit = "credits",
}: {
  credits: ManagedCredits | null;
  unit?: string;
}) {
  if (credits === null) {
    return <span className="text-muted-foreground">n/a</span>;
  }

  if (!hasHighVolume(credits)) {
    return (
      <div>
        {formatCredits(credits.default) || "Free"}
        <span className="text-muted-foreground ml-1">{unit}</span>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground line-through">
        {formatCredits(credits.default)} {unit}
      </div>
      <div className="inline-flex items-center gap-1">
        <span>
          {formatCredits(lowestManagedCredit(credits))}
          <span className="text-muted-foreground ml-1">{unit}</span>
        </span>
        <HighVolumePricePopover credits={credits} unit={unit} />
      </div>
    </div>
  );
}

/**
 * Info trigger + popover with the full high-volume tier breakdown. Renders
 * nothing when the operation declares no tiers.
 */
export function HighVolumePricePopover({
  credits,
  unit = "credits",
}: {
  credits: ManagedCredits;
  unit?: string;
}) {
  const tiers = listTiers(credits);
  if (tiers.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="High volume pricing details"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0 text-sm">
        <div className="border-b p-3">
          <p className="font-medium">High volume pricing</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Enroll an eligible plan into a discounted per-operation tier. Deeper
            tiers cost more high-volume slots.
          </p>
        </div>
        <div className="divide-y">
          <TierRow label="Default" price={credits.default} unit={unit} muted />
          {tiers.map((tier) => (
            <TierRow
              key={tier.level}
              label={`Level ${tier.level}`}
              price={tier.credits}
              unit={unit}
              slots={tier.weight}
            />
          ))}
        </div>
        <div className="border-t p-3">
          <TextLink href={docsLinkPaths.highUsageBilling} className="text-xs">
            Learn more
          </TextLink>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TierRow({
  label,
  price,
  unit,
  slots,
  muted,
}: {
  label: string;
  price: number;
  unit: string;
  slots?: number;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-3 py-1.5">
      <span className={muted ? "text-muted-foreground" : "font-medium"}>
        {label}
      </span>
      <span className="flex items-baseline gap-2 tabular-nums">
        <span>
          {formatCredits(price)}{" "}
          <span className="text-muted-foreground">{unit}</span>
        </span>
        <span className="w-14 text-right text-xs text-muted-foreground">
          {slots ? `${slots} slot${slots === 1 ? "" : "s"}` : "—"}
        </span>
      </span>
    </div>
  );
}
