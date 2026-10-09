import Link from "next/link";
import { Cell, Cells, SectionHead } from "@/components/grid";
import { cn } from "@/lib/utils";
import type { DifferenceCard } from "@/lib/compare/types";

export function DifferenceCards({
  heading,
  cards,
}: {
  heading: string;
  cards: DifferenceCard[];
}) {
  return (
    <>
      <SectionHead title={heading} />
      <Cells
        className={cn(
          "border-t border-[var(--rule)] sm:grid-cols-2",
          // 3 or 6 cards fill a 3-column row; 2 or 4 read better as a 2x2.
          cards.length % 3 === 0 && "lg:grid-cols-3",
        )}
      >
        {cards.map((card) => (
          <Cell key={card.title} className="flex flex-col px-6 py-10 sm:px-10 lg:px-12">
            <h3 className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
              {card.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {card.body}
            </p>
            {card.link && (
              // mt-auto pins every cell's link to the same baseline across the row.
              <p className="mt-auto pt-4">
                <Link
                  href={card.link.href}
                  className="text-[15px] font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                >
                  {card.link.label}
                </Link>
              </p>
            )}
          </Cell>
        ))}
      </Cells>
    </>
  );
}
