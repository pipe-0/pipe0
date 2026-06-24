import { AnimationPauser } from "@/app/animation-pauser";
import { HeroVideo } from "@/app/hero-video";
import { LandingSpotlight } from "@/app/landing-spotlight";
import { LandingStatement } from "@/app/landing-statement";
import { LandingSystemCards } from "@/app/landing-system-cards";
import { ScrollReveal } from "@/app/scroll-reveal";
import { Footer } from "@/components/footer";
import { AskAiButton } from "@/components/ai/ask-ai-button";
import { Header } from "@/components/header";
import { CtaButtons, CtaPanel, Section } from "@/components/marketing";
import Image from 'next/image'

const trustedLogos = [
  {
    src: "/media/website/logos/pie-light.svg",
    alt: "Pie",
    className: "block h-5 w-auto sm:h-6",
    width: 559,
    height: 356,
  },
  {
    src: "/media/website/logos/lightfield.svg",
    alt: "Lightfield",
    className: "block h-4 w-auto sm:h-5",
    width: 87,
    height: 16,
  },
  {
    src: "/media/website/logos/augusta-dark.svg",
    alt: "Augusta Labs",
    className: "block h-4 w-auto sm:h-5",
    width: 4288,
    height: 924,
  },
  {
    src: "/media/website/logos/aries-light.svg",
    alt: "Aries",
    // Fourth logo — mobile shows only three across one row.
    className: "hidden h-5 w-auto sm:block",
    width: 28,
    height: 11,
  },
];

/* Plain-words use cases — what pipe0 actually does. */
const useCases = [
  "Find email addresses",
  "Find phone numbers",
  "Find prospects",
  "Find companies",
  "Enrich your CRM",
  "Data for CRM builders",
  "Data for ATS builders",
];

export default function Home() {
  return (
    <div className="landing min-h-screen bg-background">
      <Header page="product" />
      <ScrollReveal />
      <AnimationPauser />

      {/* ===== Hero — full-bleed sky panel (generous side gutters, no top
              gap). Header + hero + pills fill the viewport; only very tall
              desktops cap the height. ===== */}
      <section className="mx-auto w-full max-w-[1750px] px-4 sm:px-7">
        <div className="hero-panel border relative h-[max(600px,100svh-6rem)] overflow-hidden rounded-[18px] sm:h-[min(100svh-11rem,860px)]">
          {/* Animated, ever-moving sky gradient */}
          <div className="hero-sky pointer-events-none absolute inset-0 z-0" aria-hidden />
          {/* Top shadow so the white copy reads cleanly (mirrors the bottom scrim) */}
          <div className="hero-top-scrim pointer-events-none absolute inset-x-0 top-0 z-[1] h-2/5" aria-hidden />

          {/* Hero scene — anchored to the foot of the panel and nudged
              below it, so only the globe's upper arc rises into view over
              the animated sky background. */}
          <HeroVideo />

          <div className="relative z-10 px-5 pt-14 text-center sm:pt-20">
            <h1 className="mx-auto max-w-4xl text-balance text-[clamp(38px,5.5vw,62px)] font-normal leading-[1.08] tracking-[-0.025em] text-white">
              The infrastructure for modern go&#8209;to&#8209;market
            </h1>
            {/* <p className="mx-auto mt-5 max-w-165 text-[17px] leading-relaxed text-white/75 sm:text-[18.5px]">
              Next generation data and automation infrastructure for leading teams.
            </p> */}
            <CtaButtons className="mt-7" />
          </div>

          {/* Trusted-by, set into the sand at the foot of the scene */}
          <div className="trusted-scrim absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-center gap-3 px-9 pb-5 pt-24 sm:flex-row sm:gap-8 sm:px-4 md:gap-10">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/70">
              Trusted by
            </span>
            <div className="flex w-full max-w-140 flex-nowrap items-center justify-between gap-4 opacity-90 sm:w-auto sm:flex-wrap sm:justify-center sm:gap-6 md:gap-8 [&_img]:brightness-0 [&_img]:invert">
              {trustedLogos.map((logo) => (
                <Image
                  key={logo.alt}
                  src={logo.src}
                  alt={`${logo.alt} logo`}
                  width={logo.width}
                  height={logo.height}
                  className={logo.className}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Use cases — what it does, in plain words ===== */}
      <Section className="pt-6 sm:pt-8">
        <div className="rv flex flex-col items-center gap-5 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {useCases.map((useCase) => (
              <span
                key={useCase}
                className="rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== Statement — what pipe0 is, revealed word-by-word on scroll ===== */}
      <Section className="py-32 sm:py-44">
        <LandingStatement />
      </Section>

      {/* ===== Spotlight — one engine, three surfaces ===== */}
      <Section className="pt-14 sm:pt-24">
        <div className="rv">
          <LandingSpotlight />
        </div>
      </Section>

      {/* ===== System grid — a unified data model. Heading and cards share
              the standard content width, matching the sections above and
              below. ===== */}
      <Section className="pt-24">
        <div className="rv mx-auto max-w-140 text-center">
          <h2 className="text-[clamp(28px,3vw,38px)] font-semibold leading-tight tracking-[-0.02em] text-foreground">
            It has never been this easy to build a winning GTM engine
          </h2>
        </div>
      </Section>

      <Section>
        <LandingSystemCards />
      </Section>

      {/* ===== CTA panel ===== */}
      <Section className="pt-14 sm:pt-24">
        <CtaPanel
          title={
            <>
              Get started <span className="hl">for free</span>.
            </>
          }
          subtitle="The first 20 credits are on us. No credit card required."
        />
      </Section>

      <Footer />

      {/* Bounded to the hero width (widest element on the page). */}
      <AskAiButton bound="1750px" variant="overlay" />
    </div>
  );
}
