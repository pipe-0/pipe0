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
  tag,
  value,
  strong,
  total,
  filled,
  slots,
  skin,
}: {
  label: string;
  /** A short muted qualifier after the label, e.g. a provider's price tier. */
  tag?: string;
  value: string;
  strong?: boolean;
  /** Segments in the bar. */
  total: number;
  /** Segments filled from the left. */
  filled: number;
  /**
   * Segments the full width holds, when rows of one chart have different
   * totals: every row then uses the same segment size and a shorter row
   * ends early. Defaults to `total`.
   */
  slots?: number;
  skin: "win" | "lose";
}) {
  const width = slots ?? total;
  return (
    <div
      title={`${label}: ${value}`}
      className="grid gap-y-1.5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:items-center sm:gap-x-6"
    >
      <div className="truncate text-[15px] text-fd-foreground">
        <span className={cn(strong && "font-medium")}>{label}</span>{" "}
        <span className="text-fd-muted-foreground">({value})</span>
        {tag && (
          <span className="ml-2 text-[12.5px] text-fd-muted-foreground">
            {tag}
          </span>
        )}
      </div>
      <div aria-hidden className={cn("flex h-5", width > 60 ? "gap-px" : "gap-[2px]")}>
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
        {width > total && (
          <span className="min-w-0" style={{ flexGrow: width - total }} />
        )}
      </div>
    </div>
  );
}
