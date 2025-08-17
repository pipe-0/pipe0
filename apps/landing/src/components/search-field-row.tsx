"use client";

import { findFieldByName } from "@/components/features/pipe-catalog/field-row";
import { Info } from "@/components/info";
import { JsonExampleSheetContent } from "@/components/json-example-sheet-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn, copyToClipboard } from "@/lib/utils";
import { RecordFieldType } from "@pipe0/client-sdk";
import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function SearchFieldRow({
  fieldName,
  fieldType,
  description,
}: {
  fieldName: string;
  fieldType: RecordFieldType;
  description: string;
}) {
  const fieldResult = useMemo(() => findFieldByName(fieldName), []);
  const jsonExample = fieldResult?.jsonExample;

  const [showSucces, setShowSuccess] = useState(false);
  const handleCopyToClipboard = () => {
    copyToClipboard(fieldName);
    toast("✅ Copied");
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 1000);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {fieldName} <Info>{description}</Info>{" "}
        </span>
        <div className="flex items-center gap-4">
          <div className="space-x-1">
            <Button
              onClick={handleCopyToClipboard}
              variant="ghost"
              size="sm"
              className={cn("size-5", showSucces && "border")}
            >
              {showSucces ? (
                <Check className="size-3 text-green-500" />
              ) : (
                <Copy className="size-3" />
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground italic">
            {fieldType !== "json" || !jsonExample ? (
              <span className="">{fieldType}</span>
            ) : (
              <Sheet>
                <SheetTrigger asChild>
                  <Badge
                    variant="outline"
                    className="bg-accent hover:text-foreground cursor-default"
                  >
                    {fieldType} (show example)
                  </Badge>
                </SheetTrigger>
                <SheetContent className="w-full max-w-none md:max-w-[600px] lg:max-w-[900px] overflow-auto gap-0">
                  <JsonExampleSheetContent jsonExample={jsonExample} />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
