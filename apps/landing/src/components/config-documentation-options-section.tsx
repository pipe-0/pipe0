"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import { StoreOption } from "@pipe0/base";
import { Copy, Download, ExternalLink } from "lucide-react";

type OptionsDefSummary =
  | { kind: "csv"; file: string; url: string }
  | { kind: "provider" }
  | {
      kind: "static";
      count: number;
      options: { value: string; label?: string }[];
    };

export function OptionsSection({
  options: o,
  suggestions,
  optionsDef,
}: {
  options?: StoreOption[];
  suggestions?: StoreOption[];
  optionsDef?: OptionsDefSummary;
}) {
  const inlineOptions = o ?? null;
  const hasInline = !!(inlineOptions || suggestions);

  if (!hasInline && !optionsDef) return null;

  const handleCopyOptions = () => {
    if (inlineOptions) {
      copyToClipboard(JSON.stringify(inlineOptions, null, 2));
    } else if (suggestions) {
      copyToClipboard(JSON.stringify(suggestions, null, 2));
    }
  };

  const heading = suggestions
    ? "Suggestions"
    : optionsDef?.kind === "csv"
      ? "Valid values"
      : optionsDef?.kind === "provider"
        ? "Valid values"
        : "Available options";

  return (
    <div>
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">{heading}</h4>
        {hasInline && (
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={handleCopyOptions}
            aria-label="Copy options"
          >
            <Copy className="size-4" />
          </Button>
        )}
      </div>

      {optionsDef?.kind === "csv" && (
        <div className="mt-2 flex items-center gap-3 text-xs">
          <code className="px-1.5 py-0.5 rounded font-mono bg-muted">
            {optionsDef.file}
          </code>
          <a
            href={optionsDef.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            Open
            <ExternalLink className="size-3" />
          </a>
          <a
            href={optionsDef.url}
            download={optionsDef.file}
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            Download
            <Download className="size-3" />
          </a>
        </div>
      )}

      {optionsDef?.kind === "provider" && (
        <p className="mt-2 text-xs text-muted-foreground">
          Resolved at runtime by the provider&apos;s autocomplete.
        </p>
      )}

      {suggestions && Array.isArray(suggestions) ? (
        <div className="mt-2 max-h-32 overflow-y-auto border rounded-lg p-3">
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((suggestion, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs font-normal"
              >
                {suggestion.label}
              </Badge>
            ))}
          </div>
        </div>
      ) : inlineOptions && Array.isArray(inlineOptions) ? (
        <div className="mt-2 max-h-32 overflow-y-auto border rounded-lg">
          <div className="divide-y">
            {inlineOptions.map((option, idx) => (
              <div
                key={idx}
                className="px-3 py-2 flex items-center justify-between"
              >
                <code className="text-xs px-1.5 py-0.5 rounded font-mono">
                  {option.value}
                </code>
                <span className="text-sm text-muted-foreground">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
