import Link from "next/link";
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
      <h2 className="max-w-2xl text-[clamp(22px,2.4vw,30px)] font-semibold tracking-[-0.02em] text-foreground">
        {heading}
      </h2>
      <div
        className={cn(
          "mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2",
          // 3 or 6 cards fill a 3-column row; 2 or 4 read better as a 2x2.
          cards.length % 3 === 0 && "lg:grid-cols-3",
        )}
      >
        {cards.map((card) => (
          <div key={card.title} className="flex h-full flex-col">
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-foreground">
              {card.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {card.body}
            </p>
            {card.link && (
              // mt-auto pins every card's link to the same baseline across the row.
              <p className="mt-auto pt-3">
                <Link
                  href={card.link.href}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  {card.link.label}
                </Link>
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
