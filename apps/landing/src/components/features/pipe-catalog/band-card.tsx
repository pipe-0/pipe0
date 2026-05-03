import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type BandTone = "required" | "atLeastOne" | "enabled" | "optional" | "muted";

const TONE_COLORS: Record<BandTone, string> = {
  required: "#8B7DFF",
  atLeastOne: "#8B7DFF",
  enabled: "#10B981",
  optional: "#F97316",
  muted: "#94A3B8",
};

export function BandCard({
  label,
  description,
  count,
  tone = "muted",
  children,
}: {
  label: string;
  description: string;
  count: number;
  tone?: BandTone;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 border-b border-border">
        <span
          className="size-1.5 rounded-full shrink-0"
          style={{ backgroundColor: TONE_COLORS[tone] }}
          aria-hidden
        />
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={cn("text-xs text-muted-foreground flex-1 truncate")}>
          {description}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>
      <div className="px-3 py-2 space-y-1">{children}</div>
    </div>
  );
}
