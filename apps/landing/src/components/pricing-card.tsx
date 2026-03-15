"use client";

import { Button } from "@/components/ui/button";
import { appInfo } from "@/lib/const";
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

const plans: Plan[] = [
  {
    price: "49",
    credits: "1.600",
    perCredit: "0.031",
    features: baseFeatures,
  },
  {
    price: "149",
    credits: "5.000",
    perCredit: "0.030",
    features: baseFeatures,
  },
  {
    price: "349",
    credits: "12.000",
    perCredit: "0.029",
    features: [...baseFeatures, "Lower cost for custom connections"],
  },
  {
    price: "999",
    credits: "34.000",
    perCredit: "0.029",
    features: [...baseFeatures, "Lower cost for custom connections"],
  },
];

export function PricingCard() {
  const [selected, setSelected] = useState<Plan>(plans[0]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {plans.map((plan) => {
          const isActive = plan.credits === selected.credits;
          return (
            <div
              key={`${plan.credits}-${plan.price}`}
              data-active={isActive}
              className="border p-4 text-left cursor-pointer transition-colors hover:bg-accent data-[active=true]:border-foreground flex flex-col"
              onClick={() => setSelected(plan)}
            >
              <div className="text-2xl font-medium tracking-tight">
                {plan.credits}
              </div>
              <div className="text-sm text-muted-foreground">credits</div>
              <div className="mt-3 text-lg font-medium">${plan.price}</div>
              <div className="text-xs text-muted-foreground">/month</div>

              <div className="mt-4 pt-4 border-t space-y-2 w-full flex-1">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={appInfo.links.signupUrl}
                rel="nofollow"
                onClick={(e) => e.stopPropagation()}
                className="mt-4 w-full"
              >
                <Button
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className="w-full"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
