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

const trustedLogos = [
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
        {/* Label plus seven marks on desktop; below lg Aries drops so six
            fill even rows (2 or 3 across). */}
        <div className="grid grid-cols-2 gap-px bg-[var(--rule)] sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(7,1fr)]">
          <div className="col-span-2 flex items-center bg-background px-6 py-5 sm:col-span-3 sm:px-10 lg:col-span-1 lg:px-8">
            <span className={cn(type.small, "leading-snug")}>
              Used by GTM and product teams at
            </span>
          </div>
          {trustedLogos.map((logo) => (
            <div
              key={logo.alt}
              className={`flex h-24 items-center justify-center bg-background px-4 [&_img]:opacity-70 [&_img]:brightness-0${logo.alt === "Aries" ? " max-lg:hidden" : ""}`}
            >
              <Image
                src={logo.src}
                alt={`${logo.alt} logo`}
                width={logo.width}
                height={logo.height}
                // Fixed height in a narrow cell: the browser's max-width
                // caps the width, and without object-contain the mark is
                // squeezed rather than scaled down.
                className={`${logo.className} max-w-full object-contain`}
              />
            </div>
          ))}
          {/* Mercor publishes only its mark, so it is set with its name. */}
          <div className="flex h-24 items-center justify-center bg-background px-4">
            <span className="flex items-center gap-2 opacity-70 [&_img]:brightness-0">
              <Image
                src="/media/website/logos/mercor-mark.svg"
                alt=""
                width={22}
                height={20}
                className="block h-5 w-auto"
              />
              <span className="text-[18px] font-semibold tracking-[-0.02em] text-black">
                Mercor
              </span>
            </span>
          </div>
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
