import { Brackets, dotsStyle } from "@/components/grid";
import Image from "next/image";

/**
 * A still Blender line drawing (assets/illustrations/lineart.py) on the
 * dotted stage, as a docs page header.
 */
export function DocsIllustration({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={dotsStyle}
      className="not-prose relative mb-8 flex justify-center border border-[var(--rule)] px-4 py-6 sm:py-8"
    >
      <Brackets />
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1200}
        priority
        sizes="(min-width: 1024px) 360px, 70vw"
        className="h-auto w-full max-w-[360px]"
      />
    </div>
  );
}
