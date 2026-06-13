import Link from "fumadocs-core/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Docs "next steps" list. Replaces the fumadocs default Card/Cards grid: instead
 * of bordered cards, items render as a tight vertical list of rows, each with a
 * larger gradient-framed icon — closer to a guided "what's next" list than a
 * gallery of cards.
 */
export function Cards({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("not-prose my-5 flex flex-col gap-0.5", className)}
    />
  );
}

export function Card({
  icon,
  title,
  description,
  href,
  external,
  children,
  className,
  ...props
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  external?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const inner = (
    <>
      {icon ? (
        <div className="icon-frame flex size-9 shrink-0 items-center justify-center rounded-lg border [&_svg]:size-[1.05rem]">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="m-0 text-sm font-medium text-fd-foreground">
          {title}
        </p>
        {description ? (
          <p className="m-0 text-[0.8125rem] leading-snug text-fd-muted-foreground">
            {description}
          </p>
        ) : null}
        {children ? (
          <div className="text-[0.8125rem] text-fd-muted-foreground empty:hidden">
            {children}
          </div>
        ) : null}
      </div>
    </>
  );

  const rowClass = cn(
    "-mx-3 flex items-center gap-3 rounded-lg px-3 py-1.5 transition-colors",
    href && "hover:bg-fd-accent",
    className,
  );

  if (href) {
    return (
      <Link href={href} external={external} className={rowClass} {...props}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={rowClass} {...props}>
      {inner}
    </div>
  );
}
