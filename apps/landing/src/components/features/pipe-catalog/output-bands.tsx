import { BandCard } from "@/components/features/pipe-catalog/band-card";
import { FieldRow } from "@/components/features/pipe-catalog/field-row";
import type { FieldRowData } from "@/lib/catalog-entry.server";

/** A catalog entry's output fields: on by default, then opt-in. */
export function OutputBands({
  enabled,
  optional,
  kind,
}: {
  enabled: FieldRowData[];
  optional: FieldRowData[];
  kind: "pipe" | "search";
}) {
  return (
    <div className="space-y-2">
      {enabled.length > 0 && (
        <BandCard
          label="Enabled by default"
          description="These fields are returned without extra config."
          count={enabled.length}
          tone="enabled"
        >
          {enabled.map((field) => (
            <FieldRow key={field.name} field={field} />
          ))}
        </BandCard>
      )}
      {optional.length > 0 && (
        <BandCard
          label="Enable on demand"
          description={`Opt in to these fields via the ${kind} config.`}
          count={optional.length}
          tone="optional"
        >
          {optional.map((field) => (
            <FieldRow key={field.name} field={field} />
          ))}
        </BandCard>
      )}
    </div>
  );
}
