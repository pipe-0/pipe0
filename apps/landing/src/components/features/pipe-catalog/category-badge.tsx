import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPipeCategoryMeta } from "@/lib/pipes/category-colors";
import type { PipeCategory } from "@pipe0/base";

export function CategoryBadge({
  category,
  className,
}: {
  category: PipeCategory | undefined | null;
  className?: string;
}) {
  if (!category) return null;
  const { color, label } = getPipeCategoryMeta(category);
  if (!label) return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-2 py-0.5 text-xs font-normal text-muted-foreground",
        className,
      )}
    >
      <span
        className="size-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </Badge>
  );
}
