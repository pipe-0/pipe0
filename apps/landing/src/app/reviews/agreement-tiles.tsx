import { cn } from "@/lib/utils";

type Pair = {
  provider: string;
  tier: "Low-cost" | "Premium";
  compared: number;
  agreed: number;
};

/**
 * Head-to-head agreement as unit tiles: one square per person both
 * providers answered for, filled when they returned the same value. The
 * count sits above each grid and a sentence below it, so the chart reads
 * without color and survives being quoted as text.
 */
export function AgreementTiles({
  tool,
  test,
  unit,
  pairs,
}: {
  tool: string;
  test: string;
  unit: string;
  pairs: Pair[];
}) {
  return (
    <figure className="mt-8">
      <figcaption>
        <p className="font-blog text-[17px] font-semibold text-fd-foreground">
          How often {tool} agrees with other providers
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-fd-muted-foreground">
          {test}. Each square is one person both providers returned a {unit}{" "}
          for.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-fd-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Tile agreed />
            Same {unit}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Tile agreed={false} />
            Different {unit}
          </span>
        </div>
      </figcaption>

      <div
        className={cn(
          "mt-5 grid grid-cols-1 gap-4",
          pairs.length > 1 && "sm:grid-cols-2",
          pairs.length > 2 && "lg:grid-cols-3",
        )}
      >
        {pairs.map((pair) => {
          const rate = Math.round((pair.agreed / pair.compared) * 100);
          const sentence = `${tool} and ${pair.provider} returned the same ${unit} for ${pair.agreed} of ${pair.compared} people.`;
          return (
            <div
              key={pair.provider}
              className="rounded-xl p-4 ring-1 ring-fd-border"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] text-fd-muted-foreground">
                    {pair.tier} provider
                  </p>
                  <p className="font-blog truncate text-[16px] font-semibold text-fd-foreground">
                    vs {pair.provider}
                  </p>
                </div>
                <p className="text-right">
                  <span className="font-blog text-[26px] font-bold leading-none tabular-nums text-fd-foreground">
                    {rate}%
                  </span>
                  <span className="mt-1 block text-[12.5px] tabular-nums text-fd-muted-foreground">
                    {pair.agreed} of {pair.compared}
                  </span>
                </p>
              </div>

              {/* Agreed tiles first, so the filled share reads as a block. */}
              <div aria-hidden className="mt-4 flex flex-wrap gap-[3px]">
                {Array.from({ length: pair.compared }, (_, i) => {
                  const agreed = i < pair.agreed;
                  return (
                    <span
                      key={i}
                      title={`Person ${i + 1} of ${pair.compared}: ${agreed ? "same" : "different"} ${unit}`}
                      className="transition-transform hover:scale-125"
                    >
                      <Tile agreed={agreed} />
                    </span>
                  );
                })}
              </div>

              <p className="mt-4 text-[13.5px] leading-snug text-fd-muted-foreground">
                {sentence}
              </p>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

function Tile({ agreed }: { agreed: boolean }) {
  return (
    <span
      className={cn(
        "block size-[11px] rounded-[2px]",
        agreed
          ? "bg-fd-primary"
          : "bg-fd-foreground/[0.06] ring-1 ring-inset ring-fd-foreground/30",
      )}
    />
  );
}
