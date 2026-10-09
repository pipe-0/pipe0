import { Brackets, dotsStyle } from "@/components/grid";
import Image from "next/image";
import Link from "next/link";

/**
 * The three quickstart entry points, in the site's line-grid language: cells
 * that share 1px walls, each with a still Blender line drawing on the dotted
 * stage (assets/illustrations/lineart.py) and one line of copy. Still images
 * rather than recordings, so the page reads without anything moving.
 */
const entries = [
  {
    href: "/docs/pipe-catalog",
    title: "Pipe catalog",
    description: "Enrich rows: work emails, mobiles, company data, AI steps, and actions.",
    image: "/media/website/illustrations/catalog.png",
  },
  {
    href: "/docs/search-catalog",
    title: "Search catalog",
    description: "Create rows by searching for people and companies.",
    image: "/media/website/illustrations/search.png",
  },
  {
    href: "/docs/api",
    title: "API reference",
    description: "Every endpoint, generated from the OpenAPI spec.",
    image: "/media/website/illustrations/reference.png",
  },
];

export function QuickstartCards() {
  return (
    <div className="not-prose mb-8 mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-3">
      {entries.map((entry) => (
        <Link
          key={entry.href}
          href={entry.href}
          className="group flex flex-col bg-fd-background no-underline transition-colors hover:bg-[var(--well)]"
        >
          <div
            style={dotsStyle}
            className="relative m-3 mb-0 flex aspect-[16/10] items-center justify-center border border-[var(--rule)]"
          >
            <Brackets />
            <Image
              src={entry.image}
              alt=""
              width={1600}
              height={1200}
              sizes="(min-width: 640px) 240px, 80vw"
              className="h-auto w-[78%]"
            />
          </div>
          <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
            <span className="flex items-center justify-between text-[15px] font-medium text-fd-foreground">
              {entry.title}
              <span
                aria-hidden
                className="text-fd-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-fd-foreground"
              >
                &rarr;
              </span>
            </span>
            <span className="mt-1 text-[13.5px] leading-relaxed text-fd-muted-foreground">
              {entry.description}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
