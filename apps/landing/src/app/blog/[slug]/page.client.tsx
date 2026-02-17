"use client";

import { Check, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

export function ShareButton({ url }: { url: string }) {
  const [isChecked, onCopy] = useCopyButton(() => {
    void navigator.clipboard.writeText(`${window.location.origin}${url}`);
  });

  return (
    <button
      type="button"
      className={cn(buttonVariants({ size: "sm", className: "gap-2" }))}
      onClick={onCopy}
    >
      {isChecked ? (
        <Check className="size-3.5" />
      ) : (
        <Share className="size-3.5" />
      )}
      {isChecked ? "Copied URL" : "Share"}
    </button>
  );
}
