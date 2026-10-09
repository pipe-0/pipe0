import { Cell, Cells, SectionHead } from "@/components/grid";
import type { CompareConfig } from "@/lib/compare/types";

/** The honest verdict: where the competitor wins, then who should pick what. */
export function TheirEdgePanel({
  competitor,
  intro,
  points,
  pickThem,
  pickUs,
}: { competitor: string } & CompareConfig["theirEdge"]) {
  return (
    <>
      <SectionHead title={`Where ${competitor} is ahead.`} lede={intro} />
      <ul className="border-t border-[var(--rule)]">
        {points.map((point) => (
          <li
            key={point}
            className="border-b border-[var(--rule)] px-6 py-4 text-[15.5px] text-foreground last:border-b-0 sm:px-10 lg:px-12"
          >
            {point}
          </li>
        ))}
      </ul>
      <Cells className="border-t border-[var(--rule)] sm:grid-cols-2">
        <Cell className="px-6 py-10 sm:px-10 lg:px-12">
          <p className="text-[17px] font-medium text-foreground">
            Pick {competitor} if
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {pickThem}
          </p>
        </Cell>
        <Cell className="bg-[var(--well)] px-6 py-10 sm:px-10 lg:px-12">
          <p className="text-[17px] font-medium text-foreground">Pick pipe0 if</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {pickUs}
          </p>
        </Cell>
      </Cells>
    </>
  );
}
