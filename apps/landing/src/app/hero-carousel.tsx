"use client";

import { DynamicCodeBlock } from "@/components/features/docs/dynamic-code-block";
import { cn } from "@/lib/utils";
import { Braces, FormInput, Sparkle, Sparkles } from "lucide-react";
import { useState, type ComponentType } from "react";

type Slide = {
  id: "api" | "mcp" | "form";
  label: string;
  icon: ComponentType<{ className?: string }>;
  visual: React.ReactNode;
  headline: React.ReactNode;
  body: React.ReactNode;
};

const apiCode = `// Find work email and company description
const response = await zero.pipes.pipe({
    pipes: [
      {
        pipe_id: "people:workemail:waterfall@1"
      },
      {
        pipe_id: "company:description@1"
      }
    ],
    input: [
      {
        id: "1",
        name: "John Doe",
        company_name: "Pipe0"
      }
    ],
  });`;

function ApiVisual() {
  return (
    <DynamicCodeBlock
      className="my-0 rounded-sm"
      lang="typescript"
      code={apiCode}
    />
  );
}

function McpVisual() {
  return (
    <div className="bg-background border rounded-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-xs text-muted-foreground">
            pipe0/mcp
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          connected
        </span>
      </div>

      <div className="p-4 grow flex flex-col gap-3">
        <div className="text-sm leading-relaxed">
          Find <span className="text-foreground">100 software engineers</span>{" "}
          in <span className="text-foreground">Berlin</span> working for{" "}
          <span className="text-foreground">Google</span>. Fetch their{" "}
          <span className="text-foreground">work email addresses</span> and{" "}
          <span className="text-foreground">phone numbers</span>.
        </div>

        <div className="border bg-accent/40 rounded-sm px-3 py-2 flex items-start gap-2">
          <Sparkle className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="font-mono text-[11px] text-muted-foreground leading-relaxed">
            <span className="text-foreground">pipe0.search</span>
            (provider:&quot;crustdata&quot;, role:&quot;software_engineer&quot;,
            company:&quot;google&quot;, location:&quot;berlin&quot;, limit:100)
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t px-3 py-2 bg-accent/30">
        <span className="text-[11px] text-muted-foreground">Works with</span>
        <div className="flex items-center gap-3 [&_svg]:size-3.5 [&_svg]:text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CursorIcon />
            <span className="text-[11px]">Cursor</span>
          </div>
          <span className="text-muted-foreground/40">·</span>
          <div className="flex items-center gap-1.5">
            <ClaudeIcon />
            <span className="text-[11px]">Claude Code</span>
          </div>
          <span className="text-muted-foreground/40">·</span>
          <div className="flex items-center gap-1.5">
            <CodexIcon />
            <span className="text-[11px]">Codex</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormVisual() {
  return (
    <div className="bg-background border rounded-sm overflow-hidden flex flex-col">
      <div className="border-b px-4 py-3 flex items-center gap-2">
        <Sparkle className="size-3.5 text-muted-foreground" />
        <span className="text-sm font-medium">Find work email</span>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          @pipe0/elements-react
        </span>
      </div>

      <div className="p-4 space-y-3">
        <FormField label="Full name" value="John Doe" />
        <FormField label="Company name" value="Pipe0" />
        <FormField label="Domain" value="pipe0.com" hint="Optional" />
      </div>

      <div className="border-t p-3">
        <button
          type="button"
          tabIndex={-1}
          className="w-full bg-foreground text-background text-sm py-2 rounded-sm font-medium pointer-events-none"
        >
          Run waterfall
        </button>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground">{label}</label>
        {hint && (
          <span className="text-[10px] text-muted-foreground/70">{hint}</span>
        )}
      </div>
      <div className="border border-input rounded-sm px-3 py-2 text-sm bg-accent/20">
        {value}
      </div>
    </div>
  );
}

function CursorIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <title>Cursor</title>
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <title>Claude</title>
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

function CodexIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Codex</title>
      <path d="M12 2.5 3 7v10l9 4.5 9-4.5V7l-9-4.5Z" />
      <path d="m8.5 10.25-2.25 1.75 2.25 1.75M15.5 10.25l2.25 1.75-2.25 1.75M13.5 9.5l-3 5" />
    </svg>
  );
}

const slides: Slide[] = [
  {
    id: "api",
    label: "API",
    icon: Braces,
    visual: <ApiVisual />,
    headline: (
      <>
        The <span className="font-serif italic">next generation</span> of CRMs
        &amp; ATSs is built on{" "}
        <span className="text-foreground">
          instant access to world-class enrichment &amp; prospecting.
        </span>
      </>
    ),
    body: (
      <>
        Add clay-like data enrichment with{" "}
        <span className="text-foreground">
          50+ providers, actions &amp; conditions
        </span>{" "}
        to your application. <span className="text-foreground">Fast</span>.
      </>
    ),
  },
  {
    id: "mcp",
    label: "MCP Server",
    icon: Sparkles,
    visual: <McpVisual />,
    headline: (
      <>
        Give your <span className="font-serif italic">agents</span> the same
        tools your team uses.{" "}
        <span className="text-foreground">
          One MCP server, every enrichment.
        </span>
      </>
    ),
    body: (
      <>
        Plug{" "}
        <span className="text-foreground">Cursor, Claude Code, and Codex</span>{" "}
        into the entire pipe0 catalog.{" "}
        <span className="text-foreground">No glue code.</span>
      </>
    ),
  },
  {
    id: "form",
    label: "Form UI",
    icon: FormInput,
    visual: <FormVisual />,
    headline: (
      <>
        Stop building <span className="font-serif italic">autocompletes</span>{" "}
        and search forms.{" "}
        <span className="text-foreground">
          Drop in headless components instead.
        </span>
      </>
    ),
    body: (
      <>
        <span className="text-foreground">@pipe0/elements-react</span> renders
        production-ready, fully composable forms for every pipe and search.
      </>
    ),
  },
];

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = slides[activeIndex];

  return (
    <div className="flex flex-col overflow-hidden lg:col-span-4 bg-accent border">
      <div
        className="flex items-center gap-1 p-1.5"
        role="tablist"
        aria-label="Integration examples"
      >
        {slides.map((slide, i) => {
          const isActive = i === activeIndex;
          const Icon = slide.icon;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-sm transition-colors",
                isActive
                  ? "bg-background border border-border/60 text-foreground shadow-xs"
                  : "border border-transparent text-muted-foreground hover:text-foreground hover:bg-background/40",
              )}
            >
              <Icon className="size-3.5" />
              {slide.label}
            </button>
          );
        })}
      </div>

      <div className="p-1">
        <div key={active.id} className="hero-slide-fade">
          {active.visual}
        </div>
      </div>

      <div className="p-4 max-w-lg grow flex flex-col justify-end gap-2 pt-12">
        <div key={`${active.id}-text`} className="hero-slide-fade space-y-2">
          <h2 className="text-2xl md:text-2xl tracking-tight">
            {active.headline}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {active.body}
          </p>
        </div>
      </div>
    </div>
  );
}
