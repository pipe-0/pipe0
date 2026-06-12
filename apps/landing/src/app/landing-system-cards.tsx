import { providerCatalog } from "@pipe0/base";
import Image from "next/image";
import { Search } from "lucide-react";

/* Provider rows for the "Compose enrichments" marquee. */
const marqueeRowA = [
  "openai",
  "anthropic",
  "slack",
  "gmail",
  "perplexity",
  "googlemaps",
  "postgres",
] as const;
const marqueeRowB = [
  "databricks",
  "hunter",
  "firecrawl",
  "exa",
  "resend",
  "gemini",
  "crustdata",
] as const;

function ProviderTile({ id }: { id: string }) {
  const provider = providerCatalog[id as keyof typeof providerCatalog];
  if (!provider?.logoUrl) return null;
  return (
    <span className="grid size-13 shrink-0 place-items-center rounded-[12px] border border-[#1c2333]/10 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.06)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={provider.logoUrl}
        alt={provider.label}
        loading="lazy"
        className="size-7 object-contain"
      />
    </span>
  );
}

function MarqueeRow({
  ids,
  reverse,
  duration,
}: {
  ids: readonly string[];
  reverse?: boolean;
  duration: string;
}) {
  return (
    <div
      className="flex w-max"
      style={
        {
          "--duration": duration,
          "--gap": "14px",
          gap: "var(--gap)",
        } as React.CSSProperties
      }
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={
            "animate-marquee flex shrink-0 gap-[var(--gap)]" +
            (reverse ? " [animation-direction:reverse]" : "")
          }
        >
          {ids.map((id) => (
            <ProviderTile key={`${copy}-${id}`} id={id} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---- Card visuals ---- */

function FindVisual() {
  const queries = [
    "VP Sales · Berlin · SaaS",
    "Founders · Fintech · NYC",
    "AI Engineers · Remote · EU",
  ];
  return (
    <div className="relative h-full overflow-hidden bg-[linear-gradient(180deg,#9cc3f2_0%,#cfe4fb_60%,#e8f2fd_100%)]">
      {/* Static backdrop — softly blurred, with film grain on top */}
      <Image
        src="/media/website/background-1.png"
        alt=""
        aria-hidden
        width={1024}
        height={432}
        className="pointer-events-none absolute inset-0 h-full w-full scale-[1.04] select-none object-cover"
        style={{ filter: "blur(1.5px)" }}
      />
      <div className="grain-overlay pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent"
        aria-hidden
      />
      {/* Animated foreground — floating search pill cycling queries */}
      <div className="absolute inset-x-0 top-[18%] flex justify-center px-6">
        <div className="w-full max-w-[280px]">
          <div className="flex items-center gap-2.5 rounded-full border border-white/70 bg-white/90 px-4 py-2.5 shadow-[0_8px_24px_rgba(28,35,80,0.18)] backdrop-blur">
            <Search className="size-3.5 shrink-0 text-[#5b6478]" />
            <span className="relative h-[17px] flex-1 overflow-hidden text-[12.5px] font-medium text-[#1c2333]">
              {queries.map((q, i) => (
                <span
                  key={q}
                  className="search-query absolute inset-0 whitespace-nowrap"
                  style={{ ["--q-delay" as string]: `${i * 3 - 9}s` }}
                >
                  {q}
                </span>
              ))}
            </span>
          </div>
          <div className="mt-2.5 flex justify-center">
            <span className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-[10.5px] font-semibold text-[#2c356e] shadow-sm backdrop-blur">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              247 matches
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposeVisual() {
  return (
    <div className="relative flex h-full flex-col justify-center gap-3.5 overflow-hidden bg-[linear-gradient(180deg,var(--accent-soft)_0%,#f3f5fd_100%)] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <MarqueeRow ids={marqueeRowA} duration="30s" />
      <MarqueeRow ids={marqueeRowB} duration="38s" reverse />
      <MarqueeRow ids={[...marqueeRowB].reverse()} duration="26s" />
      {/* Static foreground — the composed pipe */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="rounded-[12px] border border-[#1c2333]/10 bg-white/92 px-4 py-3 shadow-[0_12px_32px_rgba(28,35,80,0.16)] backdrop-blur-sm">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5b6478]">
            One pipe
          </p>
          <p className="font-mono text-[11.5px] leading-relaxed text-[#2b3350]">
            work_email → <span className="text-[#2c37a4]">verify</span> →
            company_data
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionVisual() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[linear-gradient(180deg,var(--deep-2)_0%,var(--deep)_80%)] px-6">
      {/* Static skyline-style grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent"
        aria-hidden
      />
      {/* The demo plays inside a floating frame */}
      <div className="relative w-full max-w-[300px] overflow-hidden rounded-[12px] border border-white/14 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-1.5 border-b border-[#1c2333]/8 bg-[#f7f9fc] px-3 py-2">
          <span className="size-2 rounded-full bg-[#1c2333]/15" />
          <span className="size-2 rounded-full bg-[#1c2333]/15" />
          <span className="size-2 rounded-full bg-[#1c2333]/15" />
          <span className="ml-1.5 text-[10px] font-medium text-[#5b6478]">
            pipe0 · Actions
          </span>
        </div>
        <video
          className="block aspect-[16/10] w-full object-cover object-top"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          src="/media/website/provider-demo.webm"
        />
      </div>
    </div>
  );
}

/* ---- The grid ---- */

const cards = [
  {
    title: "Find who you're looking for",
    copy: "Search people and companies across every provider in a single query.",
    visual: <FindVisual />,
  },
  {
    title: "Compose enrichments & integrate",
    copy: "Stack hundreds of enrichments like work email, verification, and company data. Connect CRM, ATS, survey, and sequencing tools without writing code.",
    visual: <ComposeVisual />,
  },
  {
    title: "Take action",
    copy: "Send emails, Slack, and Discord messages. Take action with the tools your users love.",
    visual: <ActionVisual />,
  },
];

export function LandingSystemCards() {
  return (
    <div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <div
          key={card.title}
          className="rv min-w-0"
          style={{ ["--rv-delay" as string]: `${i * 80}ms` }}
        >
          <div className="stage-glossy relative mb-4 h-[260px] min-w-0 overflow-hidden rounded-[16px] border sm:h-[280px]">
            {card.visual}
          </div>
          <h3 className="mb-1.5 text-[16px] font-semibold tracking-[-0.01em] text-foreground">
            {card.title}
          </h3>
          <p className="max-w-[480px] text-sm leading-relaxed text-muted-foreground">
            {card.copy}
          </p>
        </div>
      ))}
    </div>
  );
}
