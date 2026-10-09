import { Cell, Cells, pad } from "@/components/grid";
import Link from "next/link";

/**
 * Questions buyers ask before they switch, answered in place.
 *
 * Static rather than an accordion: every answer is short, nothing jumps when
 * it is read, and search engines and answer engines see the whole text. The
 * same strings feed the page's FAQPage JSON-LD (see `faqItems`), so the
 * markup and the structured data can't drift apart.
 *
 * Each answer is a fact from the docs or the positioning evidence file; keep
 * it that way.
 */

export type Faq = {
  q: string;
  a: string;
  link?: { href: string; label: string };
};

export const faqItems: Faq[] = [
  {
    q: "Do I have to rebuild my Clay tables?",
    a: "No. Export the table as a CSV and import it into a sheet, or describe the workflow and let the agent add the columns. The rows you already enriched stay as they are.",
  },
  {
    q: "How is pipe0 different from Clay?",
    a: "Clay made spreadsheet enrichment mainstream and has the larger template library. pipe0 gives you the same table workflow with tables up to 2M records, plus a full API and MCP server on the same engine, so agents can build and run the work too.",
    link: { href: "/compare/pipe0-vs-clay", label: "Full comparison" },
  },
  {
    q: "How do you keep the data accurate?",
    a: "A waterfall stops at the first answer, so the first provider decides accuracy. We benchmark providers against premium data and only add one when it finds data the others miss. Before you send, run email verification as its own step.",
    link: { href: "/blog/cheapest-first-waterfall", label: "How we benchmark" },
  },
  {
    q: "Can pipe0 do CRM enrichment?",
    a: "Yes, without a separate product. Put a sheet on a schedule: pull the accounts created yesterday from HubSpot, Salesforce, or Attio, enrich them, and write the results back to the CRM.",
    link: { href: "/docs/sheets/schedules", label: "Schedules" },
  },
  {
    q: "Do I need a subscription?",
    a: "No. Buy credits as you go and they never expire. Monthly plans lower the price per credit when your volume grows.",
    link: { href: "/pricing", label: "Pricing" },
  },
  {
    q: "Can I take my data with me?",
    a: "Always. Export any sheet to CSV at any size, write rows back to HubSpot, Salesforce, or Attio, or read them over the API.",
  },
  {
    q: "Can I use my existing provider contracts?",
    a: "Yes. Store your own API key for a provider and pipe0 uses it instead of the managed connection, for a small platform fee per call.",
    link: { href: "/docs/connections", label: "Connections" },
  },
  {
    q: "Do I need to be technical?",
    a: "No. Most work starts as a sentence to the agent, and every column can be adjusted by hand. Engineers get the same engine as an API, a TypeScript SDK, and an MCP server.",
  },
];

export function LandingFaq({ items = faqItems }: { items?: Faq[] }) {
  return (
    <Cells className="border-t border-[var(--rule)] sm:grid-cols-2">
      {items.map((item) => (
        <Cell key={item.q} className={pad}>
          <h3 className="text-[18px] font-medium leading-snug tracking-[-0.015em] text-foreground">
            {item.q}
          </h3>
          <p className="mt-3 text-[15.5px] leading-relaxed text-muted-foreground">
            {item.a}
            {item.link && (
              <>
                {" "}
                <Link
                  href={item.link.href}
                  className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                >
                  {item.link.label}
                </Link>
              </>
            )}
          </p>
        </Cell>
      ))}
    </Cells>
  );
}
