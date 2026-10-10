import { LandingEconomics } from "@/app/landing-economics";
import { LandingFaq, type Faq } from "@/app/landing-faq";
import CalButton from "@/components/cal-button";
import {
  Band,
  Cell,
  Cells,
  SectionHead,
  buttonSkin,
} from "@/components/grid";
import { CloseBand, LandingShell, PageHero } from "@/components/landing-shell";
import { JsonLd, faqJsonLd } from "@/components/seo/json-ld";
import { appInfo } from "@/lib/const";
import { createMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Pricing — Pay as you go, no subscription",
  description:
    "Premium enrichment data, pay as you go. Buy credits that never expire, or pick a monthly plan for a lower price per credit. Every waterfall bills only the provider that found the data.",
  path: "/pricing",
});

/* Plan ladder — keep in sync with the app's billing page and
   pipe0-server-ts/packages/common/src/stripe-product-catalog.ts
   (`highVolumeCapacity`; pay as you go is `PAY_AS_YOU_GO.centsPerCredit`). Larger plans live in the app. */
type Plan = {
  name: string;
  price: string;
  cadence: string;
  credits: string;
  perCredit?: string;
  points: string[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Pay as you go",
    price: "$0",
    cadence: "to start",
    credits: "Buy credits when you need them",
    perCredit: "$0.035 per credit",
    points: ["Credits never expire", "No subscription", "Sandbox runs are free"],
    featured: true,
  },
  {
    name: "1,600 credits a month",
    price: "$49",
    cadence: "per month",
    credits: "Refills every month",
    perCredit: "$0.031 per credit",
    points: ["40k rows per sheet", "1 high-volume billing slot"],
  },
  {
    name: "5,000 credits a month",
    price: "$149",
    cadence: "per month",
    credits: "Refills every month",
    perCredit: "$0.030 per credit",
    points: ["100k rows per sheet", "6 high-volume billing slots"],
  },
  {
    name: "12,000 credits a month",
    price: "$349",
    cadence: "per month",
    credits: "Refills every month",
    perCredit: "$0.029 per credit",
    points: [
      "200k rows per sheet",
      "12 high-volume billing slots",
      "Actions at $3 per 100k",
    ],
  },
];

/* What every plan, including pay as you go, comes with. */
const included = [
  "Unlimited users",
  "Every data provider",
  "Sheets, API, and MCP",
  "Schedules and webhooks",
  "Full support",
];

const faqs: Faq[] = [
  {
    q: "What do I pay when nothing is found?",
    a: "Nothing. Every waterfall bills only the provider that returned data. Each pipe and search lists its credit price in the catalog before you run it.",
  },
  {
    q: "Do I need a subscription?",
    a: "No. Buy credits one-off from the billing page in the app; they never expire. A monthly plan refills your balance at a lower price per credit and raises your usage limits.",
  },
  {
    q: "What is included in the price?",
    a: "The platform, Sheets, API keys, the MCP server, and support. Credits are spent only when you run pipes and searches.",
  },
  {
    q: "Can I use my own provider keys?",
    a: "Yes. Store your key and pipe0 uses it instead of the managed connection, for a small platform fee per call: 0.05 credits, or 0.001 on plans above $300 a month.",
    link: { href: "/docs/connections", label: "Connections" },
  },
];

export default function Pricing() {
  return (
    <LandingShell page="pricing">
      <JsonLd data={faqJsonLd(faqs.map(({ q, a }) => ({ q, a })))} />

      <PageHero
        kicker="No subscription required."
        title="Premium enrichment data, pay as you go."
        lede="Start with credits that never expire, or pick a monthly plan for a lower price per credit. Every waterfall bills only the provider that found the data."
      />

      {/* ===== Plans — four cells on one row, the way in first ===== */}
      <Band>
        <Cells className="sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Cell key={plan.name} className="flex flex-col px-6 py-10 sm:px-8">
              {plan.featured && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] bg-primary"
                />
              )}
              <p className="text-[15px] font-medium text-foreground">
                {plan.name}
              </p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-[clamp(30px,2.6vw,38px)] font-medium leading-none tracking-[-0.045em] text-foreground">
                  {plan.price}
                </span>
                <span className="text-[14px] text-muted-foreground">
                  {plan.cadence}
                </span>
              </p>
              <p className="mt-3 text-[15px] text-foreground">{plan.credits}</p>
              <p className="mt-0.5 h-5 text-[13.5px] text-muted-foreground">
                {plan.perCredit}
              </p>
              <ul className="mt-6 space-y-2 border-t border-[var(--rule)] pt-6 text-[14.5px] text-muted-foreground">
                {plan.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  href={appInfo.links.signupUrl}
                  rel="nofollow"
                  className={cn(
                    "inline-flex h-10 w-full items-center justify-center rounded-[8px] border text-[15px] font-medium",
                    plan.featured ? buttonSkin.primary : buttonSkin.secondary,
                  )}
                >
                  Start free
                </Link>
              </div>
            </Cell>
          ))}
        </Cells>

        {/* Shared by every plan — said once instead of on every card. */}
        <div className="flex flex-col gap-3 border-t border-[var(--rule)] px-6 py-5 text-[14.5px] sm:px-8 lg:flex-row lg:items-center lg:gap-8">
          <span className="font-medium text-foreground">Every plan includes</span>
          <span className="text-muted-foreground">{included.join(" · ")}</span>
        </div>

        <div className="flex flex-col gap-5 border-t border-[var(--rule)] px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[17px] font-medium text-foreground">
              Larger volumes and enterprise
            </p>
            <p className="mt-1 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">
              Bigger monthly plans are in the app. For custom terms and
              dedicated support, tell us what you run and we&apos;ll put a plan
              together.
            </p>
          </div>
          <CalButton
            variant="ghost"
            className={cn(
              "inline-flex h-11 shrink-0 items-center justify-center rounded-[8px] border px-5 text-[15px] font-medium",
              buttonSkin.secondary,
            )}
          >
            Book a call
          </CalButton>
        </div>
      </Band>

      {/* ===== What a result costs ===== */}
      <Band>
        <SectionHead
          title="What a result costs."
          lede="Measured averages against the public list prices of waterfall providers. Misses cost nothing."
        />
        <LandingEconomics pricingLink={false} />
      </Band>

      <Band>
        <SectionHead title="Questions about pricing." />
        <LandingFaq items={faqs} />
      </Band>

      <CloseBand
        title="Start with credits that never expire."
        lede="Run a few rows of a list you already know. Compare the hit rate and the cost per contact."
      />
    </LandingShell>
  );
}
