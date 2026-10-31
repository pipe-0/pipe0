import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { preload } from "react-dom";

// Next's defaults, so browsers pick the same widths they do today.
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const ALL_SIZES = [16, 32, 48, 64, 96, 128, 256, 384, ...DEVICE_SIZES];

/**
 * Off until the site runs on a Cloudflare zone: /cdn-cgi/image does not exist
 * on workers.dev or in local dev, so pages keep the original files there.
 */
const TRANSFORMS = import.meta.env.VITE_IMAGE_TRANSFORMS === "1";

const isRaster = (src: string) =>
  src.startsWith("/") && /\.(png|jpe?g|webp)$/i.test(src);

/** The URL for one rendered width of a local raster image. */
export function imageUrl(src: string, width: number) {
  if (!TRANSFORMS || !isRaster(src)) return src;
  return `/cdn-cgi/image/width=${width},quality=75,format=auto${src}`;
}

function candidates(width: number | undefined, sizes: string | undefined) {
  if (sizes) {
    const vw = [...sizes.matchAll(/(^|\s)(1?\d?\d)vw/g)].map((m) => +m[2]!);
    const widths = vw.length
      ? ALL_SIZES.filter((s) => s >= DEVICE_SIZES[0]! * Math.min(...vw) * 0.01)
      : ALL_SIZES;
    return { widths, kind: "w" };
  }
  if (width === undefined) return { widths: DEVICE_SIZES, kind: "w" };
  const fit = (w: number) => ALL_SIZES.find((s) => s >= w) ?? ALL_SIZES.at(-1)!;
  return { widths: [...new Set([fit(width), fit(width * 2)])], kind: "x" };
}

type ImageProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "src" | "width" | "height"
> & {
  src: string;
  // Strings arrive from MDX images.
  width?: number | string;
  height?: number | string;
  /** Above the fold: preload it and skip lazy loading. */
  priority?: boolean;
};

/**
 * Responsive image with the same markup rules as next/image. Start has no
 * image component; Cloudflare Transformations do the resizing, and AVIF or
 * WebP negotiation, from the URL.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { src, width, height, sizes, priority, loading, style, alt = "", ...props },
  ref,
) {
  const w = width === undefined ? undefined : Number(width);
  const h = height === undefined ? undefined : Number(height);
  const transformed = TRANSFORMS && isRaster(src);
  let srcSet: string | undefined;
  let url = src;

  if (transformed) {
    const { widths, kind } = candidates(w, sizes);
    srcSet = widths
      .map(
        (size, i) =>
          `${imageUrl(src, size)} ${kind === "w" ? size : i + 1}${kind}`,
      )
      .join(", ");
    url = imageUrl(src, widths.at(-1)!);
  }

  if (priority) {
    preload(url, {
      as: "image",
      fetchPriority: "high",
      imageSrcSet: srcSet,
      imageSizes: transformed ? sizes : undefined,
    });
  }

  return (
    <img
      ref={ref}
      alt={alt}
      src={url}
      srcSet={srcSet}
      sizes={transformed ? sizes : undefined}
      width={w}
      height={h}
      decoding="async"
      loading={priority ? undefined : (loading ?? "lazy")}
      fetchPriority={priority ? "high" : undefined}
      style={{ color: "transparent", ...style }}
      {...props}
    />
  );
});
