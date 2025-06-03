"use client";

import { Info } from "@/components/info";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { cn, copyToClipboard } from "@/lib/utils";
import { FieldType, InputGroup } from "@pipe0/client-sdk";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ArrowDown, ArrowUp, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function FieldRow({
  fieldName,
  fieldType,
  description,
  type,
  groupCondition,
}: {
  fieldName: string;
  fieldType: FieldType;
  description: string;
  type: "input" | "output";
  groupCondition?: InputGroup["condition"];
}) {
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
            <span className="">{fieldType}</span>
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
