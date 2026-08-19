import { source, getPageImage } from "@/lib/source";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { generate, getImageResponseOptions } from "./generate";

export const revalidate = false;

// Every param is enumerated by generateStaticParams, so there is nothing to
// render on demand. Pinning this keeps unknown paths on the 404 route instead
// of waking a function for them.
export const dynamicParams = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">,
) {
  const { slug } = await params;
  // The last segment is "image.png", strip it to get the page slug
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    generate({
      title: page.data.title,
      description: page.data.description,
    }),
    await getImageResponseOptions(),
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
