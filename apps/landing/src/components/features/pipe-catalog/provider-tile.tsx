import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * The entry's provider tile. With more than one provider it is drawn as a
 * physical stack: blank cards fanned out to the right behind the front one,
 * one per extra provider (up to three), so the count reads at a glance
 * without a "+N" badge.
 */
export function ProviderTile({
  provider,
  count,
}: {
  provider?: { label: string; logoUrl?: string; tileColor?: string };
  count: number;
}) {
  const behind = Math.min(Math.max(count - 1, 0), 3);

  return (
    <div
      className="relative shrink-0"
      style={{ width: 44 + behind * 8, height: 44 }}
      title={`${count} provider${count === 1 ? "" : "s"}`}
    >
      {Array.from({ length: behind }, (_, k) => {
        const depth = behind - k; // furthest card first
        return (
          <span
            key={depth}
            aria-hidden
            className="absolute top-0 size-11 rounded-[10px] border border-[var(--rule-strong)] bg-background"
            style={{
              left: depth * 8,
              transform: `rotate(${depth * 5}deg) scale(${1 - depth * 0.06})`,
              transformOrigin: "bottom left",
              backgroundColor: `hsl(228 33% ${100 - depth * 2}%)`,
              boxShadow: "0 1px 2px rgba(14,17,23,0.05)",
            }}
          />
        );
      })}
      <div
        className="absolute left-0 top-0 flex size-11 items-center justify-center overflow-hidden rounded-[10px] border border-[var(--rule)] bg-background shadow-[0_1px_2px_rgba(14,17,23,0.05)]"
        style={{ backgroundColor: provider?.tileColor }}
      >
        {provider?.logoUrl ? (
          <Avatar className="size-7 rounded-md">
            <AvatarImage
              src={provider.logoUrl}
              alt={provider.label}
              className="object-contain"
            />
            <AvatarFallback className="rounded-md text-[10px]">
              {provider.label.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">P</span>
        )}
      </div>
    </div>
  );
}
