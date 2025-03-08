import { getPostBySlug, Post } from "@/lib/blog";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "pipe0";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  let blogPage: Post | null = null;

  try {
    blogPage = await getPostBySlug(params.slug);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return notFound();
  }

  if (!blogPage) return notFound();

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#0E172A",
          width: "100%",
          height: "100%",
          display: "flex",
          gap: "64px",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0px 128px",
        }}
      >
        <img
          src="https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/511b41c0-b91f-47ee-42f8-19df1b544100/ogimage"
          alt="pipe0 Logo"
          height="64"
        />
        <div style={{ color: "white", fontSize: 64 }}>{blogPage?.title}</div>
        <div style={{ color: "#A1A1AB", fontSize: 32 }}>
          {blogPage?.excerpt || "Blog post"}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
