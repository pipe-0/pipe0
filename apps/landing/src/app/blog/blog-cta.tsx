import CalButton from "@/components/cal-button";
import { LogoRawSmall } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { appInfo } from "@/lib/const";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Database,
  Infinity as InfinityIcon,
  Plus,
  Search,
  Type,
} from "lucide-react";
import Link from "next/link";

/** Closing CTA — headline, a miniature of the real sheet, one CTA. */
export function BlogCta() {
  return (
    <section className="mt-20 border-t border-fd-border">
      {/* Same container as the HomeLayout header: --fd-layout-width + px-4 */}
      <div className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-12 text-center md:py-14">
        <div className="rounded-2xl bg-fd-muted px-5 pt-12 pb-8 sm:px-10 sm:pt-14">
          <h2 className="font-blog text-[24px] font-bold leading-[1.2] tracking-[-0.005em] text-fd-foreground text-pretty sm:text-[30px]">
            Next-gen enrichment &amp; search.
          </h2>
          <p className="mt-2.5 text-[14.5px] text-fd-muted-foreground">
            Build revenue systems that scale. For humans, agents, and apps. Replace tools like Clay, n8n, Hightouch, etc.
          </p>

          <MiniSheet />

          <div className="mt-8 flex justify-center">
            <Link
              href={appInfo.links.signupUrl}
              rel="nofollow"
              className={cn(
                buttonVariants({ variant: "cta", size: "xl" }),
                "gap-2.5",
              )}
            >
              <LogoRawSmall className="w-5" />
              Try pipe0
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 border-t border-fd-border pt-4 text-[13px] text-fd-muted-foreground">
            Using pipe0 at work?{" "}
            <CalButton
              variant="link"
              className="h-auto p-0 text-[13px] font-normal text-fd-muted-foreground underline underline-offset-[3px] transition-colors hover:text-fd-foreground"
            >
              Book a demo
            </CalButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Grid templates shared by every sheet row — checkbox · Name · Company · pipe
   column. Company drops out below sm. */
const sheetCols =
  "grid grid-cols-[34px_100px_minmax(0,1fr)] sm:grid-cols-[38px_140px_160px_minmax(0,1fr)]";

function SheetCheckbox() {
  return (
    <span className="grid place-items-center border-r border-fd-border">
      <span className="size-3.5 rounded-[3px] border border-fd-border bg-fd-background" />
    </span>
  );
}

/** Overlapping provider tiles — the waterfall widget from the real app. */
const PROVIDER_TILES = {
  H: "bg-orange-500",
  D: "bg-sky-600",
} as const;

function ProviderTiles({ only }: { only?: keyof typeof PROVIDER_TILES }) {
  const shown = only ? [only] : (["H", "D"] as const);
  return (
    <span className="flex shrink-0 -space-x-1">
      {shown.map((p) => (
        <span
          key={p}
          className={cn(
            "grid size-4 place-items-center rounded-[4px] text-[8px] font-bold text-white ring-2 ring-fd-background",
            PROVIDER_TILES[p],
          )}
        >
          {p}
        </span>
      ))}
    </span>
  );
}

/**
 * A faithful miniature of the dashboard's sheet: selection column,
 * two-tier headers (flat "Input" group, rounded tab for the pipe with its
 * provider tiles), field-type icons, inline statuses, "New empty row".
 */
function MiniSheet() {
  const leafHeader =
    "flex items-center gap-1 border-r border-fd-border px-2 text-xs text-fd-muted-foreground";

  return (
    <div className="mx-auto mt-9 max-w-[780px] overflow-hidden rounded-xl bg-fd-background text-left ring-1 ring-fd-foreground/10">
      {/* Toolbar — selection scope pill, catalog buttons, Run */}
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <span className="flex h-7 items-center gap-1 rounded-md border border-fd-border bg-fd-muted px-2 text-xs text-fd-muted-foreground">
          <InfinityIcon className="size-3.5" />
          selected
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="hidden h-7 items-center gap-1.5 rounded-md bg-fd-secondary px-2.5 text-xs font-medium text-fd-secondary-foreground sm:flex">
            <Database className="size-3" />
            Pipes
          </span>
          <span className="hidden h-7 items-center gap-1.5 rounded-md bg-fd-secondary px-2.5 text-xs font-medium text-fd-secondary-foreground sm:flex">
            <Search className="size-3" />
            Search
          </span>
          <span className="flex h-7 min-w-14 items-center justify-center rounded-md border border-fd-primary bg-fd-primary px-3 text-xs font-medium text-fd-primary-foreground">
            Run
          </span>
        </span>
      </div>

      {/* Tier 0 — column groups: flat "Input", rounded tab for the pipe */}
      <div className={cn(sheetCols, "h-8 items-stretch border-t bg-fd-muted")}>
        <span />
        <span className="flex items-center px-2 text-xs text-fd-muted-foreground sm:col-span-2">
          Input
        </span>
        <span className="-mb-px flex min-w-0 items-center gap-1.5 rounded-t-lg border-x border-t border-fd-border bg-fd-background px-2">
          <ProviderTiles />
          <span className="truncate text-xs text-fd-foreground">
            Find work email
          </span>
        </span>
      </div>

      {/* Tier 1 — field columns with type icons */}
      <div className={cn(sheetCols, "h-8 border-y border-fd-border")}>
        <SheetCheckbox />
        <span className={leafHeader}>
          <Type className="size-3" />
          Name
        </span>
        <span className={cn(leafHeader, "hidden sm:flex")}>
          <Type className="size-3" />
          Company
        </span>
        <span className="flex items-center gap-1 px-2 text-xs text-fd-muted-foreground">
          <Type className="size-3" />
          Work email
        </span>
      </div>

      {/* Rows — completed cells carry the resolving provider's tile */}
      {(
        [
          ["Ada Byrne", "acme.io", "a.byrne@acme.io", "H"],
          ["Leo Costa", "northbeam.co", "l.costa@northbeam.co", "D"],
          ["Mia Chen", "parlor.dev", null, null],
        ] as const
      ).map(([name, company, email, provider]) => (
        <div
          key={name}
          className={cn(
            sheetCols,
            "h-9 items-stretch border-b border-fd-border text-[13px] text-fd-foreground",
          )}
        >
          <SheetCheckbox />
          <span className="flex items-center truncate border-r border-fd-border px-2">
            {name}
          </span>
          <span className="hidden items-center truncate border-r border-fd-border px-2 sm:flex">
            {company}
          </span>
          {email ? (
            <span className="flex min-w-0 items-center gap-1.5 px-2">
              <ProviderTiles only={provider!} />
              <span className="truncate">{email}</span>
            </span>
          ) : (
            <span className="flex items-center px-2 text-fd-muted-foreground">
              Running...
            </span>
          )}
        </div>
      ))}

      {/* Footer — the add-row affordance */}
      <span className="flex items-center gap-1 px-2.5 py-2 text-xs text-fd-muted-foreground">
        <Plus className="size-3.5" />
        New empty row
      </span>
    </div>
  );
}
