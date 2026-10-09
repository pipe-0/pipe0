import { Cell, Cells, SectionHead } from "@/components/grid";
import { cn } from "@/lib/utils";
import type { CompareVideo } from "@/lib/compare/types";

/**
 * Supplementary videos on a comparison page. Each video is a 16:9 lazy
 * iframe (privacy-enhanced YouTube domain, no related-video rail) with the
 * title and a one-line description beneath it, one cell per video.
 */
export function CompareVideos({
  heading,
  videos,
}: {
  heading: string;
  videos: CompareVideo[];
}) {
  return (
    <>
      <SectionHead title={heading} />
      <Cells
        className={cn(
          "border-t border-[var(--rule)]",
          videos.length > 1 && "sm:grid-cols-2",
        )}
      >
        {videos.map((video) => (
          <Cell key={video.youtubeId} className="px-6 py-10 sm:px-10 lg:px-12">
            <figure className="m-0">
              <div className="relative aspect-video w-full overflow-hidden border border-[var(--rule)] bg-[var(--well)]">
                <iframe
                  className="absolute inset-0 h-full w-full border-0"
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <figcaption className="mt-5">
                <p className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
                  {video.title}
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                  {video.description}
                </p>
              </figcaption>
            </figure>
          </Cell>
        ))}
      </Cells>
    </>
  );
}
