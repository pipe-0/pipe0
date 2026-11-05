import type { ComponentProps } from "react";
import { preload } from "react-dom";

const WIDTHS = [64, 128, 256, 384, 640, 828, 1080, 1200, 1920, 2048, 3840];

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

/**
 * An `<img>` that loads lazily, and from Cloudflare Transformations, which do
 * the resizing and format negotiation from the URL. `priority` is for images
 * above the fold: it preloads the image instead.
 */
export function Image({
  src,
  sizes,
  priority,
  alt = "",
  ...props
}: ComponentProps<"img"> & { src: string; priority?: boolean }) {
  const srcSet =
    TRANSFORMS && isRaster(src)
      ? WIDTHS.map((width) => `${imageUrl(src, width)} ${width}w`).join(", ")
      : undefined;
  const imageSizes = srcSet && (sizes ?? `${props.width ?? 1920}px`);
  const url = imageUrl(src, 1920);

  if (priority) {
    preload(url, {
      as: "image",
      fetchPriority: "high",
      imageSrcSet: srcSet,
      imageSizes,
    });
  }

  return (
    <img
      alt={alt}
      src={url}
      srcSet={srcSet}
      sizes={imageSizes}
      decoding="async"
      loading={priority ? undefined : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      {...props}
    />
  );
}
