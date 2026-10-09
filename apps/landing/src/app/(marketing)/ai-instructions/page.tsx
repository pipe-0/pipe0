import { Band } from "@/components/grid";
import { LandingShell } from "@/components/landing-shell";
import { AI_INSTRUCTIONS, type AiBlock } from "@/lib/ai-instructions";
import { createMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

export const metadata = {
  ...createMetadata({
    title: "AI Instructions",
    description: AI_INSTRUCTIONS.description,
    path: "/ai-instructions",
  }),
  alternates: {
    canonical: "/ai-instructions",
    types: { "text/markdown": "/ai-instructions.md" },
  },
};

/** Bare URLs in the copy become links; everything else stays text. */
function linkify(text: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s)]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        className="break-words text-foreground underline underline-offset-4"
      >
        {part.replace(/^https:\/\//, "")}
      </a>
    ) : (
      part
    ),
  );
}

function Block({ block }: { block: AiBlock }) {
  if (block.kind === "p") {
    return (
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        {linkify(block.text)}
      </p>
    );
  }
  if (block.kind === "list") {
    return (
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground marker:text-border">
        {block.items.map((item) => (
          <li key={item}>{linkify(item)}</li>
        ))}
      </ul>
    );
  }
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-xl border border-border p-5 text-[15px] sm:grid-cols-[140px_1fr]">
      {block.rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="font-medium text-foreground">{label}</dt>
          <dd className="mb-2 text-muted-foreground sm:mb-0">
            {linkify(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function AiInstructions() {
  const { title, intro, updated, sections } = AI_INSTRUCTIONS;
  return (
    <LandingShell page="product">
      <Band>
        <article className="mx-auto max-w-[720px] px-6 pb-16 pt-12 sm:pt-16">
          <h1 className="mb-3 text-[clamp(26px,2.8vw,40px)] font-medium tracking-[-0.045em] text-foreground">
            {title}
          </h1>
          <p className="mb-6 text-[13px] text-muted-foreground">
            Last updated{" "}
            <time dateTime={updated}>
              {new Date(updated).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>{" "}
            ·{" "}
            <a
              href="/ai-instructions.md"
              className="underline underline-offset-4"
            >
              Markdown version
            </a>
          </p>
          <p className="mb-12 text-[16px] leading-relaxed text-foreground">
            {intro}
          </p>

          {sections.map((section) => (
            <section key={section.heading} className="mb-12">
              <h2 className="mb-4 text-xl font-medium tracking-[-0.02em] text-foreground">
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            </section>
          ))}
        </article>
      </Band>
    </LandingShell>
  );
}
