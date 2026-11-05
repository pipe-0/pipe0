import { Plus } from "lucide-react";

type FaqItem = { q: string; a: string };

/**
 * Post FAQ: a numbered accordion, closed by default. Built on native
 * `<details>` so it needs no client JS and every answer stays in the HTML
 * for crawlers even while collapsed. FAQPage structured data is emitted
 * separately by the page.
 */
export function PostFaq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="post-faq" className="mx-auto mt-20 max-w-[680px]">
      <h2
        id="post-faq"
        className="font-blog mx-auto max-w-[320px] text-center text-[34px] font-medium leading-[1.05] tracking-[-0.03em] text-fd-foreground text-balance sm:text-[42px]"
      >
        Frequently asked questions
      </h2>

      <div className="mt-12 border-t border-fd-border">
        {items.map((item, i) => (
          <details
            key={item.q}
            className="group border-b border-fd-border"
          >
            <summary className="flex cursor-pointer list-none items-center gap-4 py-5 outline-none [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fd-muted font-mono text-[11px] tabular-nums text-fd-muted-foreground"
              >
                {i + 1}
              </span>
              <span className="font-blog flex-1 text-[16px] font-medium leading-snug text-fd-foreground sm:text-[17px]">
                {item.q}
              </span>
              <Plus
                aria-hidden
                strokeWidth={2.25}
                className="size-4 shrink-0 text-fd-foreground transition-transform duration-200 group-open:rotate-45"
              />
            </summary>
            <p className="pb-6 pl-10 pr-8 text-[15px] leading-[1.65] text-fd-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
