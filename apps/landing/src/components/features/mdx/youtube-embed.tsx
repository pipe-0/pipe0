/**
 * Responsive YouTube embed for MDX. Renders as a 16:9 figure so it takes the
 * full media width of the page it sits on (in blog posts, wider than the
 * text column) and scales with the viewport instead of a fixed pixel height.
 *
 * `layout` is accepted for existing callers but no longer changes the size;
 * the aspect ratio does that.
 */
export function YoutubeEmbed({
  href,
  title = "YouTube video",
}: {
  href: string;
  title?: string;
  layout?: "normal" | "full";
}) {
  return (
    <figure className="m-0 w-full">
      <div className="relative w-full overflow-hidden rounded-xl bg-fd-muted aspect-video">
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={href}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </figure>
  );
}
