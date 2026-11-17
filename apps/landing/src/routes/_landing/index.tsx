import { seo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { HeroMorph } from "@/components/landing/hero-morph";
import { KnifeLoop } from "@/components/landing/knife-loop";
import { LandingFaq, faqItems } from "@/components/landing/landing-faq";
import { LandingFounder } from "@/components/landing/landing-founder";
import { LandingReplaces } from "@/components/landing/landing-replaces";
// Off the homepage for now; see where it used to render, below.
// import { LandingSpotlight } from "@/components/landing/landing-spotlight";
import { LandingLevels } from "@/components/landing/landing-story";
import { LandingWell } from "@/components/landing/landing-well";
import { LandingValue } from "@/components/landing/landing-value";
import {
  Band,
  GridCtas,
  panel,
  SectionHead,
  type,
} from "@/components/grid";
import { cn } from "@/lib/utils";
import { CloseBand } from "@/components/landing-shell";
import {
  jsonLd,
  faqJsonLd,
  softwareApplicationJsonLd,
} from "@/components/seo/json-ld";
import { Image } from "@/components/image";

const homeDescription =
  "Turns any GTM play or data idea into a production system with pipe0. Find and enrich B2B contacts across 50+ providers, build Clay-like tables, and run automations from an agent, the API, or MCP. Pay only for results.";

/* The cost multiple vs Clay, approved in the positioning evidence file. The
   word joiner after the dash keeps "6–" from ending a line on a phone. */
const CLAY_MULTIPLE = "6–\u206012x";

type Logo = {
  src: string;
  alt: string;
  className: string;
  width: number;
  height: number;
  /** For a company that publishes only a mark: its name, set beside it. */
  name?: string;
  /** Already drawn in black and white, so it is not flattened to black. */
  asIs?: boolean;
  /** Left out below lg, so the marks that remain fill even rows. */
  wide?: boolean;
};

/* Two rows on desktop: seven beside the label, then eight across the full
   width, on the same columns. */
const trustedLogos: Logo[][] = [
  [
    {
      src: "/media/website/logos/zeroclick.svg",
      alt: "ZeroClick",
      className: "block h-5 w-auto",
      width: 159,
      height: 30,
    },
    {
      src: "/media/website/logos/lightfield.svg",
      alt: "Lightfield",
      className: "block h-[18px] w-auto",
      width: 87,
      height: 16,
    },
    {
      src: "/media/website/logos/augusta-dark.svg",
      alt: "Augusta Labs",
      className: "block h-[18px] w-auto",
      width: 4288,
      height: 924,
    },
    {
      src: "/media/website/logos/aries-light.svg",
      alt: "Aries",
      className: "block h-5 w-auto",
      width: 28,
      height: 11,
      wide: true,
    },
    {
      src: "/media/website/logos/tempo.svg",
      alt: "Tempo",
      className: "block h-[18px] w-auto",
      width: 141,
      height: 30,
    },
    {
      src: "/media/website/logos/fulfillment.webp",
      alt: "Fulfillment.com",
      className: "block h-7 w-auto",
      width: 360,
      height: 96,
    },
    {
      src: "/media/website/logos/mercor-mark.svg",
      alt: "Mercor",
      className: "block h-5 w-auto",
      width: 22,
      height: 20,
      name: "Mercor",
    },
  ],
  [
    {
      src: "/media/website/logos/thecompany.svg",
      alt: "The Company Company",
      className: "block h-[26px] w-auto",
      width: 986,
      height: 200,
    },
    {
      src: "/media/website/logos/expand.svg",
      alt: "Expand",
      className: "block h-4 w-auto",
      width: 115,
      height: 20,
    },
    {
      src: "/media/website/logos/zeroprime.svg",
      alt: "Zero Prime",
      className: "block h-5 w-auto",
      width: 160,
      height: 31,
      wide: true,
    },
    {
      src: "/media/website/logos/taleva-mark.png",
      alt: "Taleva",
      className: "block h-[22px] w-auto",
      width: 398,
      height: 419,
      name: "Taleva",
    },
    {
      src: "/media/website/logos/imdigital-mark.svg",
      alt: "IM Digital",
      className: "block h-6 w-auto",
      width: 121,
      height: 45,
    },
    {
      src: "/media/website/logos/continual-mark.svg",
      alt: "Continual",
      className: "block h-5 w-auto",
      width: 24,
      height: 24,
      name: "Continual",
    },
    {
      // One colour, with the white of its mascot's face kept.
      src: "/media/website/logos/qodo.svg",
      alt: "Qodo",
      className: "block h-8 w-auto",
      width: 135,
      height: 46,
      asIs: true,
    },
    {
      // Greyscale, so the U stays cut out of its square.
      src: "/media/website/logos/usermotion.png",
      alt: "UserMotion",
      className: "block h-4 w-auto",
      width: 560,
      height: 76,
      asIs: true,
      wide: true,
    },
  ],
];

export const Route = createFileRoute("/_landing/")({
  head: () => {
    const page = seo({
      description: homeDescription,
      path: "/",
    });
    return {
      ...page,
      scripts: [
        jsonLd(softwareApplicationJsonLd({ description: homeDescription })),
        jsonLd(faqJsonLd(faqItems.map((f) => ({ q: f.q, a: f.a })))),
      ],
    };
  },
  component: Home,
});

function Home() {
  return (
    <>
      {/* ===== Hero — the claim and the way in, nothing else. The film
              under it is the explanation, so the hero is kept short: its
              padding follows the screen's height, and gives the film the
              rest of the first screen. ===== */}
      <Band className="sm:border-b-0" inner="sm:border-x-0" marks={false}>
        <div className="flex flex-col items-center px-6 pb-[clamp(2rem,5svh,3.5rem)] pt-[clamp(2rem,5.5svh,4rem)] text-center sm:px-10 lg:px-12">
          {/* The claim, with the knife living in it: its tools are agents,
              and they flip out one by one (app/knife-loop.tsx). Two lines
              from sm. On a phone the first wraps once more, and the knife
              stays with its word: "The Swiss / Army knife / for agentic
              GTM." */}
          <h1 className="text-balance text-[9.4vw] font-medium leading-[1.06] tracking-[-0.045em] text-foreground sm:text-[clamp(40px,4.4vw,62px)]">
            The Swiss{" "}
            <span className="whitespace-nowrap">
              Army <KnifeLoop className="align-[-0.2em]" /> knife
            </span>
            <br /> for agentic GTM.
          </h1>
          <GridCtas className="mt-8 justify-center" />
        </div>
      </Band>

      {/* ===== Product film — the one saturated surface near the top, and
              nothing on it but the film. Below 2xl the sky runs edge to
              edge. From 2xl it is a rounded panel, 95% of the screen and
              always wider than the rails. There is no rule above or below
              it at any width: the sky's own edges are where the sections
              end, and the page's grid starts under it (see the customers
              band).

              The film's size follows the screen's height. Up to about
              1060px of height it is the 1200px it always was. On taller
              screens it grows into the room the hero leaves (--film-max:
              what is left of the screen under the header, the hero and the
              panel's own padding, at the film's 12:5), up to 1400px.

              Not on phones: its type is unreadable that small, and the
              headline already carries a picture. The page goes straight
              from the hero to who uses it. ===== */}
      <section className="relative max-sm:hidden">
        <div className={panel}>
          <div
            className="hero-sky pointer-events-none absolute inset-0 z-0"
            aria-hidden
          />
          <div className="relative z-10 flex items-center px-4 py-[clamp(2.5rem,6svh,5rem)] [--film-max:clamp(1200px,calc((100svh_-_35rem)_*_2.4),1400px)] sm:px-10">
            <HeroMorph />
          </div>
        </div>
      </section>

      {/* ===== Customers — one cell per mark. This is where the page's
              grid begins, and it begins gradually: no rule and no crosses
              above it; the rails and the cells' walls fade in from white
              under the film. The marks and the label stand above the fade,
              so only the lines are affected. ===== */}
      <Band marks={false} inner="sm:pt-3">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-px top-0 z-10 h-28 bg-gradient-to-b from-background to-transparent max-sm:hidden"
        />
        {/* On desktop the label and seven marks make the first row, and
            eight marks the second, on the same columns. Below lg three
            marks drop, so twelve fill even rows (2 or 3 across). */}
        <div className="grid grid-cols-2 gap-px bg-[var(--rule)] sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(7,1fr)]">
          <div className="col-span-2 flex items-center bg-background px-6 py-5 sm:col-span-3 sm:px-10 lg:col-span-1 lg:px-8">
            <span className={cn(type.small, "relative z-20 leading-snug")}>
              Used by GTM and product teams at
            </span>
          </div>
          {trustedLogos.flat().map((logo) => {
            const mark = (
              <Image
                src={logo.src}
                alt={logo.name ? "" : `${logo.alt} logo`}
                width={logo.width}
                height={logo.height}
                // Fixed height in a narrow cell: the browser's max-width
                // caps the width, and without object-contain the mark is
                // squeezed rather than scaled down.
                className={`${logo.className} max-w-full object-contain`}
              />
            );
            return (
              <div
                key={logo.alt}
                className={cn(
                  "flex h-24 items-center justify-center bg-background px-4",
                  !logo.asIs && "[&_img]:brightness-0",
                  logo.wide && "max-lg:hidden",
                )}
              >
                {logo.name ? (
                  // A mark without a wordmark is set with its name.
                  <span className="relative z-20 flex items-center gap-2 opacity-70">
                    {mark}
                    <span className="text-[18px] font-semibold tracking-[-0.02em] text-black">
                      {logo.name}
                    </span>
                  </span>
                ) : (
                  <span className="contents [&_img]:relative [&_img]:z-20 [&_img]:opacity-70">
                    {mark}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Band>

      {/* ===== What pipe0 is, first under the customers: the three kinds
              of product it combines, by name, falling into one. A head
              and one drawing, in the page's own hairlines. ===== */}
      <Band>
        <SectionHead
          title={`Tables, MCP servers, and data APIs, forged into one\u00a0product. It makes sense the first time you try\u00a0it.`}
        />
        <LandingWell />
      </Band>

      {/* ===== What that makes possible: the three levels go-to-market
              work happens on, and what pipe0 does on each. ===== */}
      <Band>
        <SectionHead
          title="One framework for three levels of GTM. Faster and more accurate than any tool you've tried."
        />
        <LandingLevels />
      </Band>

      {/* ===== Surfaces ("Work anywhere."): the row of interface cards that
              moves sideways as the page scrolls. Commented out on purpose
              (Florian, 2026-11-13): the section is good, it just doesn't
              sit well on this page. The component is complete and unused,
              ready for another page: components/landing/landing-spotlight.
              It draws its own ground and rules, so it is not a Band.

      <LandingSpotlight />
          ===== */}

      {/* ===== The stack it replaces. No crosses: the levels' indigo row
              ends on this band's top corners. ===== */}
      <Band marks={false}>
        <SectionHead
          title="pipe0 replaces a tangled stack of tools like these with one system that builds GTM automation with AI."
        />
        <LandingReplaces />
      </Band>

      {/* ===== Proof: how much comes back and what it costs, side by
              side. From here the page stands on the muted ground. ===== */}
      <Band tone="muted">
        <SectionHead
          title={`Higher coverage than traditional waterfalls and ${CLAY_MULTIPLE} more cost\u2011efficient.`}
        />
        <LandingValue />
      </Band>

      {/* ===== Founder ===== */}
      <Band tone="muted">
        <LandingFounder />
      </Band>

      {/* ===== Questions ===== */}
      <Band tone="muted">
        <SectionHead title="Questions teams ask before switching." />
        <LandingFaq />
      </Band>

      <CloseBand />
    </>
  );
}
