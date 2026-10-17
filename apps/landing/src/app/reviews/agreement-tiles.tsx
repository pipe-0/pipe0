import { TileRow } from "./tile-bar";

type Pair = {
  provider: string;
  tier?: "Low-cost" | "Premium";
  compared: number;
  agreed: number;
};

/**
 * Head-to-head agreement as unit tiles: a statement with the range, then
 * one row per named provider (tile-bar), one segment for every person both
 * providers answered for, filled when they returned the same value. Agreed segments come first so the share reads as a block, and
 * one sentence of conclusion closes it. The .md twin spells every pair out as a sentence.
 */
export function AgreementTiles({
  tool,
  test,
  unit,
  subject = "people",
  pairs,
  conclusion,
}: {
  tool: string;
  test: string;
  unit: string;
  /** What a tile stands for: a person looked up, or an address checked. */
  subject?: "people" | "addresses";
  pairs: Pair[];
  /** Our accuracy verdict, one sentence under the tiles. */
  conclusion?: string;
}) {
  const rates = pairs.map((p) => Math.round((p.agreed / p.compared) * 100));
  const [lo, hi] = [Math.min(...rates), Math.max(...rates)];
  const range = lo === hi ? `${lo}%` : `${lo} to ${hi}%`;
  // One tile per person in every row, so a pair with fewer comparisons draws a shorter row.
  const slots = Math.max(...pairs.map((p) => p.compared));
  return (
    <figure className="mt-14">
      <figcaption>
        <p className="font-blog text-[17px] font-semibold leading-snug text-fd-foreground text-balance">
          {tool} returned the same {unit} as other providers {range} of the time
        </p>
      </figcaption>

      <div className="mt-6 space-y-4">
        {pairs.map((pair, i) => (
          <TileRow
            key={pair.provider}
            label={pair.provider}
            value={`${rates[i]}%`}
            total={pair.compared}
            filled={pair.agreed}
            slots={slots}
            skin="win"
          />
        ))}
      </div>
      {conclusion && (
        <p className="mt-6 text-[15.5px] leading-[1.65] text-fd-foreground">{conclusion}</p>
      )}
    </figure>
  );
}
