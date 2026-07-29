import { InViewVideo } from "@/components/in-view-video";

/**
 * The rotating globe, kept for the mobile hero.
 *
 * The DOM scene that replaced it on desktop is a wide, detailed product shot
 * — at phone width its type is too small to read and it stops carrying the
 * idea. The globe reads at any size, so small screens keep it.
 *
 * One asset, H.264, for every engine. This used to branch on a Safari UA
 * sniff — Safari cannot decode the WebM's VP9 alpha (transparent areas paint
 * black) and software-decodes VP9 besides — and served everyone else a 926KB
 * transparent WebM. That branch cost more than it bought on a phone:
 *
 *  - Nothing could be decided until hydration, so the first render emitted an
 *    empty placeholder and the browser did not begin fetching the video until
 *    JavaScript had run. Rendered by the server instead, the fetch starts with
 *    the document.
 *  - The WebM was ~12x the size of the baked MP4 over a mobile connection.
 *  - VP9 is software-decoded on iOS and on plenty of Android hardware; H.264
 *    is hardware-decoded essentially everywhere, which is what the judder was.
 *
 * So the opaque MP4 — sky colour baked in, `.hero-panel-flat` behind it so the
 * video's edge is invisible, the saturated top layered back on in CSS — is now
 * simply the asset. It is also why `.hero-sky`'s drifting light pools are
 * switched off underneath (see globals.css): they animate forever behind a
 * layer that completely hides them.
 */
export function HeroGlobe() {
  return (
    <>
      <div className="hero-panel-flat absolute inset-0 z-0" aria-hidden />
      <InViewVideo
        src="/media/website/globe-loop-bg.mp4"
        poster="/media/website/globe-loop-poster.jpg"
        // Low enough that the horizon clears the CTAs above it.
        className="absolute inset-x-0 bottom-[6%] w-full scale-[1.9]"
        width={1600}
        height={900}
        style={{ objectFit: "contain" }}
        loop
        muted
        playsInline
        preload="auto"
        aria-label="A slowly rotating globe"
      />
      <div
        className="hero-safari-sky pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
      />
    </>
  );
}
