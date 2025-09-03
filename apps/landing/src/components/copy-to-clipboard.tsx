"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CopyToClipboardProps {
  value: string;
  className?: string;
}

export default function CopyToClipboard({
  value,
  className,
}: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <div
      className={cn("flex w-full max-w-md items-center gap-2 group", className)}
    >
      <div className="relative flex-1">
        <Input
          value={value}
          readOnly
          className="pr-10 font-mono bg-background text-sm border-muted-foreground/20 focus-visible:ring-0 focus-visible:ring-offset-0"
          onClick={(e) => e.currentTarget.select()}
        />
        <Button
          size="sm"
          variant={isCopied ? "outline" : "default"}
          className="absolute right-1 top-1/2 w-15 -translate-y-1/2 px-3 py-2 h-7 text-xs font-bold"
          onClick={copyToClipboard}
          aria-label="Copy to clipboard"
        >
          {isCopied ? <Check className="size-5" /> : "copy"}
        </Button>
      </div>
    </div>
  );
}
