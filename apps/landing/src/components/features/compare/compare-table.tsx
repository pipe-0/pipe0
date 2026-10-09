import { Check, Minus, X } from "lucide-react";
import type { CompareCell, CompareRow } from "@/lib/compare/types";

function CellView({ cell }: { cell: CompareCell }) {
  if (cell.v === "text") {
    return <span className="text-muted-foreground">{cell.text}</span>;
  }
  const Icon = cell.v === "yes" ? Check : cell.v === "no" ? X : Minus;
  const label = cell.v === "yes" ? "Yes" : cell.v === "no" ? "No" : "Partial";
  return (
    <span className="flex items-start gap-2">
      <Icon
        className={
          cell.v === "yes"
            ? "mt-0.5 size-4 shrink-0 text-primary"
            : "mt-0.5 size-4 shrink-0 text-muted-foreground/60"
        }
        aria-hidden
      />
      <span className="sr-only">{label}.</span>
      {cell.note && <span className="text-muted-foreground">{cell.note}</span>}
    </span>
  );
}

/** Rail-to-rail table; the pipe0 column carries the muted tint. */
export function CompareTable({
  competitor,
  rows,
}: {
  competitor: string;
  rows: CompareRow[];
}) {
  return (
    // Horizontal scroll lives inside the band so the page never scrolls sideways.
    <div className="overflow-x-auto border-t border-[var(--rule)]">
      <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
        <thead>
          <tr className="border-b border-[var(--rule)]">
            <th scope="col" className="w-[34%] px-6 py-4 sm:pl-10 lg:pl-12" />
            <th
              scope="col"
              className="border-l border-[var(--rule)] bg-[var(--well)] px-6 py-4 font-medium text-foreground"
            >
              pipe0
            </th>
            <th
              scope="col"
              className="border-l border-[var(--rule)] px-6 py-4 font-medium text-foreground sm:pr-10 lg:pr-12"
            >
              {competitor}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.feature}
              className="border-b border-[var(--rule)] last:border-b-0"
            >
              <th
                scope="row"
                className="px-6 py-4 text-left font-medium text-foreground sm:pl-10 lg:pl-12"
              >
                {row.feature}
              </th>
              <td className="border-l border-[var(--rule)] bg-[var(--well)] px-6 py-4">
                <CellView cell={row.pipe0} />
              </td>
              <td className="border-l border-[var(--rule)] px-6 py-4 sm:pr-10 lg:pr-12">
                <CellView cell={row.competitor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
