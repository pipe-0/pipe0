"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { ScorePill, ToolLogo } from "./review-parts";

export type ReviewCard = {
  url: string;
  name: string;
  logo?: string;
  category: string;
  score: number;
  verdict: string;
  price: string;
  freePlan: boolean;
  updated: string;
  draft: boolean;
};

/**
 * Category chips over a dense card grid. Filtering is client-side: every
 * card stays in the server HTML, so crawlers see the full list.
 */
export function ReviewsGrid({ cards }: { cards: ReviewCard[] }) {
  const [active, setActive] = useState<string | null>(null);
  const categories = [...new Set(cards.map((c) => c.category))].sort();
  const shown = active ? cards.filter((c) => c.category === active) : cards;

  const chips = [
    { key: null, label: "All", count: cards.length },
    ...categories.map((category) => ({
      key: category,
      label: category,
      count: cards.filter((c) => c.category === category).length,
    })),
  ];

  return (
    <>
      <nav aria-label="Review categories" className="mt-8 flex flex-wrap gap-2">
        {chips.map((chip) => {
          const on = chip.key === active;
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => setActive(chip.key)}
              aria-pressed={on}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] transition-colors",
                on
                  ? "bg-fd-primary font-medium text-fd-primary-foreground"
                  : "text-fd-muted-foreground ring-1 ring-fd-border hover:bg-fd-accent hover:text-fd-foreground",
              )}
            >
              {chip.label}
              <span className={on ? "opacity-80" : "opacity-60"}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </nav>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((card) => (
          <li key={card.url}>
            <Link
              href={card.url}
              className="group flex h-full flex-col rounded-xl bg-fd-card p-4 ring-1 ring-fd-border transition-colors hover:bg-fd-accent/60 hover:ring-fd-foreground/20"
            >
              <div className="flex items-start gap-3">
                <ToolLogo name={card.name} logo={card.logo} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="font-blog truncate text-[16px] font-semibold leading-tight text-fd-foreground group-hover:text-fd-primary">
                    {card.name}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-fd-muted-foreground">
                    {card.category}
                  </p>
                </div>
                <ScorePill score={card.score} />
              </div>
              <p className="mt-3 line-clamp-3 text-[13.5px] leading-snug text-fd-muted-foreground">
                {card.verdict}
              </p>
              <p className="mt-auto flex flex-wrap items-center gap-x-2 pt-3 text-[13px] text-fd-muted-foreground">
                <span className="font-medium text-fd-foreground">
                  From {card.price}
                </span>
                {card.freePlan && <span>· Free plan</span>}
                <span className="ml-auto">
                  {card.draft ? "Draft" : card.updated}
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
