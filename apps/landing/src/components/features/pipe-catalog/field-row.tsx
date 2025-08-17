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
import { ArrowDown, ArrowUp, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from "sonner";

import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export function findFieldByName(fieldName: string) {
  return (Object.entries(fieldCatalog).find(([name]) => name === fieldName) ||
    [])[1];
}

export function PipeFieldRow({
  fieldName,
  fieldType,
  description,
  type,
  groupCondition,
}: {
  fieldName: string;
  fieldType: RecordFieldType;
  description: string;
  type: "input" | "output";
  groupCondition?: InputGroup["condition"];
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
            {type === "input" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/resources/pipe-catalog?type=output-field&value=${encodeURI(
                      fieldName
                    )}`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("size-5", showSucces && "border")}
                    >
                      <ArrowDown className="size-3" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  Find pipes that output this field
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/resources/pipe-catalog?type=input-field&value=${encodeURI(
                      fieldName
                    )}`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("size-5", showSucces && "border")}
                    >
                      <ArrowUp className="size-3" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  Find pipes that input this field
                </TooltipContent>
              </Tooltip>
            )}
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

            {groupCondition && ", "}
            {groupCondition && (
              <span>
                {groupCondition === "all"
                  ? "required"
                  : groupCondition === "none"
                  ? "optional"
                  : "misconfigured"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
