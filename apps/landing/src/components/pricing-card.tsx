"use client";

import { Button } from "@/components/ui/button";
import { appInfo } from "@/lib/const";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Plan = {
  price: string;
  credits: string;
  perCredit: string;
  features: string[];
};

const baseFeatures = [
  "Unlimited users",
  "Access all data providers",
  "Custom enrichment pipelines",
  "AI integration",
  "Full control over cost and usage",
  "Full support",
];

// High-volume billing slots per plan — keep in sync with
// pipe0-server-ts/packages/common/src/stripe-product-catalog.ts
// (`highVolumeCapacity`).
const plans: Plan[] = [
  {
    price: "49",
    credits: "1.600",
    perCredit: "0.031",
    features: [
      ...baseFeatures,
      "40k rows per sheet",
      "1 high-volume billing slot",
    ],
  },
  {
    price: "149",
    credits: "5.000",
    perCredit: "0.030",
    features: [
      ...baseFeatures,
      "100k rows per sheet",
      "6 high-volume billing slots",
    ],
  },
  {
    price: "349",
    credits: "12.000",
    perCredit: "0.029",
    features: [
      ...baseFeatures,
      "200k rows per sheet",
      "12 high-volume billing slots",
      "Lower per-invocation cost",
      "Lower cost for custom connections",
    ],
  },
  {
    price: "999",
    credits: "34.000",
    perCredit: "0.029",
    features: [
      ...baseFeatures,
      "1M rows per sheet",
      "30 high-volume billing slots",
      "Lower per-invocation cost",
      "Lower cost for custom connections",
    ],
  },
];

export function PricingCard() {
  const [selected, setSelected] = useState<Plan>(plans[0]);

  return (
    <div
      role="radiogroup"
      aria-label="Credit volume"
      className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {plans.map((plan) => {
        const isActive = plan.credits === selected.credits;
        return (
          <div
            key={`${plan.credits}-${plan.price}`}
            role="radio"
            aria-checked={isActive}
            tabIndex={0}
            onClick={() => setSelected(plan)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(plan);
              }
            }}
            className={cn(
              // Light surface — the cards overlap the dark hero panel's foot,
              // so they carry a solid background and a lifting shadow.
              "flex cursor-pointer flex-col rounded-[14px] border bg-card p-5 text-left shadow-[0_12px_36px_rgba(10,14,40,0.18)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "border-primary ring-1 ring-primary"
                : "border-border hover:bg-[var(--panel)]",
            )}
          >
            <div className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {plan.credits}
            </div>
            <div className="text-sm text-muted-foreground">credits</div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-foreground">
                ${plan.price}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              ${plan.perCredit} per credit
            </div>

            <div className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href={appInfo.links.signupUrl}
              rel="nofollow"
              onClick={(e) => e.stopPropagation()}
              className="mt-5 w-full"
            >
              <Button
                variant={isActive ? "cta" : "ctaOutline"}
                className="w-full"
              >
                Sign up
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
