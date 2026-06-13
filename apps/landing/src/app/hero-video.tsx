"use client";

/* Hero globe loop — a client component only because playbackRate has no
   HTML attribute and must be set on the element. */
export function HeroVideo() {
  return (
    <video
      src="/media/website/globe-loop.webm"
      className="absolute inset-x-0 bottom-[28%] w-full scale-[2] sm:bottom-0 sm:translate-y-[20%] sm:scale-100"
      width={2400}
      height={1350}
      style={{ objectFit: "contain" }}
      autoPlay
      loop
      muted
      playsInline
      aria-label="A slowly rotating globe"
      ref={(el) => {
        if (el) el.playbackRate = 0.75;
      }}
    />
  );
}
