import { cn } from "@/lib/utils";
import type { CompareVideo } from "@/lib/compare/types";

/**
 * Supplementary videos on a comparison page. Each video is a 16:9 lazy
 * iframe (privacy-enhanced YouTube domain, no related-video rail) with the
 * title and a one-line description beneath it. One video spans the text
 * column; two or more sit in a grid.
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
      <h2 className="text-[clamp(22px,2.4vw,30px)] font-semibold tracking-[-0.02em] text-foreground">
        {heading}
      </h2>
      <div
        className={cn(
          "mt-10 grid gap-x-8 gap-y-10",
          videos.length > 1 && "sm:grid-cols-2",
        )}
      >
        {videos.map((video) => (
          <figure key={video.youtubeId} className="m-0">
            <div className="relative aspect-video w-full overflow-hidden rounded-[14px] border border-border bg-muted">
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
            <figcaption className="mt-4">
              <p className="text-[16px] font-semibold tracking-[-0.01em] text-foreground">
                {video.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {video.description}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
