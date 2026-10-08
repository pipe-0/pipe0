import { cn } from "@/lib/utils";

type Entry = {
  provider: string;
  tier?: "Low-cost" | "Premium";
  seconds: number;
};

/** One decimal, or two below 0.1 s so a fast provider doesn't round up. */
function formatSeconds(seconds: number) {
  return `${seconds < 0.1 ? seconds.toFixed(2) : seconds.toFixed(1)} s`;
}

/** "21x", or "1.5x" below 2 where a whole number would overstate it. */
function formatRatio(ratio: number) {
  return ratio >= 2 ? `${Math.round(ratio)}x` : `${ratio.toFixed(1)}x`;
}

/**
 * Median response time as horizontal bars from a zero baseline, the
 * reviewed tool in the brand color and the comparison providers in a
 * neutral. Values are printed at each bar end, so the chart never relies
 * on color or on reading the axis.
 */
export function LatencyBars({
  tool,
  test,
  seconds,
  others,
}: {
  tool: string;
  test: string;
  seconds: number;
  others: Entry[];
}) {
  const rows: (Entry & { self: boolean })[] = [
    { provider: tool, seconds, self: true },
    ...others.map((o) => ({ ...o, self: false })),
  ].sort((a, b) => a.seconds - b.seconds);
  const max = Math.max(...rows.map((r) => r.seconds));
  // The summary is about the reviewed tool: how much faster it is than the
  // slowest provider behind it. No sentence when it is the slowest.
  const slower = others
    .filter((o) => o.seconds > seconds)
    .sort((a, b) => b.seconds - a.seconds)[0];

  return (
    <figure className="mt-8">
      <figcaption>
        <p className="font-blog text-[17px] font-semibold text-fd-foreground">
          How fast {tool} answers
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-fd-muted-foreground">
          {test}. Median response time per lookup, lower is faster.
        </p>
      </figcaption>

      <div className="mt-5 space-y-3.5 rounded-xl p-4 ring-1 ring-fd-border sm:p-5">
        {rows.map((row) => (
          <div
            key={row.provider}
            title={`${row.provider}: ${formatSeconds(row.seconds)} median`}
            className="grid grid-cols-[minmax(0,7.5rem)_1fr] items-center gap-3 sm:grid-cols-[10rem_1fr]"
          >
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate text-[14px]",
                  row.self
                    ? "font-semibold text-fd-foreground"
                    : "text-fd-foreground",
                )}
              >
                {row.provider}
              </p>
              {row.tier && (
                <p className="text-[12.5px] text-fd-muted-foreground">
                  {row.tier}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-3 min-w-0 flex-1">
                <div
                  className={cn(
                    "h-full rounded-r-[4px]",
                    row.self ? "bg-fd-primary" : "bg-fd-foreground/20",
                  )}
                  style={{ width: `${Math.max((row.seconds / max) * 100, 1.5)}%` }}
                />
              </div>
              <span
                className={cn(
                  "w-12 shrink-0 text-right text-[13.5px] tabular-nums",
                  row.self
                    ? "font-semibold text-fd-foreground"
                    : "text-fd-muted-foreground",
                )}
              >
                {formatSeconds(row.seconds)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {slower && (
        <p className="mt-3 text-[13.5px] leading-snug text-fd-muted-foreground">
          {tool} answered in {formatSeconds(seconds)}, {formatRatio(slower.seconds / seconds)}{" "}
          faster than {slower.provider} on this test.
        </p>
      )}
    </figure>
  );
}
