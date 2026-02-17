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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function OutputFieldEnabledBadge({
  isEnabledByDefault,
}: {
  isEnabledByDefault: boolean;
}) {
  return (
    <Link href={appLinks.outputFieldToggle()} target="_blank">
      <>
        {isEnabledByDefault ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("size-5 bg-background")}
              >
                <Check className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Enabled by default. You can disable this field via the pipe
              config.
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("size-5 bg-background")}
              >
                <X className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Disabled by default. You can enable this field via the pipe
              config.
            </TooltipContent>
          </Tooltip>
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
  leftAction,
}: {
  fieldName: string;
  fieldType: RecordFieldType;
  description: string;
  groupCondition?: InputGroup["condition"];
  rightAction?: ReactNode;
  leftAction?: ReactNode;
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
          {jsonExample && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-5 rounded-[5px] text-xs font-semibold px-1 text-blue-500 hover:text-blue-600 hover:underline"
                >
                  example
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

          {leftAction}
          <div className="flex gap-2 items-center pl-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm">{fieldName}</span>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
            <Button
              onClick={handleCopyToClipboard}
              variant="ghost"
              size="sm"
              className={cn("size-5 bg-background", showSucces && "border")}
            >
              {showSucces ? (
                <Check className="size-3 text-green-500" />
              ) : (
                <Copy className="size-3 text-muted-foreground" />
              )}
            </Button>
          </div>
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
            {rightAction}
          </div>
        </div>
      </div>
    </div>
  );
}
