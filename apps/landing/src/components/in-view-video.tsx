"use client";

import { useEffect, useRef } from "react";

type InViewVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  /** Run once against the element after mount, e.g. to set playbackRate. */
  onElementReady?: (el: HTMLVideoElement) => void;
};

/**
 * A muted, looping demo `<video>` that only decodes while it's on screen.
 *
 * We deliberately drop the `autoPlay` attribute and drive play/pause from an
 * IntersectionObserver instead: a page can hold several of these at once, and
 * leaving them all decoding off-screen pins the GPU/CPU (and spins laptop
 * fans). Playing only the visible ones keeps the page light.
 */
export function InViewVideo({ onElementReady, ...props }: InViewVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    onElementReady?.(el);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if interrupted; muted inline video is allowed.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
    // onElementReady is treated as a mount-time hook for the element.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <video ref={ref} {...props} />;
}
