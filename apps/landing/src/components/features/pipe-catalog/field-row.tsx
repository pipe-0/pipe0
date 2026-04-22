"use client";

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
import { fieldCatalog, InputGroup, RecordFieldType } from "@pipe0/elements";
import { Check, Copy, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from "sonner";

import { RequiredAsterisk } from "@/components/required-asterisk";
import { docsLinkPaths } from "@pipe0/docs-links";
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
    <Link href={docsLinkPaths.outputFieldToggle} target="_blank">
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
  const jsonExample = findFieldByName(fieldName)?.jsonMeta?.exampleValue;

  const [showSuccess, setShowSuccess] = useState(false);
  const handleCopyToClipboard = () => {
    copyToClipboard(fieldName);
    toast("✅ Copied");
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 1000);
  };

  return (
    <div className="group flex items-center justify-between gap-3 -mx-2 px-2">
      <div className="flex items-center gap-1 min-w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm truncate cursor-default">{fieldName}</span>
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
        {groupCondition === "all" && (
          <RequiredAsterisk>This field is required</RequiredAsterisk>
        )}
        {groupCondition === "none" && (
          <span className="text-xs text-muted-foreground">(optional)</span>
        )}
        {jsonExample && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-5 rounded-md text-[10px] font-medium px-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
              >
                example
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-none md:max-w-150 lg:max-w-225 overflow-auto gap-0">
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
        <Button
          onClick={handleCopyToClipboard}
          variant="ghost"
          size="sm"
          aria-label="Copy field name"
          className={cn(
            "size-5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity",
            showSuccess && "opacity-100",
          )}
        >
          {showSuccess ? (
            <Check className="size-3 text-green-500" />
          ) : (
            <Copy className="size-3 text-muted-foreground" />
          )}
        </Button>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {leftAction}
        <Badge
          variant="secondary"
          className="text-xs font-normal h-5 px-1.5 py-0 rounded-md text-muted-foreground w-14 text-center justify-center"
        >
          {fieldType}
        </Badge>
        {rightAction}
      </div>
    </div>
  );
}
