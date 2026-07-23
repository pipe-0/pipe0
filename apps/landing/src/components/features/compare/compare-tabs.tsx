"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CompareGroup } from "@/lib/compare/types";
import { CompareTable } from "./compare-table";

/**
 * Segmented pill tabs over the comparison groups. Every panel stays in the
 * DOM (inactive ones carry the `hidden` attribute) so crawlers and answer
 * engines read the full comparison regardless of the selected tab.
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
          className="mb-6 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-card p-1"
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
                "rounded-full border border-transparent px-4 py-1.5 text-sm font-medium transition-colors",
                i === active
                  ? "btn-glossy btn-glossy-indigo border text-white"
                  : "text-muted-foreground hover:text-foreground",
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
        <p className="mt-3 text-xs text-muted-foreground">{footnote}</p>
      )}
    </div>
  );
}
