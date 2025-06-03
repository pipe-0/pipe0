import { Badge } from "@/components/ui/badge";
import { File } from "lucide-react";
import Link from "next/link";

export function InlineDocsBadge({ href }: { href: string }) {
  return (
    <Link href={href}>
      <Badge
        variant="outline"
        className="border bg-accent dark:bg-accent dark:border-input gap-2 hover:border-foreground/30 hover:text-foreground/80 transition-all text-muted-foreground py-0.5 leading-1 px-1"
      >
        <File className="size-3" />
        Docs
      </Badge>
    </Link>
  );
}
