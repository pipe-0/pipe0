import { generate, getImageResponseOptions } from "@/app/og/docs/[...slug]/generate";
import { blog } from "@/lib/source";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

export const revalidate = false;

// Every param is enumerated by generateStaticParams, so there is nothing to
// render on demand.
export const dynamicParams = false;

/** Share image for posts without a cover — title and excerpt on the docs card. */
export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/blog/[slug]">,
) {
  const { slug } = await params;
  const page = blog.getPage([slug]);
  if (!page || page.data.draft === true) notFound();

  return new ImageResponse(
    generate({
      title: page.data.title,
      description: page.data.excerpt ?? page.data.description,
    }),
    await getImageResponseOptions(),
  );
}

export function generateStaticParams() {
  return blog
    .getPages()
    .filter((page) => page.data.draft !== true)
    .map((page) => ({ slug: page.slugs[0] }));
}
