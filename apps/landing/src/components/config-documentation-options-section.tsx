"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import {
  GeneratedFormElement,
  isIncludeExcludeField,
  isIncludeExcludeSelectField,
  isSelectField,
  PayloadSelectOption,
  SelectMetadata,
} from "@pipe0/ops";
import { Copy } from "lucide-react";

export function OptionsSection({
  options: o,
  suggestions,
}: {
  options?: PayloadSelectOption[];
  suggestions?: PayloadSelectOption[];
}) {
  const getOptions = () => {
    if (o) {
      return o;
    }
    if (suggestions) {
      return suggestions;
    }
    return null;
  };

  const options = getOptions();
  if (!options) return null;

  const handleCopyOptions = () => {
    copyToClipboard(JSON.stringify(options, null, 2));
  };

  return (
    <div>
      <div className="flex justify-between">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          {suggestions ? "Suggestions" : "Available options"}
        </h4>

        <Button
          size={"icon"}
          variant="ghost"
          className="size-7"
          onClick={handleCopyOptions}
        >
          <Copy className="size-4" />
        </Button>
      </div>

      {suggestions && Array.isArray(suggestions) ? (
        <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
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
      ) : options && Array.isArray(options) ? (
        <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
          <div className="divide-y divide-gray-100">
            {options.map((option, idx) => (
              <div
                key={idx}
                className="px-3 py-2 flex items-center justify-between"
              >
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                  {option.value}
                </code>
                <span className="text-sm text-gray-600">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">Not available</span>
      )}
    </div>
  );
}
