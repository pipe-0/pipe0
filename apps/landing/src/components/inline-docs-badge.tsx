import { Badge } from "@/components/ui/badge";
import { File } from "lucide-react";

export function InlineDocsBadge({ href }: { href: string }) {
  return (
    <>
      <a href={href} target="_blank" rel="noreferrer">
        <Badge
          variant="outline"
          className="border-stone-300 bg-stone-300/50 dark:bg-pink-500/30 dark:border-pink-800/70 gap-2 hover:border-foreground/80 hover:text-foreground/80 transition-all text-muted-foreground py-[2px] leading-1 px-1"
        >
          <File className="size-3" />
          Docs
        </Badge>
      </a>
    </>
  );
}
