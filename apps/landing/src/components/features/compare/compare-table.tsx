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

export function CompareTable({
  competitor,
  rows,
}: {
  competitor: string;
  rows: CompareRow[];
}) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-border bg-card">
      {/* Horizontal scroll lives inside the panel so the page never scrolls sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="w-[34%] px-5 py-4 sm:px-6" />
              <th
                scope="col"
                className="border-l border-border bg-primary/[0.04] px-5 py-4 font-semibold text-foreground sm:px-6"
              >
                pipe0
              </th>
              <th
                scope="col"
                className="border-l border-border px-5 py-4 font-semibold text-foreground sm:px-6"
              >
                {competitor}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.feature}
                className="border-b border-border last:border-b-0"
              >
                <th
                  scope="row"
                  className="px-5 py-4 text-left font-medium text-foreground sm:px-6"
                >
                  {row.feature}
                </th>
                <td className="border-l border-border bg-primary/[0.04] px-5 py-4 sm:px-6">
                  <CellView cell={row.pipe0} />
                </td>
                <td className="border-l border-border px-5 py-4 sm:px-6">
                  <CellView cell={row.competitor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
