import { TileRow } from "./tile-bar";

/** The slowest provider fills every segment; the rest are scaled to it. */
const SEGMENTS = 40;

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
 * Median response time as a statement and tile rows on one shared scale,
 * like the agreement chart: indigo for the reviewed tool, amber for the
 * providers it is compared with, each value in brackets by its name.
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
    <figure className="mt-14">
      <figcaption>
        <p className="font-blog text-[17px] font-semibold leading-snug text-fd-foreground text-balance">
          {slower
            ? `${tool} answered in ${formatSeconds(seconds)}, ${formatRatio(slower.seconds / seconds)} faster than ${slower.provider}`
            : `${tool} answered in ${formatSeconds(seconds)}`}
        </p>
      </figcaption>
      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <TileRow
            key={row.provider}
            label={row.provider}
            value={formatSeconds(row.seconds)}
            strong={row.self}
            total={SEGMENTS}
            filled={Math.max(1, Math.round((row.seconds / max) * SEGMENTS))}
            skin={row.self ? "win" : "lose"}
          />
        ))}
      </div>
    </figure>
  );
}

