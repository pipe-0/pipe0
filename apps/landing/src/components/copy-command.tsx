"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

/**
 * A shell command set as a single line with a copy button — the install
 * step, shown where a developer decides whether to try it.
 */
export function CopyCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-[640px] items-center gap-3 rounded-[10px] border border-[var(--rule-strong)] bg-background py-1.5 pl-4 pr-1.5 shadow-[0_1px_2px_rgba(14,17,23,0.05)]",
        className,
      )}
    >
      <span aria-hidden className="select-none font-mono text-[13px] text-muted-foreground">
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-left font-mono text-[12.5px] text-foreground [scrollbar-width:none] sm:text-[13.5px]">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="btn-glossy-outline inline-flex size-8 shrink-0 items-center justify-center rounded-[7px] border text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}
