import { seo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { EventPill } from "@/components/landing/event-pill";
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
  Brackets,
  Break,
  BreakHead,
  GridCtas,
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
      {/* ===== Hero — the claim as the headline, then what the knife is
              made of: three products GTM teams know by name, forged into
              one. Three short sentences; the last is the invitation.
              ===== */}
      <Band>
        {/* One left-aligned column on one spacing scale: headline, then
            the answer, then the way in. Gaps step down as the type does
            (headline → lede 32px, lede → buttons 36px, buttons → note 14px)
            so each element is visibly attached to the one above it. */}
        <div className="flex flex-col items-center px-6 pb-10 pt-10 text-center sm:px-10 sm:pb-12 sm:pt-12 lg:px-12 lg:pb-12 lg:pt-14">
          <EventPill />
          {/* The claim, with the knife living in it: its tools are agents,
              and they flip out one by one (app/knife-loop.tsx). Two lines
              from sm; phones wrap freely, but the knife stays with its
              word. */}
          <h1 className="text-balance text-[9.4vw] font-medium leading-[1.06] tracking-[-0.045em] text-foreground sm:text-[clamp(40px,4.4vw,62px)]">
            The Swiss{" "}
            <span className="whitespace-nowrap">
              Army <KnifeLoop className="align-[-0.2em]" /> knife
            </span>
            <br className="max-sm:hidden" /> for agentic GTM.
          </h1>
          {/* What it is, in the three names buyers already use, then what
              that is for, then the invitation. */}
          <p
            className={cn(
              "mt-6 max-w-170 max-sm:-mx-3 sm:mx-auto sm:text-balance",
              type.lede,
            )}
          >
            Clay-like tables, a GTM MCP, and a B2B data API, forged into one
            system for every level of GTM. It makes sense the moment you
            try it.
          </p>
          <GridCtas className="mt-8 justify-center" />
        </div>
      </Band>

      {/* ===== Product film — the one saturated surface near the top.
              Not on phones: its type is unreadable that small, and the
              headline already carries a picture. The page goes straight
              from the hero to who uses it. ===== */}
      <Band className="max-sm:hidden">
        <div className="relative flex min-h-[calc(min(100vw-3rem,1320px)/2.3)] flex-col overflow-hidden">
          <div
            className="hero-sky pointer-events-none absolute inset-0 z-0"
            aria-hidden
          />
          <div className="relative z-10 flex flex-1 items-center px-4 py-10 sm:px-10">
            <HeroMorph />
          </div>
          <Brackets inset={14} tone="inverse" />
        </div>
      </Band>

      {/* ===== Customers — one cell per mark ===== */}
      <Band>
        {/* On desktop the label and seven marks make the first row, and
            eight marks the second, on the same columns. Below lg three
            marks drop, so twelve fill even rows (2 or 3 across). */}
        <div className="grid grid-cols-2 gap-px bg-[var(--rule)] sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(7,1fr)]">
          <div className="col-span-2 flex items-center bg-background px-6 py-5 sm:col-span-3 sm:px-10 lg:col-span-1 lg:px-8">
            <span className={cn(type.small, "leading-snug")}>
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
                  <span className="flex items-center gap-2 opacity-70">
                    {mark}
                    <span className="text-[18px] font-semibold tracking-[-0.02em] text-black">
                      {logo.name}
                    </span>
                  </span>
                ) : (
                  <span className="contents [&_img]:opacity-70">{mark}</span>
                )}
              </div>
            );
          })}
        </div>
      </Band>

      {/* ===== What pipe0 is, said early: the three levels go-to-market
              work happens on, and one figure for each. ===== */}
      <Band>
        <SectionHead
          title="Go-to-market happens on three levels."
          lede="A system that speeds up all three changes how big a team has to be."
        />
        <LandingLevels />
      </Band>

      {/* ===== The moment: the three building blocks of agentic GTM
              falling into one product. A head and one drawing, in the
              page's own hairlines. ===== */}
      <Band>
        <SectionHead
          title="Every GTM team is looking for its AI moment."
          lede="It happens when the building blocks of agentic GTM converge in one product."
        />
        <LandingWell />
      </Band>

      {/* ===== Surfaces ("Work anywhere."): the row of interface cards that
              moves sideways as the page scrolls. Commented out on purpose
              (Florian, 2026-11-13): the section is good, it just doesn't
              sit well on this page. The component is complete and unused,
              ready for another page: components/landing/landing-spotlight.
              It draws its own ground and rules, so it is not a Band.

      <LandingSpotlight />
          ===== */}

      {/* ===== The stack it replaces. Its second line is also where the
              page says, once and plainly, what pipe0 is. ===== */}
      <Band>
        <SectionHead
          title="From a tangled stack to one platform."
          lede="pipe0 is one system that builds GTM automation with AI. Enrichment, lists, routing, and sync in one place instead of spread across tools like these."
        />
        <LandingReplaces />
      </Band>

      {/* ===== Proof — a new part of the page, so a break from the grid:
              how much comes back and what it costs, on one screen. Its
              ground settles into the well, which the closing run of the
              page (founder, questions) stands on. ===== */}
      <Break into="well">
        <BreakHead
          title="More of your list found, for less."
          lede={`Higher coverage than traditional waterfalls, ${CLAY_MULTIPLE} more cost\u2011efficient.`}
        />
        <LandingValue />
      </Break>

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
