import { HeroFilm } from "@/app/hero-film";
import { LandingEconomics } from "@/app/landing-economics";
import { LandingFaq, faqItems } from "@/app/landing-faq";
import { LandingFounder } from "@/app/landing-founder";
import { LandingPaths } from "@/app/landing-paths";
import { LandingProof } from "@/app/landing-proof";
import { LandingReplaces } from "@/app/landing-replaces";
import { LandingSpotlight } from "@/app/landing-spotlight";
import { LandingStatement } from "@/app/landing-statement";
import {
  Band,
  Brackets,
  GridCtas,
  dotsStyle,
  SectionHead,
} from "@/components/grid";
import { CloseBand, LandingShell } from "@/components/landing-shell";
import { createMetadata } from "@/lib/metadata";
import {
  JsonLd,
  faqJsonLd,
  softwareApplicationJsonLd,
} from "@/components/seo/json-ld";
import Image from "next/image";

const homeDescription =
  "Turns any GTM play or data idea into a production system with pipe0. Find and enrich B2B contacts across 50+ providers, build Clay-like tables, and run automations from an agent, the API, or MCP. Pay only for results.";

// Title is omitted so the root default applies verbatim (no template suffix).
export const metadata = createMetadata({
  description: homeDescription,
  path: "/",
});

/* The cost multiple vs Clay, as the founder states it in the 2026-10 pitch.
   The positioning skill's evidence file still approves "3–10x"; update
   evidence.md with the source for this range, or change it back here. */
const CLAY_MULTIPLE = "6–12x";

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

export default function Home() {
  return (
    <LandingShell page="product">
      <JsonLd
        data={softwareApplicationJsonLd({ description: homeDescription })}
      />
      <JsonLd
        data={faqJsonLd(
          faqItems.map((f) => ({ q: f.q, a: f.a })),
        )}
      />

      {/* ===== Hero — the problem as the headline, the answer as one
              sentence, then the way in. Nothing else competes. ===== */}
      <Band>
        {/* One left-aligned column on one spacing scale: headline, then
            the answer, then the way in. Gaps step down as the type does
            (headline → lede 32px, lede → buttons 36px, buttons → note 14px)
            so each element is visibly attached to the one above it. */}
        <div className="flex flex-col items-center px-6 pb-10 pt-10 text-center sm:px-10 sm:pb-12 sm:pt-12 lg:px-12 lg:pb-12 lg:pt-14">
          {/* The second sentence is the point — the buyer's own situation —
              so it carries the ink and the scale; the first is the muted
              context it lands against. Two lines on desktop, never more. */}
          <h1 className="font-medium">
            {/* Phones: both lines one size, sized to the viewport so the
                longer one still fits on one line. */}
            <span className="block whitespace-nowrap text-[5.9vw] leading-[1.08] sm:whitespace-normal tracking-[-0.04em] text-[var(--mark)] sm:text-balance sm:text-[clamp(24px,2.4vw,34px)]">
              Agents make engineers 10x faster.
            </span>
            <span className="mt-1 block whitespace-nowrap text-[5.9vw] leading-[1.08] tracking-[-0.045em] text-foreground sm:whitespace-normal sm:text-balance sm:text-[clamp(26px,2.8vw,40px)] lg:whitespace-nowrap">
              GTM teams are still waiting.
            </span>
          </h1>
          <p className="mt-6 max-w-[680px] text-[16px] max-sm:-mx-3 sm:mx-auto sm:text-balance leading-[1.55] text-muted-foreground sm:text-[19px]">
            Turn any GTM play or data idea into a production system with pipe0.
            Describe it, and the agent builds something you can see, change,
            and trust.
          </p>
          <GridCtas className="mt-8 justify-center" />
        </div>
      </Band>

      {/* ===== Product film — the one saturated surface near the top.
              Phones get an animated Blender board instead: the film's type
              is unreadable that small. ===== */}
      <Band>
        <div className="px-4 py-4 sm:hidden">
          <div
            style={dotsStyle}
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[14px] border border-[var(--rule)]"
          >
            <Brackets />
            {/* Blender loop (assets/illustrations/board_anim.py): cells of a
                sheet fill in one by one, with gaps where nothing was found.
                Rendered on white and multiplied onto the dotted stage. */}
            <video
              src="/media/website/illustrations/board.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Cells of a sheet filling in as data is found"
              width={800}
              height={600}
              className="h-auto w-[92%] mix-blend-multiply"
            />
          </div>
        </div>
        <div className="relative hidden min-h-[calc(min(100vw-3rem,1320px)/2.3)] flex-col overflow-hidden sm:flex">
          <div
            className="hero-sky pointer-events-none absolute inset-0 z-0"
            aria-hidden
          />
          <div className="relative z-10 flex flex-1 items-center px-4 py-10 sm:px-10">
            <HeroFilm />
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
            <span className="text-[14px] leading-snug text-muted-foreground">
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
                className={logo.className}
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
              <span className="text-[19px] font-semibold tracking-[-0.02em] text-black">
                Mercor
              </span>
            </span>
          </div>
        </div>
      </Band>

      {/* ===== Statement — pinned, revealed word by word. One of the page's
              two pinned sections; keep it to two. ===== */}
      <Band>
        <LandingStatement />
      </Band>

      {/* ===== The tradeoff, and the two surfaces it produces ===== */}
      <Band>
        <SectionHead
          title="One interface for your team and your agents."
          lede="GTM tools are built for people or for agents. pipe0 is native to both: describe a play, and the agent builds a system you can see, change, and trust."
        />
        <LandingPaths />
      </Band>

      {/* ===== The stack it replaces ===== */}
      <Band>
        <LandingReplaces />
      </Band>

      {/* ===== Coverage ===== */}
      <Band>
        <SectionHead
          title="More of your list, found."
          lede="Same 150 people, two waterfalls. The difference is which providers ask first."
        />
        <LandingProof />
      </Band>

      {/* ===== Surfaces — the page's second pinned section ===== */}
      <Band>
        <SectionHead
          title="Work anywhere."
          lede="The app, your coding agent, Slack, or your own code. Every surface runs on the same data model."
        />
        {/* No side padding and no rule of its own: the folder's tab row
            is the boundary under the heading, and its pages share the
            rails. */}
        <div className="sm:-mt-8">
          <LandingSpotlight />
        </div>
      </Band>

      {/* ===== Cost ===== */}
      <Band>
        <SectionHead
          title={`${CLAY_MULTIPLE} more cost\u2011efficient than Clay.`}
          lede="Premium enrichment data, pay as you go. No subscription required, and you pay only for data a provider found."
        />
        <LandingEconomics />
      </Band>

      {/* ===== A pause: a real gap after pricing, then the closing run of
              the page (founder, questions) on the muted well. ===== */}
      <div
        aria-hidden
        className="h-16 border-b border-[var(--rule)] bg-[var(--well)] sm:h-24"
      />

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
    </LandingShell>
  );
}
