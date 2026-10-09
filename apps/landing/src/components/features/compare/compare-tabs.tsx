"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CompareGroup } from "@/lib/compare/types";
import { CompareTable } from "./compare-table";

/**
 * Text tabs over the comparison groups, set in a ruled strip like the folder
 * tabs on the homepage. Every panel stays in the DOM (inactive ones carry the
 * `hidden` attribute) so crawlers and answer engines read the full comparison
 * regardless of the selected tab.
 */
export function CompareTabs({
  competitor,
  groups,
  footnote,
}: {
  competitor: string;
  groups: CompareGroup[];
  footnote?: string;
}) {
  const [active, setActive] = useState(0);
  const showTabs = groups.length > 1;

  return (
    <div>
      {showTabs && (
        <div
          role="tablist"
          aria-label="Comparison categories"
          className="flex flex-wrap gap-x-7 border-t border-[var(--rule)] px-6 sm:px-10 lg:px-12"
        >
          {groups.map((group, i) => (
            <button
              key={group.label}
              type="button"
              role="tab"
              id={`compare-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`compare-panel-${i}`}
              onClick={() => setActive(i)}
              className={cn(
                "-mb-px border-b-2 py-4 text-[15px] font-medium transition-colors",
                i === active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {group.label}
            </button>
          ))}
        </div>
      )}
      {groups.map((group, i) => (
        <div
          key={group.label}
          role="tabpanel"
          id={`compare-panel-${i}`}
          aria-labelledby={showTabs ? `compare-tab-${i}` : undefined}
          hidden={showTabs && i !== active}
        >
          <CompareTable competitor={competitor} rows={group.rows} />
        </div>
      ))}
      {footnote && (
        <p className="border-t border-[var(--rule)] px-6 py-5 text-[13.5px] leading-relaxed text-muted-foreground sm:px-10 lg:px-12">
          {footnote}
        </p>
      )}
    </div>
  );
}
