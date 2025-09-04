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
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { cn, copyToClipboard } from "@/lib/utils";
import { fieldCatalog, InputGroup, RecordFieldType } from "@pipe0/client-sdk";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Download,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from "sonner";

import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { RequiredAsterisk } from "@/components/required-asterisk";

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
        <div className="flex items-center gap-1">
          <Badge variant="outline">{fieldType}</Badge>

          <span className="text-sm text-muted-foreground">{fieldName}</span>
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
          {groupCondition && (
            <span>
              {groupCondition === "all" ? (
                <RequiredAsterisk>This field is required</RequiredAsterisk>
              ) : groupCondition === "none" ? (
                <span>(optional)</span>
              ) : (
                "misconfigured"
              )}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {rightAction}

          <div className="text-sm text-muted-foreground italic">
            <Info>{description}</Info>
            {jsonExample && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
