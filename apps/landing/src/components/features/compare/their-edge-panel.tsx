import { Check } from "lucide-react";
import type { CompareConfig } from "@/lib/compare/types";

export function TheirEdgePanel({
  competitor,
  intro,
  points,
  pickThem,
  pickUs,
}: { competitor: string } & CompareConfig["theirEdge"]) {
  return (
    // Same quiet surface as the closing CTA panel and footer: gray fill,
    // hairline panel edge, no gloss.
    <div className="rounded-[18px] border border-[var(--panel-edge)] bg-[var(--panel)] p-6 sm:p-10">
      <div className="grid gap-8 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-[clamp(22px,2.4vw,30px)] font-semibold tracking-[-0.02em] text-foreground">
            Where {competitor} is ahead.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </div>
        <ul className="space-y-2.5 sm:pt-2">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
        <div className="rounded-[14px] border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">
            Pick {competitor} if
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {pickThem}
          </p>
        </div>
        <div className="rounded-[14px] border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Pick pipe0 if</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {pickUs}
          </p>
        </div>
      </div>
    </div>
  );
}
