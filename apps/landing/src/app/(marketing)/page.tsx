import { AnimationPauser } from "@/app/animation-pauser";
import { HeroFilm } from "@/app/hero-film";
import { HeroGlobe } from "@/app/hero-globe";
import { LandingReplaces } from "@/app/landing-replaces";
import { LandingSpotlight } from "@/app/landing-spotlight";
import { LandingStatement } from "@/app/landing-statement";
import { LandingSystemCards } from "@/app/landing-system-cards";
import { Footer } from "@/components/footer";
import { AskAiButton } from "@/components/ai/ask-ai-button";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  CtaButtons,
  CtaPanel,
  Section,
  SectionHeading,
} from "@/components/marketing";
import { createMetadata } from "@/lib/metadata";
import {
  JsonLd,
  softwareApplicationJsonLd,
} from "@/components/seo/json-ld";
import Image from 'next/image'
import Link from "next/link";

const homeDescription =
  "Replace tools like Clay, Hightouch, FullEnrich, Lusha, and n8n. Find phone numbers and email addresses; people and company search; waterfall enrichment.";

// Title is omitted so the root default applies verbatim (no template suffix).
export const metadata = createMetadata({
  description: homeDescription,
  path: "/",
});

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

/* Coding agents in the API router strip. Logos rather than names here —
   unlike the "replaces" row below, the point IS instant recognition: a
   developer should clock "this works with my agent" before reading a word. */
const agentLogos = [
  { src: "/media/website/logos/agent-cursor.svg", alt: "Cursor" },
  { src: "/media/website/logos/agent-openai.svg", alt: "OpenAI Codex" },
  { src: "/media/website/logos/agent-claude.svg", alt: "Claude Code" },
];

const stats = [
  {
    figure: "3×",
    label: "prospecting output per rep",
    note: "reported by teams using pipe0",
  },
  {
    figure: "2M",
    label: "records in a single table",
    note: "multiplayer, with point-in-time restore",
  },
  {
    figure: "50+",
    label: "providers behind one API",
    note: "waterfalls bill only what answers",
  },
];

export default function Home() {
  return (
    <div className="landing min-h-screen bg-background">
      <JsonLd
        data={softwareApplicationJsonLd({ description: homeDescription })}
      />
      <Header page="product" />
      <AnimationPauser />

      {/* ===== Hero — a compact copy block, then a media panel wider than it.

              Headline and subhead share a font and a size and are separated
              only by tone, so they read as one short paragraph rather than a
              title with a caption. The block sits in the *header's* container
              (max-w-330 / px-5 sm:px-6) rather than the page's Section, so the
              headline starts on the same vertical as the pipe0 mark above it;
              keep the two in step if either changes.

              Spacing is fixed and tight — the panel, not the copy, absorbs
              whatever height is left over. All of that slack lands below the
              film (see the mt-auto on the CTA block), which keeps the film's
              top edge a constant distance from the panel's, because its
              backdrop is a baked copy of the sky at that exact position.
              ===== */}
      {/* Not a flex column: `mx-auto` on a flex item overrides the default
          stretch and makes it shrink-to-fit, which silently narrowed the
          copy block to its own text width and knocked it out of alignment
          with the header and footer. Plain block flow keeps Section full
          width, so all three share one left edge. */}
      <div>
        {/* Equal padding top and bottom, so the gap the header leaves above
            the headline matches the one the panel leaves below it. */}
        <Section className="py-[clamp(12px,2.1svh,28px)]">
          <div className="text-[clamp(22px,2.45vw,31px)] font-medium leading-[1.36] tracking-[-0.018em]">
            <h1 className="text-foreground">Bring every GTM idea into reality. Fast.</h1>
            <p className="text-muted-foreground">
              A friendly agent and API to replace your entire stack.
            </p>
          </div>
        </Section>

        {/* 16:9 rather than "whatever height is left over" — a stated ratio
            reads as composed, and it is much taller than the old flex-grown
            panel — a true 16:9, held at every width.

            The ratio is a *minimum height* rather than aspect-ratio, which is
            what finally made it behave. aspect-ratio fixes the height exactly,
            so with overflow-hidden anything taller is silently clipped — that
            is what cut the logo row off at ~1024px and on phones, where 16:9
            of a 358px column is barely 200px. Capping it with max-height
            instead made the ratio drift wider the wider the screen got.

            As a min-height on an auto-height box you get max(content, 16:9):
            the ratio holds wherever there is room, content wins where there is
            not, and nothing is ever clipped. 1694px is the panel's widest
            (max-w-1750 less its gutters). */}
        <section className="mx-auto w-full max-w-[1750px] px-4 sm:px-7">
          <div className="hero-panel border relative flex min-h-[520px] w-full flex-col overflow-hidden rounded-[18px] sm:min-h-[calc(min(100vw-3.5rem,1694px)/1.78)]">
            {/* One sky again. The film is transparent DOM now, so nothing has
                to match a baked gradient and the panel can go back to a single
                animated layer.

                Dropped below `sm`, where the globe's baked-in sky and
                `.hero-panel-flat` cover it completely: two full-bleed gradient
                layers drifting forever underneath an opaque video is pure
                compositor cost, and on a phone it is the video that pays. */}
            <div
              className="hero-sky pointer-events-none absolute inset-0 z-0 max-sm:hidden"
              aria-hidden
            />

            {/* Phones get the globe, desktops the product scene. The scene is
                a wide, detailed shot — at phone width its type stops being
                readable and it no longer carries the idea, so small screens
                keep the loop that reads at any size. */}
            <div className="sm:hidden">
              <HeroGlobe />
            </div>
            <div className="relative z-10 hidden flex-1 items-center px-4 py-7 sm:flex sm:px-7">
              <HeroFilm />
            </div>
            {/* On phones the CTAs sit high, in clear sky, with the spacer
                *after* them — pushed to the bottom they landed right on the
                globe's horizon. On desktop the film already absorbs the
                slack, so both of these are inert there.

                `pt-9` matches the `pb-9` under the logo row below, so the
                panel holds the same margin above its first element as below
                its last. */}
            <div className="relative z-10 px-5 pt-9 sm:pt-0">
              <CtaButtons />
            </div>
            <div className="flex-1 sm:hidden" aria-hidden />

            {/* Trusted-by, set into the foot of the panel */}
            <div className="trusted-scrim relative z-10 mt-7 flex flex-col items-center justify-center gap-3 px-9 pb-9 pt-10 sm:flex-row sm:gap-8 sm:px-4 md:gap-10 md:pb-11">
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
      </div>

      {/* ===== Router — a good share of visitors arrive looking for an
              enrichment API, and the hero deliberately doesn't carry that
              story. One line in the first screen lets them self-select
              without diluting the copy above. ===== */}
      <Section className="pt-6 sm:pt-8">
        <Link
          href="/enrichment-api"
          className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 rounded-[14px] border border-[var(--panel-edge)] bg-[var(--panel)] px-5 py-2.5"
        >
          <span className="flex items-center gap-3.5">
            {/* Overlapping agent marks — decorative; the copy carries the
                meaning. White chips so the logos read in dark mode too, with
                a panel-colored ring separating each from the one beneath. */}
            <span aria-hidden className="flex shrink-0 -space-x-3">
              {agentLogos.map((logo) => (
                <span
                  key={logo.alt}
                  className="flex size-9 items-center justify-center rounded-full border border-[#1c2333]/10 bg-white ring-2 ring-[var(--panel)]"
                >
                  <Image
                    src={logo.src}
                    alt=""
                    width={16}
                    height={16}
                    className="size-4"
                  />
                </span>
              ))}
            </span>
            <span className="text-sm text-muted-foreground">
              Looking for an API? Add Clay-like enrichment to any product or
              agent. Fast.
            </span>
          </span>
          <span className="text-sm font-medium text-foreground transition-opacity group-hover:opacity-70">
            Enrichment API →
          </span>
        </Link>
      </Section>

      {/* ===== Statement — what pipe0 is, revealed word-by-word on scroll ===== */}
      <Section>
        <LandingStatement />
      </Section>

      {/* ===== The stack this collapses — the statement makes the claim,
              this row shows the invoices it retires. Left-aligned to the
              shared container like every other section heading. ===== */}
      <Section className="pt-8 sm:pt-12">
        <LandingReplaces />
      </Section>

      {/* ===== Spotlight — the three layers of a revenue org ===== */}
      <Section className="pt-14 sm:pt-24">
        <div >
          <LandingSpotlight />
        </div>
      </Section>

      {/* ===== System grid — what the primitives actually do. Heading and
              cards share the standard content width, matching the sections
              above and below. ===== */}
      <Section className="pt-24">
        <div className="mx-auto max-w-165 text-center">
          <h2 className="text-[clamp(28px,3vw,38px)] font-semibold leading-tight tracking-[-0.02em] text-foreground">
            Simple things stay simple. Complex things become possible.
          </h2>
        </div>
      </Section>

      <Section>
        <LandingSystemCards />
      </Section>


      {/* ===== Proof — three numbers, no chart ===== */}
      <Section className="pt-24 sm:pt-32">
        <div className="grid gap-10 border-t border-border pt-12 sm:grid-cols-3 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.figure}>
              <div className="text-[clamp(38px,4.4vw,54px)] font-semibold leading-none tracking-[-0.03em] text-foreground">
                {stat.figure}
              </div>
              <div className="mt-3 text-[15px] font-medium text-foreground">
                {stat.label}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== CTA panel ===== */}
      <Section className="pt-14 sm:pt-24">
        <CtaPanel
          title="Get started for free."
          note="The first 20 credits are on us. No credit card required."
        />
      </Section>

      <Footer />

      {/* Bounded to the hero width (widest element on the page). */}
      <AskAiButton bound="1750px" variant="overlay" />
    </div>
  );
}
