import { barSkin } from "@/components/grid";
import { cn } from "@/lib/utils";

/**
 * A row of the review tile charts: the name with its value in brackets on
 * the left, then a segmented bar that always fits one line. Filled
 * segments wear the bars' glossy skins (indigo for the reviewed tool,
 * amber for what it is compared with); the rest are the empty well.
 */
export function TileRow({
  label,
  value,
  strong,
  total,
  filled,
  skin,
}: {
  label: string;
  value: string;
  strong?: boolean;
  /** Segments in the bar. */
  total: number;
  /** Segments filled from the left. */
  filled: number;
  skin: "win" | "lose";
}) {
  return (
    <div
      title={`${label}: ${value}`}
      className="grid gap-y-1.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-x-6"
    >
      <p className="truncate text-[15px] text-fd-foreground">
        <span className={cn(strong && "font-medium")}>{label}</span>{" "}
        <span className="text-fd-muted-foreground">({value})</span>
      </p>
      <div aria-hidden className={cn("flex h-5", total > 60 ? "gap-px" : "gap-[2px]")}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "min-w-0 flex-1 rounded-[2px]",
              i >= filled && "border border-[var(--rule)] bg-[var(--well)]",
            )}
            style={i < filled ? barSkin[skin] : undefined}
          />
        ))}
      </div>
    </div>
  );
}
