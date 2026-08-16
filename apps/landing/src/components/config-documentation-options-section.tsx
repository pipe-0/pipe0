"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import { StoreOption } from "@pipe0/base";
import { Copy } from "lucide-react";

/**
 * The values a field accepts, when they are short enough to read inline. Long
 * or provider-resolved vocabularies are not listed here — `AutocompleteRequest`
 * documents how to fetch those instead, so a field with nothing to inline
 * renders nothing rather than an empty heading.
 */
export function OptionsSection({
  options: o,
  suggestions,
}: {
  options?: StoreOption[];
  suggestions?: StoreOption[];
}) {
  const inlineOptions = o?.length ? o : null;
  const inlineSuggestions = suggestions?.length ? suggestions : null;

  if (!inlineOptions && !inlineSuggestions) return null;

  const handleCopyOptions = () => {
    copyToClipboard(
      JSON.stringify(inlineOptions ?? inlineSuggestions, null, 2),
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">
          {inlineSuggestions ? "Suggestions" : "Valid values"}
        </h4>
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={handleCopyOptions}
          aria-label="Copy options"
        >
          <Copy className="size-4" />
        </Button>
      </div>

      {inlineSuggestions ? (
        <div className="mt-2 max-h-32 overflow-y-auto border rounded-lg p-3">
          <div className="flex flex-wrap gap-1.5">
            {inlineSuggestions.map((suggestion, idx) => (
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
      ) : inlineOptions ? (
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
