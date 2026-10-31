import { useEffect, useRef, useState, type ComponentProps, type RefObject } from "react";
import { imageUrl } from "@/components/image";
import { cn } from "@/lib/utils";

/** True once the element has come within a screen of the viewport. */
function useNear(ref: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return near;
}

/**
 * A Blender loop (assets/illustrations/*.py) standing in for a still
 * illustration. Rendered on white and multiplied onto the dotted stage; the
 * still is the poster, so nothing jumps while it loads. Plays only while on
 * screen, and not at all with reduced motion.
 *
 * Poster and video are both requested only once the element is within a
 * screen of the viewport, so loops further down the page stay off the
 * initial load.
 */
export function LoopVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const near = useNear(ref);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // React doesn't render the `muted` attribute, and iOS Safari refuses to
    // play an unmuted video without a gesture — set it before play().
    v.muted = true;
    v.defaultMuted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      // The stills are large PNGs; serve a 1080w AVIF or WebP instead.
      poster={near ? imageUrl(poster, 1080) : undefined}
      muted
      loop
      playsInline
      preload={near ? "metadata" : "none"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      width={1000}
      height={750}
      className={cn("h-auto mix-blend-multiply", className)}
    />
  );
}

/**
 * An autoplaying loop whose file is requested only once it comes within a
 * screen of the viewport — `autoPlay` would otherwise fetch the whole file
 * with the page, whatever `preload` says.
 */
export function NearVideo({ src, ...props }: ComponentProps<"video"> & { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const near = useNear(ref);
  return <video ref={ref} src={near ? src : undefined} {...props} />;
}
