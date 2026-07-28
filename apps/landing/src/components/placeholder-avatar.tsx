/**
 * Placeholder avatar for the demo Slack messages.
 *
 * An abstract silhouette rather than a photo: the people in these scenes are
 * illustrative, and a real face would be either someone's likeness we have no
 * right to use or an obvious AI portrait. Initials read as a fallback — a
 * missing avatar — which is exactly what we do not want to show.
 *
 * The rounding and the wash live on the wrapper so the SVG needs no clipPath
 * or gradient, and therefore no ids: the scene renders this more than once on
 * a page, and duplicate SVG ids resolve to whichever came first.
 */
export function PlaceholderAvatar({
  size = 32,
  radius = 8,
  className,
}: {
  size?: number;
  radius?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius,
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #F1F4FB 0%, #DDE4F3 100%)",
        boxShadow: "inset 0 0 0 1px rgba(28,35,80,0.06)",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        style={{ display: "block" }}
      >
        <circle cx="20" cy="15.4" r="6.1" fill="#9BA7CB" />
        {/* Shoulders run off the bottom edge; the wrapper clips them. */}
        <path
          d="M20 23.6c7.3 0 13.2 4.9 13.2 10.9V40H6.8v-5.5C6.8 28.5 12.7 23.6 20 23.6Z"
          fill="#9BA7CB"
        />
      </svg>
    </span>
  );
}
