import { barSkin } from "@/components/grid";
import Link from "next/link";

/**
 * Proof — one benchmark, as three bars.
 *
 * Mobile numbers found from 150 LinkedIn profiles (evidence.md, run
 * 20260804T202803Z-237d): pipe0 waterfall 94%, cheapest-first routing over
 * the four Treg phone providers we could benchmark 72%, the two cheap
 * providers alone 36%. Keep the footnote: the method is what makes the
 * number believable.
 *
 * Static bars, no draw-in. A number that animates into place reads as a
 * show; a number that is simply there reads as a measurement.
 */

const bars: { label: string; value: number; ours?: boolean; worst?: boolean }[] = [
  { label: "pipe0 waterfall", value: 94, ours: true },
  { label: "Traditional waterfall", value: 72 },
  { label: "Two cheap providers", value: 36, worst: true },
];

export function LandingProof() {
  return (
    <>
      <figure className="border-t border-[var(--rule)] px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <figcaption className="sr-only">
          Mobile numbers found from 150 LinkedIn profiles: pipe0 waterfall
          94%, traditional waterfall 72%, two cheap providers 36%.
        </figcaption>
        {/* What the bars measure, once, so the numbers need no unit. */}
        <p className="mb-8 text-[14px] text-muted-foreground sm:mb-10">
          Share of 150 profiles with a mobile number found
        </p>
        <div className="space-y-7 sm:space-y-10">
          {bars.map((bar) => (
            <div
              key={bar.label}
              className="grid gap-2.5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-center lg:gap-10"
            >
              <span
                className={
                  bar.ours
                    ? "text-[16px] font-medium text-foreground sm:text-[17px]"
                    : "text-[16px] text-muted-foreground sm:text-[17px]"
                }
              >
                {bar.label}
              </span>
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative h-10 flex-1 sm:h-14">
                  {/* The track runs to 100%, so every bar reads against the
                      whole list, not against the longest bar. */}
                  <div className="absolute inset-0 rounded-[3px] border border-[var(--rule)] bg-[var(--well)]" />
                  <div
                    className="absolute inset-y-0 left-0 rounded-[3px]"
                    style={{
                      width: `${bar.value}%`,
                      ...(bar.ours
                        ? barSkin.win
                        : bar.worst
                          ? barSkin.worst
                          : barSkin.lose),
                    }}
                  />
                </div>
                <span
                  className={
                    bar.ours
                      ? "w-[3.2ch] text-right text-[clamp(22px,2.2vw,30px)] font-medium leading-none tracking-[-0.045em] text-primary"
                      : "w-[3.2ch] text-right text-[clamp(22px,2.2vw,30px)] font-medium leading-none tracking-[-0.045em] text-[var(--mark)]"
                  }
                >
                  {bar.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </figure>
      <p className="border-t border-[var(--rule)] px-6 py-5 text-[13.5px] leading-relaxed text-muted-foreground sm:px-10 lg:px-12">
        Mobile numbers found from 150 LinkedIn profiles, same rows for every
        route, August 2026. The traditional waterfall asks the cheapest
        provider first. pipe0 paid about 12¢ per number found. A
        traditional waterfall costs around 52¢ per result.{" "}
        <Link
          href="/blog/cheapest-first-waterfall"
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          Method and data
        </Link>
      </p>
    </>
  );
}
