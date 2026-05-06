import type { RecordField } from "@pipe0/base";

export function CellValue({ field }: { field: RecordField | undefined }) {
  if (!field) {
    return <span className="text-zinc-300">—</span>;
  }
  switch (field.status) {
    case "completed":
      return <span className="text-zinc-900">{formatValue(field.value)}</span>;
    case "queued":
      return <span className="animate-pulse text-zinc-400">queued…</span>;
    case "processing":
      return <span className="animate-pulse text-zinc-500">processing…</span>;
    case "failed":
      return (
        <span className="text-red-600" title={field.reason?.message ?? "failed"}>
          failed
        </span>
      );
    case "no_result":
      return <span className="text-zinc-400">no result</span>;
    case "skipped":
      return <span className="text-zinc-400">skipped</span>;
    default:
      return "";
  }
}

function formatValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return JSON.stringify(value);
}
