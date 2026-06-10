import { LandingSpotlight } from "@/app/landing-spotlight";
import { LandingSystemCards } from "@/app/landing-system-cards";
import { ScrollReveal } from "@/app/scroll-reveal";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CtaButtons, CtaPanel, Section } from "@/components/marketing";
import Image from 'next/image'

const trustedLogos = [
  {
    src: "/media/website/logos/pie-light.svg",
    alt: "Pie",
    className: "h-6 w-auto",
    width: 559,
    height: 356,
  },
  {
    src: "/media/website/logos/lightfield.svg",
    alt: "Lightfield",
    className: "h-5 w-auto",
    width: 87,
    height: 16,
  },
  {
    src: "/media/website/logos/augusta-dark.svg",
    alt: "Augusta Labs",
    className: "h-5 w-auto",
    width: 4288,
    height: 924,
  },
  {
    src: "/media/website/logos/aries-light.svg",
    alt: "Aries",
    className: "h-5 w-auto",
    width: 28,
    height: 11,
  },
];

/* Mobile row sits on the page background, so it uses the light logo
   variants (grayscale, inverted by the theme in dark mode). */
const mobileTrustedLogos = trustedLogos.map((logo) =>
  logo.alt === "Augusta Labs"
    ? { ...logo, src: "/media/website/logos/augusta-light.svg" }
    : logo,
);

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

      {/* ===== Hero — bounded sky panel that frames the page width ===== */}
      <section className="mx-auto max-w-384 px-3 sm:px-6">
        <div className="hero-panel border relative overflow-hidden rounded-[18px]">
          {/* Animated, ever-moving sky gradient */}
          <div className="hero-sky pointer-events-none absolute inset-0 z-0" aria-hidden />
          {/* Top shadow so the white copy reads cleanly (mirrors the bottom scrim) */}
          <div className="hero-top-scrim pointer-events-none absolute inset-x-0 top-0 z-[1] h-2/5" aria-hidden />

          {/* Base scene — blurred on large screens only; on mobile the scene
              is too small for the focus effect, so it stays sharp. */}
          <Image
            src="/media/website/hero-scene-4.png"
            alt="A team working quietly together at a long table"
            className="absolute w-full bottom-0 lg:translate-y-30 lg:blur-[2px]"
            width={1024}
            height={432}
            style={{ objectFit: "contain" }}
          />
          {/* Sharp layer — a soft focus window roams the scene, bringing
              one person at a time into focus (enrichment: finding people).
              Desktop only. */}
          <Image
            src="/media/website/hero-scene-4.png"
            alt=""
            aria-hidden
            className="hero-focus absolute hidden w-full bottom-0 lg:block lg:translate-y-30"
            width={1024}
            height={432}
            style={{ objectFit: "contain" }}
          />

          <div className="relative z-10 px-5 pt-11 text-center sm:pt-14">
            {/* <p className="eyebrow mb-4 !text-white/65">
              Enrichment &amp; prospecting infrastructure
            </p> */}
            <h1 className="mx-auto max-w-3xl text-[clamp(38px,5.5vw,60px)] font-semibold leading-[1.08] tracking-[-0.025em] text-white">
              Go to market <span className="hl">with great data</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-165 text-[17px] leading-relaxed text-white/75 sm:text-[18.5px]">
              Sales automation for agentic teams and tools.
            </p>
            <CtaButtons className="mt-7" />
          </div>

          <div className="relative mt-6 h-[40vw] lg:h-92.5">

            {/* Trusted-by, set into the sand at the foot of the scene */}
            <div className="trusted-scrim absolute inset-x-0 bottom-0 z-10 hidden items-center justify-center gap-8 px-4 pb-6 pt-10 sm:flex md:gap-10">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/70">
                Trusted by
              </span>
              <div className="flex max-w-140 flex-wrap items-center justify-center gap-6 opacity-90 md:gap-8 [&_img]:block [&_img]:brightness-0 [&_img]:invert">
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
        </div>
      </section>

      {/* Trusted-by — on mobile the in-hero row is hidden, so it lives
          below the hero on the page background, in theme-correct colors */}
      <div className="mt-9 flex flex-col items-center gap-4 px-6 sm:hidden">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Trusted by
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-70 grayscale dark:invert [&_img]:block">
          {mobileTrustedLogos.map((logo) => (
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

      {/* ===== Use cases — what it does, in plain words ===== */}
      <Section className="pt-12 sm:pt-16">
        <div className="rv flex flex-col items-center gap-5 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {useCases.map((useCase, i) => (
              <span
                key={useCase}
                className="use-chip rounded-full px-3.5 py-1.5 text-[13px] font-medium"
                style={{ ["--chip-delay" as string]: `${i * 2}s` }}
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== Spotlight — one engine, three surfaces ===== */}
      <Section className="pt-14 sm:pt-24">
        <div className="rv">
          <LandingSpotlight />
        </div>
      </Section>

      {/* ===== System grid — a unified data model ===== */}
      <Section className="pt-24">
        <div className="rv mx-auto max-w-[720px] text-center">
          <h2 className="text-[clamp(28px,3vw,38px)] font-semibold leading-tight tracking-[-0.02em] text-foreground">
            A unified data model for enrichment &amp; automation that scales.
          </h2>
        </div>

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
    </div>
  );
}
