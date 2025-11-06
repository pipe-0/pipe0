"use client";

import { Info } from "@/components/info";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, copyToClipboard } from "@/lib/utils";
import { fieldCatalog, InputGroup, RecordFieldType } from "@pipe0/ops";
import { Check, Copy, X } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from "sonner";

import { RequiredAsterisk } from "@/components/required-asterisk";
import { appLinks } from "@/lib/links";
import Link from "next/link";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export function OutputFieldEnabledBadge({
  isEnabledByDefault,
}: {
  isEnabledByDefault: boolean;
}) {
  return (
    <Link href={appLinks.outputFieldToggle()} target="_blank">
      <>
        {isEnabledByDefault ? (
          <Badge
            variant="outline"
            className="border-none text-muted-foreground hover:underline font-normal"
          >
            <Check className="size-4" />
            &nbsp; Enabled by default
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-none text-muted-foreground hover:underline font-normal"
          >
            <X className="size-4" />
            &nbsp; Disabled by default
          </Badge>
        )}
      </>
    </Link>
  );
}

export function findFieldByName(fieldName: string) {
  return (Object.entries(fieldCatalog).find(([name]) => name === fieldName) ||
    [])[1];
}

export function FieldRow({
  fieldName,
  fieldType,
  description,
  groupCondition,
  rightAction,
}: {
  fieldName: string;
  fieldType: RecordFieldType;
  description: string;
  groupCondition?: InputGroup["condition"];
  rightAction?: ReactNode;
}) {
  const fieldResult = useMemo(() => findFieldByName(fieldName), []);
  const jsonExample = fieldResult?.jsonMeta?.exampleValue;

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
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="bg-background">
            {fieldType}
          </Badge>

          <Button
            onClick={handleCopyToClipboard}
            variant="outline"
            size="sm"
            className={cn("size-5 bg-background", showSucces && "border")}
          >
            {showSucces ? (
              <Check className="size-3 text-green-500" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
          <span className="text-sm text-muted-foreground">{fieldName}</span>
          {groupCondition && (
            <span>
              {groupCondition === "all" ? (
                <RequiredAsterisk>This field is required</RequiredAsterisk>
              ) : groupCondition === "none" ? (
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              ) : (
                "misconfigured"
              )}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground flex gap-2">
            {jsonExample && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    variant="link"
                    className="h-5 rounded-[5px] text-xs font-semibold"
                  >
                    {fieldType} (show example)
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full max-w-none md:max-w-[600px] lg:max-w-[900px] overflow-auto gap-0">
                  <SheetHeader className="mb-0">
                    <SheetTitle>Json Example</SheetTitle>
                  </SheetHeader>
                  <div className="grow overflow-auto">
                    <SyntaxHighlighter language="json" style={vscDarkPlus}>
                      {JSON.stringify(jsonExample, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {rightAction}

            <Info>{description}</Info>
          </div>
        </div>
      </div>
    </div>
  );
}
