import { Link } from "@tanstack/react-router";
import { barSkin, breakFrame, card, radius, type } from "@/components/grid";
import { rows as products } from "@/components/landing/landing-economics";
import { bars as coverage } from "@/components/landing/landing-proof";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

/**
 * Proof — what comes back, and what it costs, side by side.
 *
 * The page changes subject here, from what pipe0 is to how good it is, so
 * the section is a break from the grid: two white cards on the muted
 * ground. One answers "how much of my list do you find", the other "what
 * does a result cost".
 *
 * The two cards are one design used twice: a title, one line of context,
 * bars, one line with a link. Every bar in both is the same height on the
 * same columns, so the pair reads as a set. The cost card shows one result
 * at a time, picked by the switch in its head; its title names the result,
 * so the chart needs no label of its own.
 *
 * Two colours: indigo for pipe0, grey for whatever it is compared against.
 * The switch's chosen side is indigo too, because on this site indigo also
 * means "you can press this".
 *
 * The numbers are not kept here. They come from the two components that
 * carry these charts at full size on the other pages (landing-proof,
 * landing-economics), which also document their sources, so a figure can
 * only be changed in one place. Cost is pipe0's high-volume price, the one
 * most teams end up on, and the line under the title says so. /pricing
 * shows both.
 *
 * Static bars, no draw-in: a number that animates into place reads as a
 * show, a number that is simply there reads as a measurement.
 */

/** Track length as a multiple of the top of the typical range. */
const HEADROOM = 1.15;

/** What the switch calls each result; the card's title has the full name. */
const SHORT: Record<string, string> = {
  "Mobile number": "Mobile",
  "Work email": "Email",
};

const link =
  "font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary";

export function LandingValue() {
  const [shown, setShown] = useState(0);

  return (
    <div className={cn(breakFrame, "pb-14 sm:pb-20")}>
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* ---- Coverage ---- */}
        <figure className={cn(card, "flex flex-col p-7 sm:p-9")}>
          <figcaption>
            <div className={titleRow}>
              <h3 className={type.heading}>Mobile numbers found</h3>
            </div>
            <p className={note}>
              The same 150 LinkedIn profiles through each route, August 2026.
            </p>
          </figcaption>
          <dl className={chart}>
            {coverage.map((bar) => (
              <Row
                key={bar.label}
                label={bar.label}
                value={`${bar.value}%`}
                ours={bar.ours}
              >
                {/* The track runs to 100%, so every bar reads against the
                    whole list, not against the longest bar. */}
                <Fill
                  width={`${bar.value}%`}
                  skin={bar.ours ? barSkin.win : barSkin.lose}
                />
              </Row>
            ))}
          </dl>
          <Foot>
            A traditional waterfall asks the cheapest provider first.{" "}
            <Link
              to="/blog/$slug"
              params={{ slug: "cheapest-first-waterfall" }}
              className={link}
            >
              Method and data
            </Link>
          </Foot>
        </figure>

        {/* ---- Cost ---- */}
        <figure className={cn(card, "flex flex-col p-7 sm:p-9")}>
          <figcaption>
            <div className={titleRow}>
              <h3 className={type.heading}>
                Cost per {products[shown].label.toLowerCase()}
              </h3>
              <div
                role="tablist"
                aria-label="Result"
                className={cn(
                  "inline-flex shrink-0 gap-0.5 border border-[var(--rule)] bg-[var(--well)] p-0.5",
                  radius.control,
                )}
              >
                {products.map((product, i) => {
                  const on = i === shown;
                  return (
                    <button
                      key={product.label}
                      type="button"
                      role="tab"
                      id={`cost-tab-${i}`}
                      aria-selected={on}
                      aria-controls={`cost-panel-${i}`}
                      onClick={() => setShown(i)}
                      className={cn(
                        "h-7 rounded-[6px] border px-3 text-[14px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                        on
                          ? "btn-glossy text-white"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {SHORT[product.label] ?? product.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className={note}>
              Average per result with high-volume pricing, against typical
              waterfalls.
            </p>
          </figcaption>
          {/* Both results stay in the page; the one not chosen is hidden. */}
          {products.map((product, i) => {
            const at = (cents: number) =>
              `${(cents / (product.high * HEADROOM)) * 100}%`;
            return (
              <div
                key={product.label}
                role="tabpanel"
                id={`cost-panel-${i}`}
                aria-labelledby={`cost-tab-${i}`}
                hidden={i !== shown}
              >
                <dl className={chart}>
                  <Row
                    label="pipe0 waterfall"
                    value={`${product.ours.volume}¢`}
                    ours
                  >
                    <Fill
                      width={at(product.ours.volume)}
                      skin={barSkin.win}
                    />
                  </Row>
                  <Row label="Typical waterfall" value={product.range}>
                    {/* A range: pale to its top, solid to where it starts. */}
                    <Fill width={at(product.high)} skin={barSkin.range} />
                    <Fill width={at(product.low)} skin={barSkin.lose} />
                  </Row>
                </dl>
              </div>
            );
          })}
          <Foot>
            Misses cost nothing.{" "}
            <Link to="/pricing" className={link}>
              See pricing
            </Link>
          </Foot>
        </figure>
      </div>
    </div>
  );
}

/* A card's title row is as tall as the switch in the cost card, in both
   cards, so the two titles stand on one line. */
const titleRow =
  "flex min-h-[34px] flex-wrap items-center justify-between gap-x-4 gap-y-3";
const note = cn("mt-1.5", type.small);
const chart = "mt-8 space-y-4 sm:space-y-6";

/** One bar: what it is, the bar on a track, and its value. Used by both
 *  cards, which is what keeps their columns and bar heights identical. */
function Row({
  label,
  value,
  ours = false,
  children,
}: {
  label: string;
  value: string;
  ours?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[9.75rem_minmax(0,1fr)] sm:items-center sm:gap-4">
      <dt className={cn(type.small, ours && "font-medium text-foreground")}>
        {label}
      </dt>
      <dd className="flex items-center gap-3">
        <span
          className={cn(
            "relative h-9 flex-1 bg-[var(--well)] sm:h-11",
            radius.bar,
          )}
        >
          {children}
        </span>
        <span
          className={cn(
            "w-[4.75rem] whitespace-nowrap text-right text-[18px] font-medium leading-none tracking-[-0.03em]",
            ours ? "text-primary" : "text-[var(--mark-text)]",
          )}
        >
          {value}
        </span>
      </dd>
    </div>
  );
}

function Fill({
  width,
  skin,
}: {
  width: string;
  skin: (typeof barSkin)[keyof typeof barSkin];
}) {
  return (
    <span
      className={cn("absolute inset-y-0 left-0", radius.bar)}
      style={{ width, ...skin }}
    />
  );
}

/** The line at the foot of a card, on one baseline in both. */
function Foot({ children }: { children: ReactNode }) {
  return <p className={cn("mt-auto pt-8", type.small)}>{children}</p>;
}
