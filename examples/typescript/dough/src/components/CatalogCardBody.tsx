import { CatalogProviderAvatars } from "@pipe0/react";

export function CatalogCardBody({
  title,
  description,
  cost,
  costMode,
  providers,
}: {
  title: string;
  description: string;
  cost: number;
  costMode: "per_result" | "per_search" | "per_page";
  providers: number;
}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="font-medium text-zinc-900">{title}</div>
      <p className="text-sm text-zinc-600">{description}</p>
      <div className="flex items-center justify-between gap-3 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <CatalogProviderAvatars size="sm" />
          <span>{providers === 1 ? "1 provider" : `${providers} providers`}</span>
        </div>
        <span>{cost === 0 ? "Free" : `${cost} cr / ${costSuffix(costMode)}`}</span>
      </div>
    </div>
  );
}

function costSuffix(mode: "per_result" | "per_search" | "per_page"): string {
  if (mode === "per_result") return "result";
  if (mode === "per_search") return "search";
  return "page";
}
