import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPipeCategoryMeta } from "@/lib/pipes/category-colors";
import type { PipeCategory } from "@pipe0/base";
import {
  Archive,
  Building2,
  UserRound,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* Same glyphs as the catalog's category tabs. */
const CATEGORY_ICONS: Partial<Record<PipeCategory, LucideIcon>> = {
  people_data: UserRound,
  company_data: Building2,
  tools: Wrench,
  actions: Zap,
  deprecated: Archive,
};

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
  const Icon = CATEGORY_ICONS[category];

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-[6px] border-[var(--rule-strong)] px-2 py-0.5 text-[12.5px] font-normal text-muted-foreground",
        className,
      )}
    >
      {Icon ? (
        <Icon
          className="size-3.5 shrink-0"
          style={{ color }}
          strokeWidth={2.2}
          aria-hidden
        />
      ) : (
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      )}
      {label}
    </Badge>
  );
}
