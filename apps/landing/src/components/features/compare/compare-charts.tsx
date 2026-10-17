import { barSkin } from "@/components/grid";
import type { CompareChart } from "@/lib/compare/types";

/**
 * Benchmark results as small bar charts, two to a row, in the homepage proof's
 * bar language: static bars, pipe0 in the indigo "win" skin, the competitor in
 * amber, a clearly worse result in coral. Each chart makes one point; the
 * values print at the end of the bar so the chart needs no axis.
 */
export function CompareCharts({
  charts,
  footnote,
}: {
  charts: CompareChart[];
  footnote?: string;
}) {
  return (
    <>
      <div className="grid border-t border-[var(--rule)] md:grid-cols-2">
        {charts.map((chart, i) => (
          <figure
            key={chart.title}
            className={`px-6 py-10 sm:px-10 lg:px-12 ${i % 2 === 1 ? "md:border-l md:border-[var(--rule)]" : ""} ${i >= 2 ? "border-t border-[var(--rule)]" : ""} ${i === 1 ? "border-t border-[var(--rule)] md:border-t-0" : ""}`}
          >
            <figcaption className="text-[17px] font-medium tracking-[-0.02em] text-foreground">
              {chart.title}
            </figcaption>
            <div className="mt-6 space-y-4">
              {chart.bars.map((bar) => {
                const skin = bar.ours
                  ? barSkin.win
                  : bar.worst
                    ? barSkin.worst
                    : barSkin.lose;
                return (
                  <div
                    key={bar.label}
                    className="grid grid-cols-[8.5rem_minmax(0,1fr)_4.5ch] items-center gap-4"
                  >
                    <span
                      className={
                        bar.ours
                          ? "text-[14.5px] font-medium text-foreground"
                          : "text-[14.5px] text-muted-foreground"
                      }
                    >
                      {bar.label}
                    </span>
                    <div className="h-6 rounded-[3px] border border-[var(--rule)] bg-[var(--well)]">
                      <div
                        className="h-full rounded-[3px]"
                        style={{
                          width: `${Math.min(100, (bar.value / chart.max) * 100)}%`,
                          ...skin,
                        }}
                      />
                    </div>
                    <span
                      className={
                        bar.ours
                          ? "text-right text-[20px] font-medium leading-none tracking-[-0.04em] text-primary"
                          : "text-right text-[20px] font-medium leading-none tracking-[-0.04em] text-[var(--mark)]"
                      }
                    >
                      {bar.display ?? `${bar.value}%`}
                    </span>
                  </div>
                );
              })}
            </div>
            {chart.note && (
              <p className="mt-5 text-[13.5px] leading-relaxed text-muted-foreground">
                {chart.note}
              </p>
            )}
          </figure>
        ))}
      </div>
      {footnote && (
        <p className="border-t border-[var(--rule)] px-6 py-5 text-[13.5px] leading-relaxed text-muted-foreground sm:px-10 lg:px-12">
          {footnote}
        </p>
      )}
    </>
  );
}
