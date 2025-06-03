"use client";

import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useState } from "react";

type Plan = { price: string; credits: string };

const plans: Plan[] = [
  { price: "49", credits: "1.600" },
  { price: "149", credits: "5.000" },
  { price: "349", credits: "12.000" },
  { price: "999", credits: "34.000" },
];

export function PricingCard() {
  const [selectedCredits, setSelectedCredits] = useState<Plan>(plans[0]);
  return (
    <div className="bg-accent dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-8 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Professional</h2>
        <p className="text-gray-400 pb-4">Choose a credit amount</p>
        <div className="flex gap-2">
          {plans.map((e) => (
            <Badge
              variant="outline"
              data-is-active={e.credits === selectedCredits.credits}
              className="h-8 px-3 cursor-default hover:bg-stone-300/30 data-[is-active=true]:outline-1 data-[is-active=true]:outline-primary"
              key={`${e.credits}-${e.price}`}
              onClick={() => setSelectedCredits(e)}
            >
              {e.credits}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">${selectedCredits.price}</span>
          <span className="text-gray-400 ml-2">/month</span>
        </div>
        <p className="text-gray-400 mt-2">{selectedCredits.credits} Credits</p>
      </div>

      <div className="space-y-4 mb-8 flex-grow">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <span>Unlimited Users</span>
        </div>
        <div className="flex items-start">
          <Check className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <span>Access all data providers</span>
        </div>
        <div className="flex items-start">
          <Check className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <span>Custom enrichment pipelines</span>
        </div>
        <div className="flex items-start">
          <Check className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <span>AI integration</span>
        </div>
        <div className="flex items-start">
          <Check className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <span>Full control over cost and usage</span>
        </div>
        <div className="flex items-start">
          <Check className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <span>Full support</span>
        </div>
      </div>
    </div>
  );
}
