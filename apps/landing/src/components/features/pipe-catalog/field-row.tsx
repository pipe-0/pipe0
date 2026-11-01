import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FieldRowData } from "@/lib/catalog-entry.server";
import { cn, copyToClipboard } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { toast } from "sonner";

const JsonExample = lazy(() => import("./json-example"));

export function FieldRow({ field }: { field: FieldRowData }) {
  const { name, type, description, jsonExample } = field;

  const [showSuccess, setShowSuccess] = useState(false);
  const handleCopyToClipboard = () => {
    copyToClipboard(name);
    toast("✅ Copied");
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 1000);
  };

  return (
    <div className="group flex items-center justify-between gap-3 -mx-2 py-1 px-2">
      <div className="flex items-center gap-1 min-w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm truncate cursor-default">{name}</span>
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
        {jsonExample ? (
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
                <Suspense>
                  <JsonExample value={jsonExample} />
                </Suspense>
              </div>
            </SheetContent>
          </Sheet>
        ) : null}
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
        <Badge
          variant="secondary"
          className="text-xs font-normal h-5 px-1.5 py-0 rounded-md text-muted-foreground w-14 text-center justify-center"
        >
          {type}
        </Badge>
      </div>
    </div>
  );
}
