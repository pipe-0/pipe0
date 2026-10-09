import { FilmButton } from "@/app/product-film";
import { Cell, Cells } from "@/components/grid";
import Link from "next/link";

/**
 * Founder note — who is behind this, and the invitation to test.
 *
 * The note is Florian's own line from his emails to prospects (see the
 * positioning skill's language.md), not a testimonial. The bio facts are the
 * ones the skill approves; don't add funding, headcount or customer counts.
 */

const AVATAR =
  "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/9a5da7c5-b8e7-44fb-5070-f2b1c8842e00/catalogpreview";

export function LandingFounder() {
  return (
    <Cells className="lg:grid-cols-12">
      <Cell className="flex flex-col lg:col-span-4">
        <div className="flex flex-1 flex-col px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AVATAR}
              alt="Florian Martens"
              width={52}
              height={52}
              className="size-13 border border-[var(--rule)] object-cover grayscale"
            />
            <div>
              <Link
                href="/authors/florian-martens"
                className="text-[15.5px] font-medium text-foreground underline-offset-4 hover:underline"
              >
                Florian Martens
              </Link>
              <p className="text-[13.5px] text-muted-foreground">
                Founder · Berlin and San Francisco
              </p>
            </div>
          </div>
          <p className="mt-6 text-[14.5px] leading-relaxed text-muted-foreground">
            Built data pipelines at Cloudflare, then joined Cursor as its first
            growth engineering hire and built its GTM data platform.
          </p>
          <div className="mt-auto pt-8">
            <FilmButton film="intro" where="home-founder">
              Why we built it
            </FilmButton>
          </div>
        </div>
      </Cell>

      <Cell className="flex items-center px-6 py-14 sm:px-10 sm:py-20 lg:col-span-8 lg:px-16">
        <blockquote className="text-balance text-[clamp(20px,1.8vw,24px)] font-medium leading-[1.25] tracking-[-0.03em] text-foreground">
          &ldquo;Don&apos;t trust any vendor&apos;s find rate, ours included.
          Run a real list through pipe0 next to your current tool. If the
          difference isn&apos;t obvious, we did something wrong.&rdquo;
        </blockquote>
      </Cell>
    </Cells>
  );
}
