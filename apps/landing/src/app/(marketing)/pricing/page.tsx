import { ScrollReveal } from "@/app/scroll-reveal";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CtaPanel, Section } from "@/components/marketing";
import { PricingCard } from "@/components/pricing-card";

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
    q: "How do I get started?",
    a: "Create an account to try pipe0. Once you're ready to purchase credits, navigate to the billing section in the dashboard.",
  },
];

export default function Pricing() {
  return (
    <div className="landing min-h-screen bg-background">
      <Header page="pricing" />
      <ScrollReveal />

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
              Simple, <span className="hl">transparent</span> pricing.
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-relaxed text-white/75 sm:text-[18px]">
              Pay only for what you run. Pick a credit volume to get started —
              every plan includes the full platform.
            </p>

            <p className="mt-14 text-center text-[clamp(20px,2vw,26px)] font-semibold tracking-[-0.01em] text-white">
              Select credit volume
            </p>
          </div>
        </div>
      </section>

      {/* ===== Plans — overlapping the foot of the hero panel ===== */}
      <Section className="relative z-10 -mt-28 sm:-mt-44">
        <PricingCard />
      </Section>

      {/* ===== FAQ ===== */}
      <Section className="mt-24">
        <h2 className="mb-8 text-center text-[clamp(24px,2.6vw,32px)] font-semibold tracking-[-0.02em] text-foreground">
          Frequently asked <span className="hl">questions</span>.
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
              Start for <span className="hl">free</span>.
            </>
          }
          subtitle="The first 20 credits are on us. No credit card required."
        />
      </Section>

      <Footer />
    </div>
  );
}
