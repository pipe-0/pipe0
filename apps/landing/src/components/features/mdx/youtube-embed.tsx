export function YoutubeEmbed({
  href,
  layout,
}: {
  href: string;
  layout: "normal" | "full";
}) {
  return (
    <iframe
      width="100%"
      height={layout === "full" ? "530" : "430"}
      src={href}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
