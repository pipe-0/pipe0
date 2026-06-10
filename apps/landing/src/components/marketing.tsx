import CalButton from "@/components/cal-button";
import { Button } from "@/components/ui/button";
import { appInfo } from "@/lib/const";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

/** Standard page section — bounded width + responsive gutters. */
export function Section({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("mx-auto max-w-[1280px] px-5 sm:px-10", className)}>
      {children}
    </section>
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
}: {
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="rv rounded-[18px] border border-[var(--panel-edge)] bg-[var(--panel)] px-6 py-20 text-center sm:py-24">
      <h2 className="text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.12] tracking-[-0.022em] text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
      )}
      <CtaButtons className="mt-7" />
    </div>
  );
}
