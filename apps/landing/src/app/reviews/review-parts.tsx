import { cn } from "@/lib/utils";
import { formatScore } from "./score";

/**
 * Square tool logo on a white tile. Tools without a logo file get their
 * initial instead, so the grid never shows a broken image.
 */
export function ToolLogo({
  name,
  logo,
  size = 32,
  className,
}: {
  name: string;
  logo?: string;
  size?: number;
  className?: string;
}) {
  const tile = cn(
    "shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-fd-foreground/10",
    className,
  );
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className={cn(tile, "object-contain p-1")}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        tile,
        "grid place-items-center font-blog font-semibold text-fd-foreground",
      )}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/** Score tone: a fixed scale, so 4.0 looks the same on every page. */
function scoreTone(score: number) {
  if (score >= 4) return "bg-emerald-50 text-emerald-800 ring-emerald-600/20";
  if (score >= 3) return "bg-amber-50 text-amber-800 ring-amber-600/20";
  return "bg-rose-50 text-rose-800 ring-rose-600/20";
}

/** "3.4 / 5" pill used on cards and in tables. */
export function ScorePill({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-baseline gap-0.5 rounded-md px-1.5 py-0.5 text-[13px] font-semibold tabular-nums ring-1 ring-inset",
        scoreTone(score),
        className,
      )}
    >
      {formatScore(score)}
      <span className="text-[11px] font-medium opacity-70">/5</span>
    </span>
  );
}

/** One criterion: label, score, a bar, and the one-line reason. */
export function ScoreBar({
  label,
  score,
  why,
}: {
  label: string;
  score: number;
  why: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[14px]">
        <span className="font-medium text-fd-foreground">{label}</span>
        <span className="font-semibold tabular-nums text-fd-foreground">
          {formatScore(score)}
          <span className="font-normal text-fd-muted-foreground">/5</span>
        </span>
      </div>
      <div
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fd-foreground/10"
        role="img"
        aria-label={`${label}: ${formatScore(score)} out of 5`}
      >
        <div
          className="h-full rounded-full bg-fd-primary"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <p className="mt-1.5 text-[13px] leading-snug text-fd-muted-foreground">
        {why}
      </p>
    </div>
  );
}
