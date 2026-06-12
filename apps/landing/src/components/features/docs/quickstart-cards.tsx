"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Library, Search, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * The three quickstart entry points, rendered as media cards: the catalogs
 * play short product recordings, the API Reference shows an animated code
 * sample echoing the marketing site. Drop into the docs index in place of the
 * default `<Cards>`.
 */
export function QuickstartCards() {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <QuickstartCard
        href="/docs/pipe-catalog"
        icon={<Zap className="size-4" />}
        title="Pipe Catalog"
        description="Every enrichment, with input/output fields and pricing."
        media={<DemoVideo src="/media/website/pipe-catalog-demo.webm" />}
      />
      <QuickstartCard
        href="/docs/search-catalog"
        icon={<Search className="size-4" />}
        title="Search Catalog"
        description="Every dataset, with filters and pricing."
        media={<DemoVideo src="/media/website/search-catalog-demo.webm" />}
      />
      <QuickstartCard
        href="/docs/api"
        icon={<Library className="size-4" />}
        title="API Reference"
        description="Public API endpoints."
        media={<CodeWindow />}
      />
    </div>
  );
}

function QuickstartCard({
  href,
  icon,
  title,
  description,
  media,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  media: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border bg-fd-card no-underline transition-colors hover:border-fd-primary/40 hover:bg-fd-accent"
    >
      {/* Indigo stage — the demo floats here, echoing the landing-page cards */}
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b p-5">
        <div className="card-sky absolute inset-0" aria-hidden />
        {media}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md border bg-fd-secondary text-fd-secondary-foreground">
            {icon}
          </span>
          <span className="text-sm font-medium text-fd-card-foreground">
            {title}
          </span>
          {/* Navigation affordance */}
          <ArrowUpRight className="ml-auto size-4 text-fd-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fd-foreground" />
        </div>
        <p className="text-sm text-fd-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

function DemoVideo({ src }: { src: string }) {
  return (
    <div className="relative w-full max-w-[240px] overflow-hidden rounded-[10px] border border-white/20 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      <video
        className="block h-auto w-full"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src={src}
      />
    </div>
  );
}

/* ---- Animated code sample (echoes the marketing CodebasePane) ---- */

const codeLines: React.ReactNode[] = [
  <>
    <span className="text-indigo-300">const</span> res ={" "}
    <span className="text-indigo-300">await</span> pipe0.pipes.
    <span className="text-sky-300">run</span>({"{"}
  </>,
  <>{"  pipes: ["}</>,
  <>
    {"    { pipe_id: "}
    <span className="text-emerald-300">&quot;people:workemail@1&quot;</span>
    {" },"}
  </>,
  <>{"  ],"}</>,
  <>
    {"  input: [{ name: "}
    <span className="text-emerald-300">&quot;John Doe&quot;</span>
    {" }],"}
  </>,
  <>{"});"}</>,
];

function CodeWindow() {
  // Starts on the full sample (also the SSR / reduced-motion state); the first
  // tick wraps back to 0 and types the lines in on a loop.
  const [shown, setShown] = useState(codeLines.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let line = codeLines.length;
    const id = window.setInterval(() => {
      line = line >= codeLines.length ? 0 : line + 1;
      setShown(line);
    }, 700);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative w-full max-w-[260px] overflow-hidden rounded-[10px] border border-white/15 bg-[linear-gradient(160deg,#232a8a_0%,#10143f_92%)] p-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-1.5 pb-3">
        <span className="size-2 rounded-full bg-white/25" />
        <span className="size-2 rounded-full bg-white/25" />
        <span className="size-2 rounded-full bg-white/25" />
        <span className="ml-1.5 font-mono text-[10px] text-white/45">
          enrich.ts
        </span>
      </div>
      <pre className="overflow-hidden font-mono text-[11px] leading-relaxed text-white/85">
        <code>
          {codeLines.map((content, i) => (
            <div
              key={i}
              className={cn(
                "transition-opacity duration-300",
                i < shown ? "opacity-100" : "opacity-0",
              )}
            >
              {content}
              {i === shown - 1 && (
                <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-sky-300/80" />
              )}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
