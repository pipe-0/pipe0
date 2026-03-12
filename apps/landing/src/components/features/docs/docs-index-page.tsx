import { LogoRawSmall } from "@/components/logo";
import { docsLinkPaths } from "@pipe0/docs-links";
import { ArrowRight, BookOpen, Search, Zap } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    title: "Framework",
    description:
      "Learn the basics of Pipe0. Set up your API key, make your first request, and understand the core concepts.",
    href: "/docs/introduction",
    icon: BookOpen,
  },
  {
    title: "Enrich",
    description:
      "Find emails, phone numbers, company data, and more from multiple providers.",
    href: docsLinkPaths.pipeCatalog,
    icon: Zap,
  },
  {
    title: "Search",
    description:
      "Search for people and companies across multiple datasets. Build prospect lists with flexible filters.",
    href: docsLinkPaths.searchCatalog,
    icon: Search,
  },
];

export function DocsIndexPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="pb-16 md:pb-8">
        <div className="flex items-center gap-2">
          <LogoRawSmall className="mt-0 mb-0" />
          <h1 className="text-3xl md:text-3xl font-bold tracking-tight mb-0">
            Docs
          </h1>
        </div>
        <p className="text-muted-foreground text-md md:text-lg max-w-2xl mb-4">
          Pipe0 is a data enrichment and automation framework. Search for leads,
          enrich records, and automate workflows.
        </p>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group relative flex flex-col gap-3 rounded-lg border bg-card p-5 no-underline transition-colors hover:border-foreground/20 hover:bg-accent/40"
          >
            <div className="flex items-center justify-between">
              <section.icon
                className="size-4 text-muted-foreground"
                strokeWidth={1.5}
              />
              <ArrowRight className="size-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </div>
            <div>
              <h2 className="text-sm font-medium mb-1">{section.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
