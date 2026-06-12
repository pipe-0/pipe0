import { providerCatalog } from "@pipe0/base";

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
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden px-6">
      {/* Shared animated indigo background */}
      <div className="card-sky absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent"
        aria-hidden
      />
      {/* Search demo, centered in a floating frame */}
      <div className="relative w-full max-w-[300px] overflow-hidden rounded-[12px] border border-white/20 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
        <video
          className="block h-auto w-full"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          src="/media/website/search-demo.webm"
        />
      </div>
    </div>
  );
}

function ComposeVisual() {
  return (
    <div className="relative flex h-full flex-col justify-center gap-3.5 overflow-hidden">
      {/* Shared animated indigo background */}
      <div className="card-sky absolute inset-0" aria-hidden />
      <div className="relative flex flex-col gap-3.5">
        <MarqueeRow ids={marqueeRowA} duration="30s" />
        <MarqueeRow ids={marqueeRowB} duration="38s" reverse />
        <MarqueeRow ids={[...marqueeRowB].reverse()} duration="26s" />
      </div>
      {/* Dark edge scrims so the marquee fades into the indigo, like the hero */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#11163f] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#11163f] to-transparent"
        aria-hidden
      />
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
    <div className="relative flex h-full items-center justify-center overflow-hidden px-6">
      {/* Shared animated indigo background */}
      <div className="card-sky absolute inset-0" aria-hidden />
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
