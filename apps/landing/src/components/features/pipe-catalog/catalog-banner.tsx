import { Brackets, dotsStyle } from "@/components/grid";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Head of a catalog index: title, one sentence, the request link, and the
 * catalog's Blender line drawing on the dotted stage — the same pieces the
 * quickstart cards use, so the catalogs open the way the docs do.
 */
export function CatalogBanner({
  title,
  description,
  image,
  requestHref,
  requestLabel,
}: {
  title: string;
  description: string;
  image: string;
  requestHref: string;
  requestLabel: string;
}) {
  return (
    <div className="grid min-w-0 items-stretch gap-6 overflow-hidden rounded-[12px] border border-[var(--rule)] sm:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
      <div className="flex flex-col justify-center px-6 py-7 sm:px-8">
        <h1 className="text-[30px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground">
          {title}
        </h1>
        <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
        <Link
          href={requestHref}
          className="mt-5 inline-flex w-fit items-center gap-1 text-[14px] font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          {requestLabel}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
      <div
        style={dotsStyle}
        className="relative hidden items-center justify-center border-l border-[var(--rule)] sm:flex"
      >
        <Brackets />
        <Image
          src={image}
          alt=""
          width={1600}
          height={1200}
          sizes="300px"
          priority
          className="h-auto w-[82%]"
        />
      </div>
    </div>
  );
}
