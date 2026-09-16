import { Footer } from "@/components/footer";
import { AskAiButton } from "@/components/ai/ask-ai-button";
import CalButton from "@/components/cal-button";
import { Header } from "@/components/header";
import { CtaPanel, Section } from "@/components/marketing";
import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { appInfo } from "@/lib/const";
import { createMetadata } from "@/lib/metadata";
import { JsonLd, faqJsonLd } from "@/components/seo/json-ld";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Pricing — Pay-as-you-go Credits",
  description:
    "Simple usage-based pricing for pipe0. Buy credits and pay only for the enrichments you run. Every plan includes the full platform, API, and Sheets. Start free with 20 credits.",
  path: "/pricing",
});

const faqs = [
  {
    q: "What is included in the price?",
    a: "The credit price includes access to our platform, API keys, dashboard, and basic support. Usage of pipes and searches consumes credits.",
  },
  {
    q: "How does usage-based billing work?",
    a: "You're only charged when you successfully execute a pipe or search. Each operation has a different credit price that you can find in the pipe or search catalog.",
  },
  {
    q: "Do I need a subscription?",
    a: "No. You can buy credits one-off from the billing section in the dashboard; they never expire. A subscription refills your balance every month at a lower price per credit and raises your usage limits.",
  },
  {
    q: "How do I get started?",
    a: "Create an account to try pipe0. Once you're ready to purchase credits, navigate to the billing section in the dashboard.",
  },
];

const payAsYouGoPoints = [
  "Buy credits whenever you need them",
  "Credits never expire",
  "Full platform, API, and Sheets",
];

export default function Pricing() {
  return (
    <div className="landing min-h-screen bg-background">
      <JsonLd data={faqJsonLd(faqs)} />
      <Header page="pricing" />

      {/* ===== Hero panel — header + plans over the dark-alley scene ===== */}
      <section className="mx-auto max-w-384 px-3 sm:px-6">
        <div className="hero-panel border relative overflow-hidden rounded-[18px]">
          {/* Indigo backdrop — the system cards' gradient */}
          <div className="card-sky absolute inset-0" aria-hidden />
          {/* Deep shadow at the foot, so the pricing cards' light borders
              stand out against the panel */}
          <div
            className="pricing-scrim pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
            aria-hidden
          />

          <div className="relative z-10 px-5 pb-36 pt-14 text-center sm:px-10 sm:pb-56 sm:pt-20">
            <h1 className="mx-auto max-w-2xl text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em] text-white">
              Pay for what you run.
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-relaxed text-white/75 sm:text-[18px]">
              Start without a subscription and buy credits as you go, or pick a
              monthly volume for a lower price per credit.
            </p>

            {/* Pay as you go — the default way in, so it lives up here on the
                panel rather than among the priced plans. Frosted glass over
                the indigo: a hairline light border, a blurred tint of the
                scene behind it, and white type, so it belongs to the hero
                instead of floating on it. Stacks on narrow screens. */}
            <div className="mx-auto mt-12 max-w-[880px] rounded-[16px] border border-white/20 bg-white/[0.08] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_18px_40px_-20px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div className="min-w-0">
                  <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">
                    Pay as you go
                  </h2>
                  <p className="mt-1.5 max-w-[520px] text-[14.5px] leading-relaxed text-white/75">
                    No subscription needed. Every account starts here: add
                    credits from the dashboard when you need them and pay only
                    for what you run.
                  </p>
                  <ul className="mt-3.5 flex flex-col gap-x-5 gap-y-1.5 text-[13px] text-white/80 sm:flex-row sm:flex-wrap">
                    {payAsYouGoPoints.map((point) => (
                      <li key={point} className="flex items-center gap-1.5">
                        <Check className="size-3.5 shrink-0 text-white/70" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={appInfo.links.signupUrl}
                  rel="nofollow"
                  className="w-full shrink-0 sm:w-auto"
                >
                  <Button variant="cta" className="w-full sm:w-auto sm:px-5">
                    Start for free
                  </Button>
                </Link>
              </div>
            </div>

            <p className="mt-14 text-center text-[clamp(20px,2vw,26px)] font-semibold tracking-[-0.01em] text-white">
              Or pick a monthly volume
            </p>
            <p className="mx-auto mt-2 max-w-[460px] text-[14px] text-white/65">
              Subscriptions refill your balance every month at a lower price per
              credit and raise your usage limits.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Plans — overlapping the foot of the hero panel ===== */}
      <Section className="relative z-10 -mt-28 sm:-mt-44">
        <PricingCard />

        {/* The larger volumes are not displayed here; the app's billing page
            carries the full ladder. One quiet line, not a fourth card. */}
        <p className="mt-5 text-center text-[13px] text-muted-foreground">
          Larger monthly plans are available in the app.
        </p>

        {/* Enterprise — same container and gap as the grid above, so it reads
            as the last row of the plans. Calm panel surface rather than the
            cards' lifted white, since it sits off the dark hero panel and is
            an aside to the priced volumes, not another one. */}
        <div className="mt-3.5 flex flex-col gap-5 rounded-[14px] border border-[var(--panel-edge)] bg-[var(--panel)] p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
              Enterprise.
            </h2>
            <p className="mt-1.5 max-w-[560px] text-sm leading-relaxed text-muted-foreground">
              Higher volumes, custom terms, and dedicated support. Tell us what
              you run and we&apos;ll put a plan together.
            </p>
          </div>
          <CalButton variant="cta" className="w-full shrink-0 sm:w-auto">
            Book a call
          </CalButton>
        </div>
      </Section>

      {/* ===== FAQ ===== */}
      <Section className="mt-24">
        <h2 className="mb-8 text-center text-[clamp(24px,2.6vw,32px)] font-semibold tracking-[-0.02em] text-foreground">
          Questions.
        </h2>
        <div className="mx-auto max-w-3xl">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-border py-6">
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {faq.q}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== CTA panel ===== */}
      <Section className="mt-24">
        <CtaPanel
          title={
            <>
              Start for free.
            </>
          }
          note="The first 20 credits are on us. No credit card required."
        />
      </Section>

      <Footer />

      {/* Bounded to the pricing hero width (max-w-384 = 96rem). */}
      <AskAiButton bound="96rem" variant="overlay" />
    </div>
  );
}
