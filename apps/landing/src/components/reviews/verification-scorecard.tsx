import { cn } from "@/lib/utils";

type Row = {
  provider: string;
  accuracy: number;
  validConfirmed: number;
  invalidCaught: number;
  falsePositives: number;
  falseNegatives: number;
  undetermined: number;
  latency?: string;
};

/**
 * Verifiers scored against known answers. One stacked bar per verifier
 * (right, undetermined, wrong, out of every address), then the exact
 * counts in a table, the reviewed tool first and in bold. Error segments
 * use a status color, so they always carry the "Wrong" legend label too.
 */
export function VerificationScorecard({
  tool,
  valid,
  invalid,
  rows,
}: {
  tool: string;
  valid: number;
  invalid: number;
  rows: Row[];
}) {
  const n = valid + invalid;
  const ordered = [
    ...rows.filter((r) => r.provider === tool),
    ...rows.filter((r) => r.provider !== tool),
  ];

  return (
    <figure className="mt-6">
      <figcaption className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-fd-muted-foreground">
        <Key className="bg-fd-primary" label="Right" />
        <Key className="bg-fd-foreground/15" label="Undetermined (catch-all, unknown)" />
        <Key className="bg-rose-500" label="Wrong" />
      </figcaption>

      <div className="mt-4 space-y-3 rounded-xl p-4 ring-1 ring-fd-border sm:p-5">
        {ordered.map((row) => {
          const right = row.validConfirmed + row.invalidCaught;
          const wrong = row.falsePositives + row.falseNegatives;
          const self = row.provider === tool;
          return (
            <div
              key={row.provider}
              className="grid grid-cols-[minmax(0,7rem)_1fr_3.5rem] items-center gap-3 sm:grid-cols-[9rem_1fr_4rem]"
            >
              <span
                className={cn(
                  "truncate text-[14px] text-fd-foreground",
                  self && "font-semibold",
                )}
              >
                {row.provider}
              </span>
              <div
                className="flex h-3.5 gap-[2px] overflow-hidden rounded-[4px]"
                title={`${row.provider}: ${right} right, ${row.undetermined} undetermined, ${wrong} wrong of ${n}`}
              >
                <span className="bg-fd-primary" style={{ width: `${(right / n) * 100}%` }} />
                {row.undetermined > 0 && (
                  <span
                    className="bg-fd-foreground/15"
                    style={{ width: `${(row.undetermined / n) * 100}%` }}
                  />
                )}
                {wrong > 0 && (
                  <span className="bg-rose-500" style={{ width: `${(wrong / n) * 100}%` }} />
                )}
              </div>
              <span
                className={cn(
                  "text-right text-[14px] tabular-nums",
                  self ? "font-semibold text-fd-foreground" : "text-fd-muted-foreground",
                )}
              >
                {Math.round(row.accuracy)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl ring-1 ring-fd-border">
        <table className="w-full min-w-[680px] text-left text-[14px]">
          <thead className="bg-fd-muted text-[13px] text-fd-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Verifier
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Accuracy
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Real confirmed
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Fakes caught
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Fakes passed
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Real rejected
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Undetermined
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Median time
              </th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((row) => (
              <tr
                key={row.provider}
                className={cn(
                  "border-t border-fd-border tabular-nums",
                  row.provider === tool && "bg-fd-primary/[0.04]",
                )}
              >
                <th
                  scope="row"
                  className={cn(
                    "px-4 py-3 text-fd-foreground",
                    row.provider === tool ? "font-semibold" : "font-medium",
                  )}
                >
                  {row.provider}
                </th>
                <td className="px-4 py-3 font-semibold text-fd-foreground">
                  {Math.round(row.accuracy)}%
                </td>
                <td className="px-4 py-3 text-fd-foreground">
                  {row.validConfirmed} of {valid}
                </td>
                <td className="px-4 py-3 text-fd-foreground">
                  {row.invalidCaught} of {invalid}
                </td>
                <td className="px-4 py-3 text-fd-muted-foreground">{row.falsePositives}</td>
                <td className="px-4 py-3 text-fd-muted-foreground">{row.falseNegatives}</td>
                <td className="px-4 py-3 text-fd-muted-foreground">{row.undetermined}</td>
                <td className="px-4 py-3 whitespace-nowrap text-fd-muted-foreground">
                  {row.latency ?? "–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function Key({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("block size-[11px] rounded-[2px]", className)} />
      {label}
    </span>
  );
}
