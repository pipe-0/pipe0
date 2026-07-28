import CalButton from "@/components/cal-button";
import { Button } from "@/components/ui/button";
import { appInfo } from "@/lib/const";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Standard page section.
 *
 * Deliberately the *same* container as the header (max-w-330 / px-5 sm:px-6)
 * and the footer, so the pipe0 mark, every section's first character and the
 * footer's first column all sit on one vertical. Only the hero's media panel
 * is allowed to run wider than this.
 */
export function Section({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("mx-auto max-w-330 px-5 sm:px-6", className)}>
      {children}
    </section>
  );
}

/**
 * The one heading shape on the site.
 *
 * Title and subtitle share a family, a size and a weight and are told apart
 * only by tone, so a heading reads as one short paragraph rather than a title
 * with a caption. Left-aligned everywhere, including inside centred panels —
 * the hero sets this and every section follows it.
 *
 * Keep titles short. The subtitle is where the sentence goes.
 */
export function SectionHeading({
  title,
  subtitle,
  as: Tag = "h2",
  tone = "default",
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2";
  /** "onPanel" for headings sitting on the indigo hero panels. */
  tone?: "default" | "onPanel";
  className?: string;
}) {
  const onPanel = tone === "onPanel";
  return (
    <div
      className={cn(
        "max-w-[820px] text-[clamp(22px,2.45vw,31px)] font-medium leading-[1.36] tracking-[-0.018em]",
        className,
      )}
    >
      <Tag className={onPanel ? "text-white" : "text-foreground"}>{title}</Tag>
      {subtitle && (
        <p className={onPanel ? "text-white/70" : "text-muted-foreground"}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** The primary CTA pair used across the marketing pages. */
export function CtaButtons({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-3",
        className,
      )}
    >
      <Link href={appInfo.links.signupUrl} rel="nofollow">
        <Button variant="cta" size="xl">
          Sign up free
        </Button>
      </Link>
      <CalButton variant="ctaOutline" size="xl">
        Book a demo
      </CalButton>
    </div>
  );
}

/** Calm gray closing panel with a headline, subcopy and the CTA pair. */
export function CtaPanel({
  title,
  subtitle,
  note,
  reveal = true,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Fine print under the buttons — terms, not pitch. */
  note?: ReactNode;
  /** Pass false on pages that don't mount ScrollReveal or don't animate. */
  reveal?: boolean;
}) {
  return (
    <div
      className={cn(
        reveal && "rv",
        "rounded-[18px] border border-[var(--panel-edge)] bg-[var(--panel)] px-7 py-16 sm:px-12 sm:py-20",
      )}
    >
      {/* Centred inside the panel: a nested box reads as its own composition,
          so the heading centres here even though every page-level heading is
          left-aligned to the shared container. */}
      <SectionHeading title={title} subtitle={subtitle} className="mx-auto text-center" />
      <CtaButtons className="mt-8" />
      {note && (
        <p className="mt-4 text-center text-[13px] text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
